let brains = 0;
let zombies = 0;
let clickPower = 1;
let clicksPerSecond = 0;
initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    updateStats();
    setInterval(idle_loop, 1000);

}

function idle_loop() {
        brains += clicksPerSecond;
        zombies += clicksPerSecond;
        updateStats();
}

function updateStats() {
    document.getElementById('brains').innerText = brains + ' brains';
    document.getElementById('zombies').innerText = zombies + ' zombies';
}

function buttonClick() {
    brains += clickPower;
    zombies += clickPower;
    updateStats();
}