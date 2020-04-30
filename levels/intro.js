function playIntro(display, map, i) {
	if (i < 0) {
        display._intro = true;
    } else {
        if (typeof i === 'undefined') { i = map.getHeight(); }
        display.clear();
        display.drawText(0, i - 2, "%c{#0f0}> initialize");
        display.drawText(15, i + 3, "海　の　う　た");
        display.drawText(20, i + 5, " —————— ");
        display.drawText(5, i + 7, "プ リ ン セ ス イ ザ ベ ラ の 伝 説");
        display.drawText(3, i + 12, "");
        display.drawText(10, i + 22, "Press any key to start ...");
        setTimeout(function () {
            display.playIntro(map, i - 1);
        }, 100);
    }
}
