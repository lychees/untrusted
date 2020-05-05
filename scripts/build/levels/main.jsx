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
#BEGIN_EDITABLE#
let __map = null;
let __player = null;
#END_EDITABLE#

function startLevel(map) {
#START_OF_START_LEVEL#
    __map = map;
    __map._game.myGame.init();
    map.placePlayer(0,0);
    let __player = map.getPlayer();
    __player.getItem('phone');
    __player.getItem('computer');
    __player.getItem('blueKey');       
#END_OF_START_LEVEL#
}
