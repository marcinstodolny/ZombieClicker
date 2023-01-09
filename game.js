let brains = 0;
let zombies = 0;
let clickPower = 1;
let clicksPerSecond = 0;
let buildings = [{}]
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
    brains += clickPower;
    zombies += clickPower;
    updateStats();
}
function buyElement(element, price, cps){
    if (price <= brains){
        if (buildings.some(item => item.name === element)){
            let index = buildings.findIndex(({ name }) => name === element)
            buildings[index]['count'] += 1
            brains -= price
            clicksPerSecond += cps
        } else {
            buildings[buildings.length] = {name:element, count:1}
            brains -= price
            clicksPerSecond += cps
        }
    }
    updateStats()
}