let brains = 0;
let zombies = 0;
initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    updateStats();

}

function updateStats() {
    document.getElementById('brains').innerText = brains + ' brains';
    document.getElementById('zombies').innerText = zombies + ' zombies';
}

function buttonClick() {
    brains++;
    zombies++;
    updateStats();
}