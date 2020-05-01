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
 * Well, it looks like they're on to us. The path isn't as
 * clear as I thought it'd be. But no matter - four clever
 * characters should be enough to erase all their tricks.
 */
#BEGIN_EDITABLE#
let __map = null;
let __player = null;

var Camera = {
    x: 0,
    y: 0,
    ox: 0,
    oy: 0
};

var MyPlayer = function(x, y) {
    __map.placePlayer(x, y);
    this.player = __map.getPlayer();
    console.log("item");
    this.player.getItem('phone');
    this.player.getItem('computer');
    this.player.getItem('blueKey');    
};

MyPlayer.prototype.act = function() {
    //alert("123");
};

let Game = {
    display: null,
    map: {},
    width: 0,
    height: 0,
    camera_x: 0,
    camera_y: 0,
    offset_x: 0,
    offset_y: 0,
    engine: null,
    player: null,
    pedro: null,
    ananas: null,
     
    init: function() {
        this.display = new ROT.Display({
            width: 50,
            height: 25,
            fontSize: 20,
        });
 
        // document.body.appendChild(this.display.getContainer());         
        this._generateMap();
         
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        // scheduler.add(this.pedro, true);
 
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
        //alert(123);
    },
 
    _adjustCamera() {
        let o = this.display.getOptions();
        let w = o.width;
        let h = o.height;
         
        if (this.camera_x - this.offset_x < 0) this.offset_x += this.camera_x - this.offset_x;       
        else if (this.width - this.camera_x + this.offset_x < w) this.offset_x -= (this.width - this.camera_x + this.offset_x) - w + 1;
         
        if (this.camera_y - this.offset_y < 0) this.offset_y += this.camera_y - this.offset_y;
        else if (this.height - this.camera_y + this.offset_y < h) this.offset_y -= (this.height - this.camera_y + this.offset_y) - h + 1;
    },
 
    _moveCamera: function(dx, dy) {    
        
        console.log('camera: ', dx, dy);

        this.camera_x += dx; this.camera_y += dy;
        let o = this.display.getOptions();
        let w = o.width, h = o.height; 
        let ww = Math.floor(w/2);
        let hh = Math.floor(h/2);
 
        console.log(dx, this.camera_x, ww);
 
        if (dx > 0 && this.camera_x < ww || dx < 0 && this.camera_x > this.width - ww) {
            this.offset_x += dx; 
        } else if (dy > 0 && this.camera_y < hh || dy < 0 && this.camera_y > this.height - ww){
            this.offset_y += dy;
        } else {
            this._adjustCamera();   
        }
    },
 
    _generateMap: function(map) {      
        this.width = 60;
        this.height = 40;
        var digger = new ROT.Map.Cellular(this.width, this.height, {
            born: [4, 5, 6, 7, 8],
            survive: [2, 3, 4, 5],
        });
        digger.randomize(0.9);
       //var digger = new ROT.Map.Arena(this.width, this.height); 
       //var digger = new ROT.Map.Digger(this.width, this.height); 
       //var digger = new ROT.Map.EllerMaze(this.width, this.height); 
       
        var freeCells = [];
         
        var digCallback = function(x, y, value) {
            if (value === 1) value = '#';
            var key = x+","+y;
            this.map[key] = value;

            if (!value) {
                freeCells.push(key);
            }
        }
        digger.create(digCallback.bind(this));
         
        //this._generateBoxes(freeCells);
        //this._drawWholeMap();         
        
     
       /* __player = new MyPlayer(this.player._x, this.player._y);*/
        /*this.pedro = this._createBeing(Pedro, freeCells);                
        */

        let o = this.display.getOptions();
        let w = o.width;
        let h = o.height;        
        this.player = this._createBeing(Player, freeCells); 
        this.camera_x = this.player._x;
        this.camera_y = this.player._y;
        this.offset_x = Math.floor(w/2);
        this.offset_y = Math.floor(h/2);
        this._adjustCamera();
        this._drawWholeMap();
    },
     
    _createBeing: function(what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);        
        return new what(x, y);
    },
     
    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
            if (!i) { this.ananas = key; } /* first box contains an ananas */
        }
    },
 

    _drawWholeMap: function() {
        let o = this.display.getOptions();
        let w = o.width;
        let h = o.height; 

        console.log("redraw", w, h);
     
        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {
                let xx = x + this.camera_x - this.offset_x;
                let yy = y + this.camera_y - this.offset_y;
                let key = xx+','+yy;                
                //this.display.draw(x, y, this.map[key]);   
                                
                if (this.map[key] === '#') {
                    __map.placeObject(x,y, 'block');
                }
                else {
                    __map.placeObject(x,y,'empty');
                }                
            }
        }
        if (this.player) this.player._draw();
        if (this.pedro) this.pedro._draw();
    }
};
 
var Player = function(x, y) {
    this._x = x;
    this._y = y;
    //this._draw();
}
     
Player.prototype.getSpeed = function() { return 100; }
Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }
 
Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}
 

let time = 0;
     
Player.prototype.handleEvent = function(e) {

    time += 1;
    if (time % 3 !== 0) return;
    //return;
    var code = e.keyCode;
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }
 
    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;
 
    if (!(code in keyMap)) { return; }
    var dir = ROT.DIRS[8][keyMap[code]];


    var newX = this._x + dir[0];
    var newY = this._y + dir[1];
 
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; }
 
    this._x = newX;
    this._y = newY;
    console.log(time, ": ");
    Game._moveCamera(dir[0], dir[1]);
    Game._drawWholeMap();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}
 
Player.prototype._draw = function() {
    __map.placePlayer(this._x - Game.camera_x + Game.offset_x, this._y - Game.camera_y + Game.offset_y);
    this.player = __map.getPlayer();
    this.player.getItem('phone');
    this.player.getItem('computer');
    this.player.getItem('blueKey'); 
    //Game.display.draw(this._x - Game.camera_x + Game.offset_x, this._y - Game.camera_y + Game.offset_y, "@", "#ff0");
}
     
Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    if (Game.map[key] != "*") {
        alert("There is no box here!");
    } else if (key == Game.ananas) {
        alert("Hooray! You found an ananas and won this game.");
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        alert("This box is empty :-(");
    }
}
#END_EDITABLE#

function startLevel(map) {
#START_OF_START_LEVEL#

    __map = map; Game.init();
    //map.placePlayer(7, 5);
   // Game.init();
   /* var maze = new ROT.Map.Arena(map.getWidth(), map.getHeight());    
    maze.create( function (x, y, mapValue) {
        // don't write maze over player    
        if (map.getPlayer().atLocation(x,y)) {
            return 0;
        }
        else if (mapValue === 1) { //0 is empty space 1 is wall
            map.placeObject(x,y, 'block');
        }
        else {
            map.placeObject(x,y,'empty');
        }
    });*/    
#END_OF_START_LEVEL#
}
