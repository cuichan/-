import {AcGameObject} from '/KOF/static/js/ac_game_object/base.js';

export class Player extends AcGameObject{
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        // 因为角色的移动，跳跃等动作都是不同的，所以还应该有状态；
        this.direction = 1; //游戏而言，一般有位置速度方向三个独立且相关变量；
        // 1 是朝右，-1朝左；

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; //水平速度
        this.speedy = -1000; //竖直初速度

        this.gravity = 50;
        this.ctx = this.root.game_map.ctx; // 找到地图里的画笔;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        this.status = 3; // 0: 待机（idle),1: 向前，2： 向后，3 ：跳跃，4： 攻击，5： 被打，6： 死亡；


        this.animations = new Map(); 
        this.frame_current_cnt = 0;
        this.hp = 100;

        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id} > div`); //找血条;
        this.$hp_div = this.$hp.find(`div`);
    }

    start() {

    }

    update_controll(){
        let w,a,d,space;

        if(this.id === 0){
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');

        }else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        //console.log(this.pressed_keys);

        if(this.status === 0 || this.status === 1){
            //
            if(space){
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if(w){
                if(d){
                    this.vx = this.speedx;
                }else if(a){
                    this.vx = - this.speedx;
                }else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0; // 从头播放跳跃动画;
            } else if(d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if(a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                
                this.status = 0;
            }
        }
    }

    update_move() {
        //if(this.status === 3){
            this.vy += this.gravity;
        //}
        

        this.x += this.vx * this.timedelta /1000;
        this.y += this.vy * this.timedelta /1000;

        // 99-115 行来让人物无法重叠;

        // let [a,b] = this.root.players;

        // if( a!== this) [a,b] = [b,a]; //交换一下二人；
        // let r1 = {
        //     x1: a.x,
        //     y1: a.y,
        //     x2: a.x + a.width, 
        //     y2: a.y + a.height
        // }
        // let r2  = {
        //     x1: b.x,
        //     y1: b.y, //
        //     x2: b.x + b.width,
        //     y2: b.y + b.height
        // }
        // if(this.is_collision(r1, r2)){  // 如果二者有交集就取消运动(减号是)，+号是推人;
        //     b.x += this.vx * this.timedelta /1000 / 2;
        //     b.y += this.vy * this.timedelta /1000 / 2;
        //     a.x -= this.vx * this.timedelta /1000 / 2;
        //     a.y -= this.vy * this.timedelta /1000 / 2;
        //     if(this.status === 3)
        //     this.status = 0;
        // }
        if(this.y > 450){
            this.y = 450;
            this.vy = 0;
            if(this.status === 3)
            this.status = 0;
        }
        if(this.x < 0){
            this.x = 0;
        } else if(this.x + this.width > this.root.game_map.$canvas.width()){
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        if(this.status === 6) return ;

        let players = this.root.players;
        if(players[0] && players[1]){
            let me = this, you = players[1 - 0];
            if(me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_attack() {
        if(this.status === 6) return ;
        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp = Math.max(this.hp - 20, 0);
        this.$hp_div.animate({ //渐变效果的血条消失;
            width: this.$hp.parent().width() * this.hp / 100
            
        },300);
        this.$hp.animate({ //渐变效果的血条消失;
            width: this.$hp.parent().width() * this.hp / 100
            
        },600);
        //this.$hp.width(this.$hp.parent().width() * this.hp / 100);
        if(this.hp <=0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }
    is_collision(r1, r2) {
        if(Math.max(r1.x1,r2.x1) > Math.min(r1.x2,r2.x2))
            return false;
        if(Math.max(r1.y1,r2.y1) > Math.min(r1.y2,r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if(this.status === 4 && this.frame_current_cnt === 18) {
            //this.status = 0;  判断挥拳是哪一帧率； 
            let me = this, you = this.root.players[1 - this.id];

            let r1;
            if(this.direction > 0){
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 -100,
                    y1: me.y + 40,
                    x2: me.x + me.width -120,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {
                x1: you.x,
                y1: you.y, 
                x2: you.x + you.width,
                y2: you.y + you.height,
            }
            if(this.is_collision(r1,r2)) {
                you.is_attack();
            }
        }
    }

    update() {
        this.update_controll();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }
    render() {
        // 碰撞盒子用于确认坐标；
        //  this.ctx.fillStyle = 'blue';
        //  this.ctx.fillRect(this.x, this.y , this.width, this.height);
        // //console.log(this.x,this.y,this.width, this.height,this.color);
        // if(this.direction > 0){
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);
        // } else {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x - 120 + this.width - 100, this.y + 40, 100, 20);
        // }
        
        let status = this.status;

        if(this.status === 1 && this.direction * this.vx < 0) status =2;
        let obj = this.animations.get(status); // 这一部分取得的status与gif的关系；
        if(obj && obj.loaded){
            if(this.direction > 0) {

            let k  = parseInt(this.frame_current_cnt / obj.frame_rate)  % obj.frame_cnt; //循环渲染；
            let image = obj.gif.frames[k].image;
            this.ctx.drawImage(image,this.x,this.y + obj.offset_y,image.width * obj.scale,image.height * obj.scale);

        }else {
            this.ctx.save(); //先保存配置

            this.ctx.scale(-1,1); //内置函数不需要管，反转坐标系来达到镜像Gif图片的目的;
            this.ctx.translate(-this.root.game_map.$canvas.width(),0); //旋转坐标系结束;
            let k  = parseInt(this.frame_current_cnt / obj.frame_rate)  % obj.frame_cnt; 
            //循环渲染
            let image = obj.gif.frames[k].image;
            this.ctx.drawImage(image,this.root.game_map.$canvas.width() - this.x-this.width,this.y + obj.offset_y,image.width * obj.scale,image.height * obj.scale);
            this.ctx.restore();
        }
    }
        
        if(status === 4 || status === 5 || status === 6){ 
            //当处于攻击动作时，如果动画播放完成，就变为静止动作；
                if(this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)){ //闪一下的原因是因为再次播放了第一帧;
                    if(status === 6) {
                        this.frame_current_cnt --; //最后++，这里--，所以一直处于倒地状态;
                    }
                    else this.status = 0;
        
            }
            
            
        }
        this.frame_current_cnt++;
    }
}