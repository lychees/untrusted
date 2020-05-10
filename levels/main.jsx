#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced": ["ROT.Map.DividedMaze", "player.atLocation"],
    "music": ""
}
#END_PROPERTIES#
#BEGIN_EDITABLE#
/********************
 * 逃亡 *
 ********************
 *
 * 伊莎貝拉的逃亡計劃很快被衛兵發現。
 * 你必須要趕在援軍集結之前，從密道逃往城外。
 */
let _game = null;
let _map = null;
let _player = null;
let _agents = null;

const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;

function pop_random(cells) {
    let index = Math.floor(ROT.RNG.getUniform() * cells.length);
    let key = cells.splice(index, 1)[0];
    return key;
}

function generateApples(cells, num) {
    for (let i=0;i<num;i++) {
        let key = pop_random(cells);
        var parts = key.split(",");
        if (!_map.layer[key]) _map.layer[key] = [];
        _map.layer[key].push("蘋果");
    }
}

function init() {
    
    _game.init();
    _map = _game.map;
    _player = _game.player;    
    _agents = _game.agents;
    
    _map.defineObject('上', {
        'symbol': '上',
        'pass': true,
        'light': true,
        'color': '#eee',   
        'open': function(handle) {
            //_game.SE.playSound('complete');
            _game.SE.playSE("Wolf RPG Maker/[Action]Steps1_Isooki.ogg");
            //_game.getLevelByPath('levels/bonus/1-the-imorisoned-bird.jsx');
            _game.getLevelByPath('levels/bonus/2-1-dungeon.jsx');
        },
    });        

    _map.defineObject('蘋果', {
        'symbol': '蘋',
        'pass': true,
        'light': true,
        'color': '#a11',  
        'touch': function(handle) {
            //alert('touch');
            _player.addItem('蘋果');
        },
        'open': function(a, b) {
            //alert("open");
            //_game.SE.playSound('complete');
            //_game.SE.playSE("Wolf RPG Maker/[Action]Steps1_Isooki.ogg");
            //_game.getLevelByPath('levels/bonus/1-the-imorisoned-bird.jsx');
            //_game.getLevelByPath('levels/bonus/2-1-dungeon.jsx');
            _player.addItem('蘋果');
         //   console.log(self);
           // self = null;
           a[b] = null;
        },
    });       

    _map.clear();
    _map.width = MAP_WIDTH;
    _map.height = MAP_HEIGHT;
    var digger = new ROT.Map.Digger(_map.width, _map.height);
    //var digger = new ROT.Map.Arena(_map.width, _map.height); 

    let freeCells = [];        
    var digCallback = function(x, y, value) {
        if (value) { return; }            
        var key = x+","+y;
        _map.ground[key] = "　";
        freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    generateApples(freeCells,  5); 

    if (!_player) {
        _game.player = _map.createBeing(_game._MyPlayer, freeCells);
        _player = _game.player;
    } else {
        let t = pop_random(freeCells);
        let parts = t.split(",");        
        _player.x = parseInt(parts[0]);
        _player.y = parseInt(parts[1]);  
    }

    let t = pop_random(freeCells);
    _map.ground[t] = '上';

    for (let i=0;i<2;++i) {
        let t = pop_random(freeCells);
        let parts = t.split(",");
        let x = parseInt(parts[0]);
        let y = parseInt(parts[1]);
        _agents.push(new _game._Pedro(x, y, 7, 5, 5, 1, 0));
    }
    _agents.push(_player);

    _game.initCamera();
    _game.draw(); 
    
    let scheduler = new ROT.Scheduler.Simple();
    //scheduler.add(_player, true);
    for (let i=0;i<_agents.length;++i) {
        scheduler.add(_agents[i], true); 
    }
    _game.engine = new ROT.Engine(scheduler);        
    _game.engine.start();
}

#END_EDITABLE#
function startLevel(map) {
#START_OF_START_LEVEL#
    _game = map._game.myGame;
    _game._game = map._game;
    map.placePlayer(0,0);
    let p = map.getPlayer();
    p.getItem('phone');
    p.getItem('computer');
    p.getItem('blueKey');
    init();
#END_OF_START_LEVEL#
}
