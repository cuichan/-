let AC_GAME_OBJECT = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECT.push(this);

        this.timedelta = 0;
        this.has_call_start = false; //判断是否第一次
    }

    start() { //开始执行一次

    }
    update() { //每帧执行一次，开始帧除外

    }
    destroy() {
        for(let i in AC_GAME_OBJECT) {
            if(AC_GAME_OBJECT[i] === this){
                AC_GAME_OBJECT.splice(i,1);
                break;
            }
        }
    }
}

 // for循环中，in枚举下标，of 枚举值；
let last_timestamp ;
let AC_GAME_OBJECT_FRAME = function(timestamp) {
    for(let obj of AC_GAME_OBJECT){
        if(!obj.has_call_start){
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECT_FRAME);
}
requestAnimationFrame(AC_GAME_OBJECT_FRAME);

export { 
    AcGameObject
}