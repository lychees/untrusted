#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced": ["ROT.Map.DividedMaze", "player.atLocation"],
    "music": "gurh"
}
#END_PROPERTIES#
/********************
 * theLongWayOut.js *
 ********************
 *
 * 伊莎貝拉的逃亡計畫很快敗露。
 */
let _game = null;
let _map = null;
let _player = null;
let _pedro = null;

#BEGIN_EDITABLE#

const MAP_WIDTH = 64;
const MAP_HEIGHT = 32;


function init() {
    
    _game.init(); 
    _map = _game.map;

    _map.width = MAP_WIDTH;
    _map.height = MAP_HEIGHT;
    var digger = new ROT.Map.Digger(this.width, this.height);
    // var digger = new ROT.Map.Arena(this.width, this.height); 

    let freeCells = [];        
    var digCallback = function(x, y, value) {
        if (value) { return; }            
        var key = x+","+y;
        _map.ground[key] = " ";
        freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    // this.generateBoxes(freeCells); 
    _game.player = _map.createBeing(_game._MyPlayer, freeCells);
    _game.pedro = _map.createBeing(_game._Pedro, freeCells);
    _player = _game.player;
    _pedro = _game.pedro;

    const o = _map.display.getOptions();
    const w = o.width, h = o.height;
    _game.camera = new _game._Camera(_player.x, _player.y, Math.floor(w/2), Math.floor(h/2));        
    _game.camera.adjust();    
    _game.draw(); 

   var scheduler = new ROT.Scheduler.Simple();
   scheduler.add(_player, true);
   scheduler.add(_pedro, true);
   _game.engine = new ROT.Engine(scheduler);        
   _game.engine.start();
}


#END_EDITABLE#



function startLevel(map) {
#START_OF_START_LEVEL#
    _game = map._game.myGame;
    map.placePlayer(0,0);
    let p = map.getPlayer();
    p.getItem('phone');
    p.getItem('computer');
    p.getItem('blueKey');
    init();
#END_OF_START_LEVEL#
}
