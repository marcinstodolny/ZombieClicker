let brains = 0;
let zombies = 0;
let clickPower = 1;
let clickPowerMultiplier = 1;
let clicksPerSecond = 0;
let clicksPerSecondMultiplier = 1;
let buildings = [];
let items = [];
let bought_upgrades = [];
let totalPopulation = 8010096000;

//import
import {getBuildings, fetchBuildings, buyBuilding} from './buildings.js';
import {getItems, fetchItems, buyItem, matchRequirements} from './items.js';

//exports
export {buildings, brains, items, clickPower, bought_upgrades, clicksPerSecond, updateGame, adjustBrains, adjustClicksPerSecond, adjustClickPower};

initGame();

async function initGame() {
    await initBuildings();
    if ((Number((document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)'))[2])) !== 0)){
        readCookies()
    }
    await updateItems();
    updateGame();
    setInterval(idle_loop, 1000);
    initResetButton();
    initMainButton();
}

function adjustBrains(delta) {
    brains += delta;
}

function adjustClicksPerSecond(delta) {
    clicksPerSecond += delta;
}
function adjustClickPower(delta) {
    clickPower += delta;
}

async function initBuildings() {
    let jsonBuildings = await fetchBuildings();
    let shopList = document.getElementById('shopList');
    jsonBuildings['buildings'].forEach(
        building => {
            building['count'] = 0;
            buildings.push(building);
            shopList.innerHTML = shopList.innerHTML + '<li><button id="' + building['name'] + '" value="10">' + building['name'] + ' ' + building['cost'] + ' brains</button></li>';
        }
    )
    buildings.forEach(building => {
        document.getElementById(building['name']).addEventListener("click", buyBuilding, false);
        document.getElementById(building['name']).name = building['name'];
        document.getElementById(building['name']).cost = building['cost'];
        document.getElementById(building['name']).cps = building['cps'];
        document.getElementById(building['name']).innerText = building['name'] + ' ' + building['cost'] + ' brains';
    });
}
async function updateItems() {
    let jsonItems = await fetchItems();
    let itemShopList = document.getElementById('itemShopList');
    if (items.length === 0){
        jsonItems['items'].forEach(
        item => {
            if (!items.some(element => element === item.name)) {
                items.push(item);

            }})}
    itemShopList.innerHTML = ''
    jsonItems['items'].forEach(
        item => {
            if (!bought_upgrades.some(element => element === item.name) && matchRequirements(item.name)){
            itemShopList.innerHTML = itemShopList.innerHTML + '<li><button id="' + item['name'] + '" value="10">' + item['name'] + ' ' + item['cost'] + ' brains</button></li>';
        }})
    items.forEach(item => {
        if (document.getElementById(item['name']) != null) {
        document.getElementById(item['name']).addEventListener("click", buyItem, false);
        document.getElementById(item['name']).name = item['name'];
        document.getElementById(item['name']).cost = item['cost'];
        document.getElementById(item['name']).clickP = item['clickP'];
        document.getElementById(item['name']).requirement = item['requirement'];
        document.getElementById(item['name']).innerText = item['name'] + ' ' + item['cost'] + ' brains';
    }})

}


function initResetButton() {
    document.getElementById('resetButton').addEventListener("click", resetGame);
}

function initMainButton() {
    document.getElementById('mainButton').addEventListener("click", buttonClick)
}

function readCookies(){
    zombies = Number(document.cookie.match(new RegExp('(^| )' + 'zombies' + '=([^;]+)'))[2]);
    brains = Number(document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)'))[2]);
    buildings = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'buildings' + '=([^;]+)'))[2]);
    clickPower = Number(document.cookie.match(new RegExp('(^| )' + 'clickPower' + '=([^;]+)'))[2]);
    clicksPerSecond = Number(document.cookie.match(new RegExp('(^| )' + 'clicksPerSecond' + '=([^;]+)'))[2]);
    bought_upgrades = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'bought_upgrades' + '=([^;]+)'))[2]);
    buildings.forEach(building => {
        document.getElementById(building['name']).addEventListener("click", buyBuilding, false);
        document.getElementById(building['name']).name = building['name'];
        document.getElementById(building['name']).cost = building['cost'];
        document.getElementById(building['name']).cps = building['cps'];
        document.getElementById(building['name']).innerText = building['name'] + ' ' + building['cost'] + ' brains';
        }
    );

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
    document.cookie = 'bought_upgrades=' + JSON.stringify(bought_upgrades) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    updateStatistics();
    if (zombies === totalPopulation) {
        alert('You win!')
    }
    getBuildings();
    updateItems()
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

function resetGame() {
    brains = 0;
    zombies = 0;
    clickPower = 1;
    clicksPerSecond = 0;
    buildings = [];
    totalPopulation = 8010096000;
    location.reload()
    updateGame()
}

