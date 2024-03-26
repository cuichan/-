export class Controller {
    constructor($canvas) {
        // 读取键盘输入；
        this.$canvas = $canvas;

        this.pressed_keys = new Set(); //Set是集合；
        this.start(); //因为要从键盘输入东西，所以一开始就要调用；
    }
    start() {
        //console.log("jj");
        let outer = this;
        this.$canvas.keydown(function(e) {
            outer.pressed_keys.add(e.key);
            //console.log(e.key);
        });
        this.$canvas.keyup(function(e) {
            outer.pressed_keys.delete(e.key); 
        });
    }
}