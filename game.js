let brains = 0;
let zombies = 0;
let clickPower = 1;
let clickPowerMultiplier = 1;
let clicksPerSecond = 0;
let clicksPerSecondMultiplier = 1;
let buildings = [];
let totalPopulation = 8010096000;

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    updateGame();
    setInterval(idle_loop, 1000);

}

function idle_loop() {
    let initialZombies = zombies;
    zombies += Math.round(clicksPerSecond *clicksPerSecondMultiplier);
    zombies = Math.min(zombies, totalPopulation);
    let zombieDelta = zombies - initialZombies;
    brains += zombieDelta;
    updateGame();
}

function updateGame() {
    document.getElementById('brains').innerText = brains + ' brains';
    document.getElementById('living').innerText = totalPopulation - zombies + ' living';
    document.getElementById('zombies').innerText = zombies + ' zombies';
    updateStatistics();
    if (zombies === totalPopulation) {
        alert('You win!')
    }
}
function updateStatistics() {
    document.getElementById('clickPower').innerText = String(clickPower);
    document.getElementById('clickPowerMultiplier').innerText = String(clickPowerMultiplier);
    document.getElementById('clicksPerSecond').innerText = String(clicksPerSecond);
    document.getElementById('clicksPerSecondMultiplier').innerText = String(clicksPerSecondMultiplier);
}

function buttonClick() {
    let initialZombies = zombies;
    zombies += Math.round(clickPower * clickPowerMultiplier);
    zombies = Math.min(zombies, totalPopulation);
    let zombieDelta = zombies - initialZombies;
    brains += zombieDelta;
    updateGame();
}
function buyElement(element, price, cps){
    if (price <= brains){
        if (buildings.some(item => item.name === element)){
            let index = buildings.findIndex(({ name }) => name === element);
            buildings[index]['count'] += 1;
            brains -= price;
            clicksPerSecond += cps;
        } else {
            buildings[buildings.length] = {name:element, count:1};
            brains -= price;
            clicksPerSecond += cps;
        }
    }
    updateGame();
}