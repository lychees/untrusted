#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["map.getObjectTypeAt", "player.getX", "player.getY", "player.getItem",
         "map.refresh"],
    "mapProperties": {
        "allowOverwrite": true
    },
    "music": "Aquaria_Title"
}
#END_PROPERTIES#
/*******************
 * 籠中之鳥 *
 *******************
 * ...
 * 夜色漸深，伊莎貝拉從假寐中緩緩睜開雙眼，
 * 早晨就是約定交質的日子了，
 * 要逃跑的話，只有抓住現在。
 */
#BEGIN_EDITABLE#
let _game = null;
let _map = null;
let _player = null;

/*
map.defineObject('water', {
    'symbol': '░',
    'color': '#44f',
    'onCollision': function (player) {
        player.killedBy('drowning in deep dark water');
    }
});*/

function initMap() {
    var grid = [
        '牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆關關牆牆牆牆牆牆牆牆牆牆牆牆牆',
        '牆　　　　　　　　　　　　　牆　　牆　　　　　　　　　　　　　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　牆　　牆　　　　　　　　　　　　　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　牆　　牆　　　　　　　　　　　　　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　牆關關牆　　　　　　　　　　　　　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　牆',                            
        '牆　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　牆',
        '牆牆牆牆牆牆牆牆牆牆牆牆關關牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆關關牆牆牆牆',
        '牆　劍　　　　　　　　　　　　櫃櫃牆　　　　　　　　　　　牆　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　　櫃櫃牆　　　　　　　　　　　牆　　　　　　　　　牆',
        '牆　　　　　　　　　　　　　　櫃櫃牆　　　　　　　　　　　牆　　　　　　　　　牆',
        '牆桌　　床床　　　　　　　　　櫃櫃牆　　　　　　　　　　　牆　　　　　　　　　牆',
        '牆鏡　　床床　　　　　　　　　櫃櫃牆　　　　　　　　　　　牆　　　　　　　　　牆',
        '牆桌　伊床床　櫃　　　　　　　櫃櫃牆　　　　　　　　　　　牆　　　　　　　　　牆',
        '牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆牆'
      ];

    _map.defineObject('劍', {
        'verdict_poetry': 
            '几片晴沙映野田，数声清笛落秋烟。\n \
             海天浩瀚孤云外，树杪依微夕照边。\n \
             远浦人归渔火近，敢辞先赐即求田。\n \
             只言三尺青丝鞚，肯作龙骧九万弦。\n',
        'description':  
            '少女慣用的愛劍，劍身如水，澄澈如鏡，是謂「水鏡」。可以將劍身周圍的元素魔法，轉化為水係魔法，為己所用。\n \
             ATK: 7d2',
        'symbol': '劍',
        'color': '#2fe',
        'pass': true,
        'light': true,        
        'open': function(handle) {
            alert("你回收了愛劍")
            handle = null;
        },
        'behavior': function (me) {
            me.move(raftDirection);
        }
    });
    
    _map.defineObject('床', {
        'symbol': '床',
        'pass': false,        
        'light': true
    });       

    _map.defineObject('鏡', {
        'symbol': '鏡',
        'pass': false,        
        'light': false,
        'color': '#3fe',
        'a': "鏡中映射出少女的容顏",
        'touch': function() {
            alert(this['a']);            
        },        
        'behavior': function (me) {
            me.move(raftDirection);
        }
    });

    _map.defineObject('臥室門', {
        'touch': function() {
            alert('where is key?');            
        }
    });       

    let w = grid[0].length;
    let h = grid.length;
    _map.width = w;
    _map.height = h;
    for (let i=0;i<w;++i) {
        for (let j=0;j<h;++j) {
            let c = grid[j][i];
            const key = i+','+j;
            if (c === '伊') {
                _game.player = new _game._MyPlayer(i, j, 7, 10, 5, 1, 0);
                _player = _game.player;
                c = '　';
            }
            if (c === '關') {
                console.log('關', key);
            }
            _map.ground[key] = c;            
            _map.shadow[key] = '#555';
        }
    }

    _map.layer['12,9'] = ['臥室門'];
    _map.layer['13,9'] = ['臥室門'];
}

function init() {
    _game.init(); 
    _map = _game.map;
    initMap();
    _game.initCamera();
    _game.draw(); 

    console.log(_player);
    
    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(_player, true);
    _game.engine = new ROT.Engine(scheduler);
    console.log(_game.engine);
    _game.engine.start();
}
#END_EDITABLE#
function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('第 一 章\n籠 中 之 鳥');
    _game = map._game.myGame;
    map.placePlayer(0,0);
    let p = map.getPlayer();
    p.getItem('phone');
    p.getItem('computer');
    p.getItem('blueKey');
    init();
/*    map.defineObject('door', {
        'symbol': 'n',
        'color': '#88f',
        'onCollision': function (player) {
            game.sound.playSE('魔王魂/[魔王]ドア開.ogg');
        }
    });*/
#END_OF_START_LEVEL#
}