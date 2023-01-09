let brains = 0;
let zombies = 0;
let clickPower = 1;
let clicksPerSecond = 0;
let buildings = [];
let totalPopulation = 8010096000;

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    updateStats();
    setInterval(idle_loop, 1000);

}

function idle_loop() {
    let initialZombies = zombies;
    zombies += clicksPerSecond;
    zombies = Math.min(zombies, totalPopulation);
    let zombieDelta = zombies - initialZombies;
    brains += zombieDelta;
    updateStats();
}

function updateStats() {
    document.getElementById('brains').innerText = brains + ' brains';
    document.getElementById('living').innerText = totalPopulation - zombies + ' living';
    document.getElementById('zombies').innerText = zombies + ' zombies';
    if (zombies === totalPopulation) {
        alert('You win!')
    }
}

function buttonClick() {
    let initialZombies = zombies;
    zombies += clickPower;
    zombies = Math.min(zombies, totalPopulation);
    let zombieDelta = zombies - initialZombies;
    brains += zombieDelta;
    updateStats();
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
    updateStats();
}