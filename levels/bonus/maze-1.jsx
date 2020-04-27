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
 * Press Q to destroy one wall.
 */
#BEGIN_EDITABLE#

let map;

function encode(x,y) {
    return x*100 + y;
}
let P = [], Q = [];


function add() {

    function find(x) {
        return P[x] = x == P[x] ? x : find(P[x]);
    }
    function union(x,y) {
        x = find(x); y = find(y);
        P[x] = y;
    }

    let tt = 50; while (tt--) {
        if (Q.length == 0) break;
        game.sound.playSound('blip');
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
}

function add_edge(x, y) {
    if (!P[y]) return;
    if (!Q.includes(x*10000+y)) {
        Q.push(x*10000+y);
    }
}

function init(mapp) {
    map = mapp;
    let n = map.getWidth()-1;
    let m = map.getHeight()-1;
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

    map.placePlayer(0, 0);
    map.placeObject(n-1, m-2, 'exit');    
}
#END_EDITABLE#


function startLevel(map) {
#START_OF_START_LEVEL#
    init(map);
    var p = map.getPlayer();
    p.getItem('phone');
    p.getItem('computer');
    p.getItem('blueKey');
    p.setPhoneCallback(add);
#END_OF_START_LEVEL#
}

function validateLevel(map) {
}
