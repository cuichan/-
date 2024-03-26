import {GameMap} from '/KOF/static/js/game_map/base.js';
import {Kyo} from '/KOF/static/js/player/kyo.js';

class KOF {
    constructor(id){
        this.$kof = $('#'+id);
        // 选择器
        // 创建地图对象在总类比里面
        this.game_map = new GameMap(this);
       // console.log(this.$kof);
       this.players = [
        new Kyo(this,{
            id: 0,
            x: 200,
            y: 0,
            width: 120,
            height: 200,
            color: 'blue',
        }),
        new Kyo(this,{
            id: 1,
            x: 900,
            y: 0,
            width: 120,
            height: 200,
            color: 'red',
        }),
       ];
    }
}
export {
    KOF
}