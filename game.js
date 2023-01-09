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
    if ((Number(document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)'))) !== 0))
        readCookies()
    // Your game can start here, but define separate functions, don't write everything in here :)
    updateGame();
    setInterval(idle_loop, 1000);


}
function readCookies(){
    zombies = Number(document.cookie.match(new RegExp('(^| )' + 'zombies' + '=([^;]+)'))[2]);
    brains = Number(document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)'))[2]);
    buildings = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'buildings' + '=([^;]+)'))[2]);
    clickPower = Number(document.cookie.match(new RegExp('(^| )' + 'clickPower' + '=([^;]+)'))[2]);
    clicksPerSecond = Number(document.cookie.match(new RegExp('(^| )' + 'clicksPerSecond' + '=([^;]+)'))[2]);
    for (let i = 0; i< buildings.length; i++){
        document.getElementById(buildings[i]['name'].toLowerCase()).value = buildings[i]['current_price'];
        document.getElementById(buildings[i]['name'].toLowerCase()).innerText = buildings[i]['name'] + ' '+ buildings[i]['current_price'] + ' brains';
    }
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
    document.cookie = 'brains=' + brains + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'zombies=' + zombies + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'buildings=' + JSON.stringify(buildings) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clicksPerSecond=' + clicksPerSecond + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPower=' + clickPower + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    updateStatistics();
    if (zombies === totalPopulation) {
        alert('You win!')
    }
    getBuildings();
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
    let element_name = element.charAt(0).toUpperCase() + element.slice(1)
    if (price <= brains){
        let new_price = Math.round(price * 1.5)
        if (buildings.some(item => item.name === element_name)){
            let index = buildings.findIndex(({ name }) => name === element_name);
            buildings[index]['count'] += 1;
            buildings[index]['current_price'] = new_price;
        } else {
            buildings[buildings.length] = {name:element_name, count:1, current_price:new_price};
        }
        brains -= price;
        clicksPerSecond += cps;

        document.getElementById(element).innerText = element_name + ' '+ new_price + ' brains';
        document.getElementById(element).value = new_price;
    }
    updateGame();
}

function getBuildings(){
    let text = ''
    for (let i = 0; i< buildings.length; i++){
        text += (buildings[i]['name'] +' '+ buildings[i]['count'] + '\n')
        }
    document.getElementById('buildings').innerText = text
}

function resetGame() {
    brains = 0;
    zombies = 0;
    clickPower = 1;
    clicksPerSecond = 0;
    buildings = [];
    totalPopulation = 8010096000;
    updateGame()
}