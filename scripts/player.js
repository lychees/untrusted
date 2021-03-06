const DISPLAY_FONTSIZE = 20;
const DISPLAY_WIDTH = 40 * DISPLAY_FONTSIZE;
const DISPLAY_HEIGHT = 25 * DISPLAY_FONTSIZE;

function attack(alice, bob) {    

    if (bob.hp <= 0) return;

    let miss = dice(6)+dice(6);
    if (miss < 6) {
        MyGame.SE.playSE("Wolf RPG Maker/[Action]Swing1_Komori.ogg");        
        MyGame.logs.push(bob.name + '躲開了' + alice.name + '的攻擊');
        return; 
    }

    let dmg = dice(6)+dice(6);
   // alice.hp -= 1; if (alice.hp <= 0) alice.dead();
    MyGame.SE.playSE("Wolf RPG Maker/[Effect]Attack5_panop.ogg");
   
    bob.hp -= dmg; 
    MyGame.logs.push(alice.name + '對' + bob.name + '造成了' + dmg + '點傷害。'); 
    if (bob.hp <= 0) {
        bob.dead();
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
    isDead() {
        return this.hp <= 0;
    }
    dead() {
        MyGame.logs.push(this.name + '陷入了昏迷。'); 
        this.color = '#222';
    }
    heal(d) {        
        this.hp += d;
        if (this.hp > this.HP) this.hp = this.HP;
    }
    draw() {
        MyGame.map.display.draw(this.x - MyGame.camera.x + MyGame.camera.ox, this.y - MyGame.camera.y + MyGame.camera.oy, this.ch, this.color);
    }
    hasItem(item) {
        return this.inventory.hasItem(item);
    }
    addItem(item) {
        MyGame.logs.push(this.name + '得到了' + item.name);
        this.inventory.addItem(item);
    }
}

class MyPlayer extends Being {
    constructor(x, y, speed, hp, mp, ap, dp) {
        super(x, y, speed, hp, mp, ap, dp);
        this.ch = "伊"; this.color = "#0be";
        this.name = "伊莎貝拉";
    }
    dead() {
        MyGame.logs.push('你挂了，死亡夺取了你 3000 点经验。'); 
        MyGame.SE.playSE('狂父/[びたちー]少女（悲鳴）.ogg');        
        super.dead();
    }
    act() {
        MyGame.engine.lock();
        window.addEventListener("keydown", this);
    }
    handleEvent(e) {     

        var code = e.keyCode;
        if (code == 13 || code == 32) {
            var key = this.x + "," + this.y;

            let e = MyGame.map.layer[key];
            if (e) {
                for (let i=0;i<e.length;++i) {
                    let d = MyGame.map.objectDefinitions[e[i]];
                    if (d['open']) {
                        d['open'](e,i);
                    }  
                }
            }
            
            let g = MyGame.map.ground[key];
            let d = MyGame.map.objectDefinitions[g];   
            if (d['open']) {
                d['open']();
            }
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

        let block = false;
        for (let i=0;i<MyGame.agents.length;++i) {
            let a = MyGame.agents[i];
            if (newX === a.x && newY === a.y && a.hp > 0) {
                attack(this, a);
                block = true;
                break;
            }
        } 
        
        if (!block){
            this.x = newX; this.y = newY;
            MyGame.camera.move(dir[0], dir[1]);    
        }

        MyGame.map.draw(); 
        window.removeEventListener("keydown", this);
        MyGame.engine.unlock();
    }    
}

class Pedro extends Being {
    constructor(x, y, speed, hp, mp, ap, dp) {
        super(x, y, speed, hp, mp, ap, dp);
        this.ch = "衛"; this.color = "#e00";  
        this.name = "衛兵";      
    }
    move(x, y) {
        let block = false;

        if (x === MyGame.player.x && y === MyGame.player.y) {
            attack(this, MyGame.player);
            block = true;
        }
        if (!block) {
            for (let i=0;i<MyGame.agents.length;++i) {
                let a = MyGame.agents[i];
                if (x === a.x && y === a.y && a.hp > 0) {
                    block = true;
                    break;
                }
            }    
        }     
        if (!block){
            this.x = x; this.y = y;
        }
        MyGame.draw();
    }
    act() {
        if (this.isDead()) return;

        let fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
            return MyGame.map.light(x+','+y);
        });

        let visible = {};

        fov.compute(this.x, this.y, 122, function(x, y, r, visibility) {
            const key = x+','+y;   
            visible[key] = true;
        });

        const x = MyGame.player.x, y = MyGame.player.y;
        let key = x+','+y;
        if (!visible[key]) return;
             
        var passableCallback = function(x, y) {
            return MyGame.map.pass(x+","+y);
        }
        var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
    
        var path = [];
        var pathCallback = function(x, y) {
            path.push([x, y]);
        }
        astar.compute(this.x, this.y, pathCallback);    

        path.shift();
        console.log(path); // ???
        if (!path || path.length === 0) {     
            //attack(this, MyGame.player);   
            //alert("遊戲結束，你被活捉了！");
            //MyGame.engine.lock();        
        } else {
            this.move(path[0][0], path[0][1]);  
        }
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
