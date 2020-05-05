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
 * 醒來吧 ...
 * ...
 * 醒來吧，伊莎貝拉殿下。
 * 伊莎貝拉：“你是誰？”
 * 我是水之妖精溫蒂妮，受璐娜公主的委託，前來引導你逃出地牢。
 * 明天就是交換人質的日子，伊莎貝拉決定掙脫命運的束縛。
 *
 */
#BEGIN_EDITABLE#
let _game = null;
let _map = null;
let _player = null;

function initMap() {
    var grid = [
        '#####################',
        '######   ###    #xxx#',
        '##   #   ###    #   #',
        '##       #      #   #',
        '##       #      #   #',
        '##       #    kg#   #',
        '##       #    ###   #',
        '##              #   #',
        '##                  #',
        '####T##             #',
        '#     #             #',
        '#   @ #             #',
        '#####################'
      ];
    let w = grid[0].length;
    let h = grid.length;
    _map.width = w;
    _map.height = h;
    for (let i=0;i<w;++i) {
        for (let j=0;j<h;++j) {
            let c = grid[j][i];
            const key = i+','+j;
            if (c === '@') {
                _game.player = new _game._MyPlayer(i, j, 7, 10, 5, 1, 0);
                _player = _game.player;
                c = ' ';
            } else if (c === ' ') {
                c = ' ';
            } else if (c === '#') {
                c = null;
            }
            _map.ground[key] = c;
            _map.shadow[key] = '#555';
        }3
    }
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