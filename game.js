let score = 1;
initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    updateScore();

}

function updateScore() {
    document.getElementById('score').innerText = score + ' zombies';
}

function buttonClick() {
    score++;
    updateScore();
}