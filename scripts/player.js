const DISPLAY_FONTSIZE = 20;
const DISPLAY_WIDTH = 40 * DISPLAY_FONTSIZE;
const DISPLAY_HEIGHT = 25 * DISPLAY_FONTSIZE;

function swap(a, b) {
    let t = a;
    a = b;
    b = t;
}

class Inventory {
    list = [];
    constructor() {
        this.list = [];
    }
    addItem(item) {
        alert(123);       

        this.list.push(item);
    }
    drop(item) {
        for (let i=0;i<this.list.length;++i) {
            if (this.list[i] === item) {
                this.list[i] = this.list[this.list.length - 1];
                this.list.pop();
            }
        }
    }
    hasItem(item) {
        for (let i=0;i<this.list.length;++i) {
            let t = this.list[i];
            if (t === item) return true;
        }
        return false;
    }
}


// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript
function add_shadow(c1, d) {
    if (c1[0] !== '#') {
        return c1;
    }    
    let r = c1.charCodeAt(1); if (r >= 97) r -= 97 - 10; else r -= 48;
    let g = c1.charCodeAt(2); if (g >= 97) g -= 97 - 10; else g -= 48;
    let b = c1.charCodeAt(3); if (b >= 97) b -= 97 - 10; else b -= 48;
    r = Math.floor(r / 2) + 48;
    g = Math.floor(g / 2) + 48;
    b = Math.floor(b / 2) + 48;
    let c2 = '#' + String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b);    
    return c2;
}

class Camera {

    x = 0; y = 0;
    ox = 0; oy = 0;

    constructor(x, y, ox, oy) {        
        this.x = x; this.y = y;                
        this.ox = ox; this.oy = oy;
    }

    adjust() {
    	const o = MyGame.map.display.getOptions();
        const w = o.width, h = o.height;
    	
    	if (this.x - this.ox < 0) this.ox += this.x - this.ox;    	
        if (MyGame.map.width - this.x + this.ox < w) this.ox -= (MyGame.map.width - this.x + this.ox) - w + 1;
            	
    	if (this.y - this.oy < 0) this.oy += this.y - this.oy;        
    	if (MyGame.map.height - this.y + this.oy < h) this.oy -= (MyGame.map.height - this.y + this.oy) - h + 1;        
    }

    zoom(d) {
        let o = MyGame.map.display.getOptions();                        
        o.fontSize += d;        
        o.width = Math.floor(DISPLAY_WIDTH / o.fontSize);
        o.height = Math.floor(DISPLAY_HEIGHT / o.fontSize);        
                        
        setTimeout(() => { // Animation?
            MyGame.map.display.setOptions({
                width: o.width,
        	    height: o.height,
        	    fontSize: o.fontSize,
                space: 1.1,
                fontFamily: "Helvetica",
            });
        }, 1);
    }

    move(dx, dy) {        
    	this.x += dx; this.y += dy;
        const o = MyGame.map.display.getOptions();
        const w = o.width, h = o.height;
        const ww = Math.floor(w/2);
        const hh = Math.floor(h/2);

        if (dx > 0 && this.x < ww || dx < 0 && this.x > MyGame.map.width - ww) {
        	this.ox += dx; 
        } else if (dy > 0 && this.y < hh || dy < 0 && this.y > MyGame.map.height - hh){
        	this.oy += dy;
        } else {
        	this.adjust();	
        }
    }
}

var MyGame = {   
    
    engine: null,
    map: null,
    camera: null,    
    player: null,
    pedro: null,
    ananas: null,
    logs: [],

    initCamera() {
        const o = this.map.display.getOptions();
        const w = o.width, h = o.height;
        this.camera = new Camera(this.player.x, this.player.y, Math.floor(w/2), Math.floor(h/2));        
        this.camera.adjust();    
    },

    init() {

        if (this.inited) return;
        this.inited = true;

        this._MyPlayer = MyPlayer;
        this._Camera = Camera;
        this._Pedro = Pedro;
        this._Box = Box;
    
        this.map = new MyMap();
                
        this.status_display = new ROT.Display({
            width: 20,
            height: 16,
            fontSize: 20,
            space: 1.1,
            fontFamily: "Helvetica",
        });
        
        this.logs_display = new ROT.Display({
            width: 64,
            height: 4,
            fontSize: 20,
            space: 1.1,
            fontFamily: "Helvetica",
        });

        //document.body.appendChild(this.map.display.getContainer());
        //document.body.appendChild(this.logs_display.getContainer());
        var ctx = $('#screen')[0];
        ctx.appendChild(this.map.display.getContainer());
        $("#screen canvas:first").css("display", "none");

       // var ctx = $('#container')[0];
       // ctx.appendChild(this.status_display.getContainer());
    },      
    
    drawStatus() {
        this.status_display.drawText(0, 0, "伊莎貝拉");
        this.status_display.drawText(0, 1, ROT.Util.format("生命 %s/%s", this.player.hp, this.player.HP));
        this.status_display.drawText(0, 2, ROT.Util.format("魔力 %s/%s", this.player.mp, this.player.MP));        
        this.status_display.drawText(0, 3, ROT.Util.format("速 %s\n", this.player.speed));
        this.status_display.drawText(0, 4, ROT.Util.format("攻 %s\n", this.player.ap));
        this.status_display.drawText(0, 5, ROT.Util.format("防 %s\n", this.player.dp));
    },

    draw() {
        this.map.draw();
        this.drawStatus();
    }
};


