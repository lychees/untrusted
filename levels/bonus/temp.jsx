#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "commandsIntroduced":
        ["map.getObjectTypeAt", "player.getX", "player.getY", "player.getItem",
         "map.refresh"],
    "mapProperties": {
        "allowOverwrite": true
    },
    "music": "Night Owl"
}
#END_PROPERTIES#
/*******************
 * Maze-01.js *
 *******************
 * Press Q to generate a new maze
 */
#BEGIN_EDITABLE#
let __map;
let __player;
let P = [], Q = [];

function gen() {

    function encode(x,y) {
        return x*100 + y;
    }
    
    function add() {
        let map = __map;
        function find(x) {
            return P[x] = x == P[x] ? x : find(P[x]);
        }
        function union(x,y) {
            x = find(x); y = find(y);
            P[x] = y;
        }
    
        if (Q.length == 0) return;     
        let p = Math.floor(Math.random() * Q.length);
        let t = Q[p]; Q[p] = Q[Q.length-1]; Q.pop();
        let t1 = Math.floor(t / 10000), t2 = t % 10000;

        if (find(t1) != find(t2)) {
            union(t1, t2);
            let x1 = Math.floor(t1 / 100), y1 = t1 % 100;
            let x2 = Math.floor(t2 / 100), y2 = t2 % 100;
            let x = (x1+x2)/2, y = (y1+y2)/2;
            map.placeObject(x,y,'empty');
        }
    }
    
    function add_edge(x, y) {
        if (!P[y]) return;
        if (!Q.includes(x*10000+y)) {
            Q.push(x*10000+y);
        }
    }
    
    let map = __map; 
    let n = map.getWidth()-1;
    let m = map.getHeight()-1;
    __player._moveToXY(n,m);

    for (let i=0;i<n;i++) {
        for (let j=0;j<m;j++) {
            map.placeObject(i, j, 'tree');
        }
    }    
    for (let x=0;x<n;x+=2) {
        for (let y=0;y<m;y+=2) {
            map.placeObject(x,y,'empty');
            let t = encode(x,y); P[t] = t;
            P[t] = t;
        }
    }
    for (let x=0;x<n;x+=2) {
        for (let y=0;y<m;y+=2) {
            let t = encode(x,y);
            if (x+2 < n) add_edge(t, encode(x+2, y));
            if (y+2 < m) add_edge(t, encode(x, y+2));
        }
    }

    __player._moveToXY(0,0);
    while (Q.length != 0) {
        add();
    }
    game.sound.playSE('音人/[音人]時計の鐘.ogg');
    map.placeObject(n-1,m-2,'exit');
}

function startLevel(map) {
#START_OF_START_LEVEL#
    __map = map; map.placePlayer(0,0); 
    __player = map.getPlayer();
    __player.getItem('phone');
    __player.getItem('computer');
    __player.getItem('blueKey');
    gen();
    __player.setPhoneCallback(gen);
#END_OF_START_LEVEL#
}
#END_EDITABLE#
function validateLevel(map) {
}
