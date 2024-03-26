import {AcGameObject} from '/KOF/static/js/ac_game_object/base.js';
import {Controller} from '/KOF/static/js/controller/base.js';

export class GameMap extends AcGameObject {
    constructor(root){
        super();
        this.root = root;
        //canvas应该能读取键盘数据，需要聚焦，属性tabindex=0;
        this.$canvas = $(`<canvas  width="1280" height="700" tabindex=0></canvas>`); 
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();
        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));

        this.time_left = 60000; //单位： ms;
        this.$timer = this.root.$kof.find(`.kof-head-timer`);
    }
    start() {
        //console.log('hh');
    }
    update() {

        this.time_left -= this.timedelta; //减去时间间隔;
        if(this.time_left <= 0) {
            this.time_left = 0;
           let [a,b] = this.root.players;
           if(a.status !== 6 && b.status !== 6){
            a.status = b.status = 6;
            a.frame_current_cnt =b.frame_current_cnt= 0;
            a.vx = b.vx = 0;
           }
        }
        this.$timer.text(parseInt(this.time_left / 1000)); //把时间渲染到timer里面

        this.render();
    }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width,this.ctx.canvas.height);
        //console.log(this.ctx.canvas.width);
        // this.ctx.fillStyle = "black";
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }
}