class Event {
    x = 0;
    y = 0;    
    constructor(x, y) {
        this.x = x; this.y = y;
    }
    touch() {        
    }
    open() {        
    }
}

class Box extends Event {
    constructor(x, y) {        
        super(x, y);
        this.ch = '箱'; this.color = '#cc0';
    }
    empty() {
        return this.color === '#ddd';
    }
    open() {
        if (!this.empty()) {
            this.color = '#777';
        }
    }
    draw() {
        const key = this.x+','+this.y; let bg = MyGame.map.shadow[key]; if (!bg) return;
        MyGame.map.display.draw(this.x - MyGame.camera.x + MyGame.camera.ox, this.y - MyGame.camera.y + MyGame.camera.oy, this.ch, bg === '#fff' ? this.color : add_shadow(this.color));                            
    }
}

class Being {
    constructor(x, y, speed, hp, mp, ap, dp) {
        this.ch = '生'; this.color = '#fff';
        this.x = x; this.y = y;
        this._speed = speed; this.speed = speed;
        this._HP = hp; this.HP = hp; this.hp = hp;
        this._MP = mp; this.MP = mp; this.mp = mp;
        this._ap = this.ap = ap;
        this._dp = this.dp = dp;   
        this.inventory = new Inventory();     
    }
    dead() {
        this.ch = '死'; this.color = '#222';
    }
    draw() {
        MyGame.map.display.draw(this.x - MyGame.camera.x + MyGame.camera.ox, this.y - MyGame.camera.y + MyGame.camera.oy, this.ch, this.color);
    }
    hasItem(item) {
        return this.inventory.hasItem(item);
    }
    addItem(item) {
        this.inventory.addItem(item);
    }
}

class MyPlayer extends Being {
    constructor(x, y, speed, hp, mp, ap, dp) {
        super(x, y, speed, hp, mp, ap, dp);
        this.ch = "伊"; this.color = "#0be";
    }
    checkBox() {
        var key = this.x + "," + this.y;
        let b = MyGame.map.boxes[key]
        if (!b) {
            // alert("這裡沒有箱子。");
        } else {
            b.open();
        }                        
            /*else if (key == MyGame.ananas) {
                alert("你得到了寶石，贏得了遊戲！");
                MyGame.engine.lock();
                window.removeEventListener("keydown", this);
            } else {
                if (MyGame.color[key] === "#cc0") {
                    alert("箱子空空如也。");
                    MyGame.color[key] = '#333';
                }
            }*/
    }
    act() {
        MyGame.engine.lock();
        window.addEventListener("keydown", this);
    }
    handleEvent(e) {     

        var code = e.keyCode;
        if (code == 13 || code == 32) {
            var key = this.x + "," + this.y;
            let g = MyGame.map.ground[key];
            let d = MyGame.map.objectDefinitions[g];   

            if (d['open']) {
                d['open']();
            }
            this.checkBox();
            return;
        }
        if (code == 79) {
            MyGame.camera.zoom(1);
            return;
        }
        if (code == 80) {
            MyGame.camera.zoom(-1);
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
    
        /* one of numpad directions? */
        if (!(code in keyMap)) { return; }

        /* is there a free space? */
        var dir = ROT.DIRS[8][keyMap[code]];
        var newX = this.x + dir[0];
        var newY = this.y + dir[1];

        var newKey = newX + "," + newY;
        
        if (!(newKey in MyGame.map.ground)) { return; }
        let g = MyGame.map.ground[newKey];
        let d = MyGame.map.objectDefinitions[g];        

        MyGame.map.touch(newKey);

        if (!MyGame.map.pass(newKey)) return;

        if (MyGame.pedro && MyGame.pedro.x === newX && MyGame.pedro.y === newY) {
            
        } else {
            this.x = newX; this.y = newY;
            MyGame.camera.move(dir[0], dir[1]);
            MyGame.map.draw();            
        }

        window.removeEventListener("keydown", this);
        MyGame.engine.unlock();
    }    
}

class Pedro extends Being {
    constructor(x, y, speed, hp, mp, ap, dp) {
        super(x, y, speed, hp, mp, ap, dp);
        this.ch = "衛"; this.color = "#e00";        
    }
    act() {
        return;
        const x = MyGame.player.x, y = MyGame.player.y;
             
        var passableCallback = function(x, y) {
            return (x+","+y in MyGame.map.ground);
        }
        var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
    
        var path = [];
        var pathCallback = function(x, y) {
            path.push([x, y]);
        }
        astar.compute(this.x, this.y, pathCallback);
    
        path.shift();
        //console.log(path); // ???
        if (!path || path.length === 0) {        
            //alert("遊戲結束，你被活捉了！");
            //MyGame.engine.lock();        
        } else if (path.length === 1) {
            alert("啊！");
            MyGame.player.hp -= 1;
        } else {                    
            this.x = path[0][0]; this.y = path[0][1];            
        }
        MyGame.draw();
    }

    draw() {
        const key = this.x+','+this.y; let bg = MyGame.map.shadow[key]; if (bg !== '#fff') return;
        super.draw();
    }
}

// Original 

function Player(x, y, __map, __game) {
    /* private variables */

    let player = new MyPlayer(x, y);

    var __x = x;
    var __y = y;
    var __color = "#0f0";
    var __lastMoveDirection = '';

    var __display = __map._display;

    /* unexposed variables */

    this._canMove = false;

    /* wrapper */

    function wrapExposedMethod(f, player) {
        return function () {
            var args = arguments;
            return __game._callUnexposedMethod(function () {
                return f.apply(player, args);
            });
        };
    };

    /* exposed getters/setters */

    this.getX = function () { return __x; };
    this.getY = function () { return __y; };
    this.getColor = function () { return __color; };
    this.getLastMoveDirection = function() { return __lastMoveDirection; };

    this.setColor = wrapExposedMethod(function (c) {
        __color = c;
        __display.drawAll(__map);
    });

    this._moveToXY = function (x, y) {
        __x = x;
        __y = y;
        //__display.drawAll(__map);
        // play teleporter sound
        __game.sound.playSound('blip');        
    };    

    /* unexposed methods */

    // (used for teleporters)
    this._moveTo = function (dynamicObject) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: player._moveTo()';}

        // no safety checks or anything
        // this method is about as safe as a war zone
        __x = dynamicObject.getX();
        __y = dynamicObject.getY();
        __display.drawAll(__map);

        // play teleporter sound
        __game.sound.playSound('blip');
    };

    this._afterMove = function (x, y) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: player._afterMove()';}

        var player = this;

        this._hasTeleported = false; // necessary to prevent bugs with teleportation

        __map._hideChapter();
        __map._moveAllDynamicObjects();

        var onTransport = false;

        // check for collision with transport object
        for (var i = 0; i < __map.getDynamicObjects().length; i++) {
            var object = __map.getDynamicObjects()[i];
            if (object.getX() === x && object.getY() === y) {
                var objectDef = __map._getObjectDefinition(object.getType());
                if (objectDef.transport) {
                    onTransport = true;
                }
            }
        }

        // check for collision with static object UNLESS
        // we are on a transport
        if (!onTransport) {
            var objectName = __map._getGrid()[x][y].type;
            var objectDef = __map._getObjectDefinition(objectName);
            if (objectDef.type === 'item') {
                this._pickUpItem(objectName, objectDef);
            } else if (objectDef.onCollision) {
                __game.validateCallback(function () {
                    objectDef.onCollision(player, __game);
                }, false, true);
            }
        }

        // check for collision with any lines on the map
        __map.testLineCollisions(this);

        // check for nonstandard victory condition (e.g. DOM level)
        if (typeof(__game.objective) === 'function' && __game.objective(__map)) {
            __game._moveToNextLevel();
        }
    };

    this._pickUpItem = function (itemName, object) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: player._pickUpItem()';}

        var player = this;

        __game.addToInventory(itemName);
        __map._removeItemFromMap(__x, __y, itemName);
        __map.refresh();
        __game.sound.playSound('pickup');

        if (object.onPickUp) {
            __game.validateCallback(function () {
                setTimeout(function () {
                    object.onPickUp(player);
                }, 100);
                // timeout is so that written text is not immediately overwritten
                // TODO: play around with Display.writeStatus so that this is
                // not necessary
            });
        }
    };

    /* exposed methods */

    this.atLocation = wrapExposedMethod(function (x, y) {
        return (__x === x && __y === y);
    }, this);

    this.move = wrapExposedMethod(function (direction, fromKeyboard) {        
    }, this);

    this.killedBy = wrapExposedMethod(function (killer) {
        __game.sound.playSound('hurt');
        __game._restartLevel();

        __map.displayChapter('You have been killed by \n' + killer + '!', 'death');
    }, this);

    this.hasItem = wrapExposedMethod(function (itemName) {
        return __game.checkInventory(itemName);
    }, this);

    this.removeItem = wrapExposedMethod(function (itemName) {
        var object = __game.objects[itemName];

        __game.removeFromInventory(itemName);
        __game.sound.playSound('blip');
    }, this);

    this.getItem = wrapExposedMethod(function (itemName) {
        var object = __game.objects[itemName];
//        __game.getFromInventory(itemName);

        if (itemName == 'computer') {
            $('#editorPane').fadeIn();
            __game.editor.refresh();
        }
        else if (itemName == 'phone') {
            $('#phoneButton').show();
        }
        __game.addToInventory(itemName);
        __game.sound.playSound('blip');
    }, this);


    this.setPhoneCallback = wrapExposedMethod(function(func) {
        this._phoneFunc = func;
    }, this);
}
