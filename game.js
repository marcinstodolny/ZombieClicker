let brains = 0;
let zombies = 0;
let clickPower = 1;
let clickPowerMultiplied = 0;
let clickPowerMultiplier = 1;
let clicksPerSecond = 0;
let clicksPerSecondMultiplier = 1;
let buildings = [];
let items = [];
let bought_items = [];
let worlds = [];
let currentWorld = 0;

//import
import {updateBuildingCounts, fetchBuildings, buyBuilding} from './buildings.js';
import {getItems, fetchItems, buyItem, matchRequirements, updateItemsOwned} from './items.js';
import {fetchWorlds} from './worlds.js';

//exports
export {buildings, brains, items, clickPower, bought_items, clicksPerSecond, updateGame, adjustBrains, adjustClicksPerSecond, adjustClickPower, adjustClickPowerMultiplier,adjustClicksPerSecondMultiplier, update_cps};

initGame();

async function initGame() {
    await initBuildings();
    initResetWindow();
    initMainButton();
    if ((document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)')) !== null)){
        readCookies()
    }
    await updateItems();
    await initWorlds();
    initNewGameButton();
    updateGame();
    setInterval(idle_loop, 1000);
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
function adjustClickPowerMultiplier(delta) {
    clickPowerMultiplier += delta;
}
function adjustClicksPerSecondMultiplier(delta, building) {
    let index = buildings.findIndex(({ name }) => name === building);
    let building_count = Number(buildings[index]['count'])
    let building_cps = Number(buildings[index]['cps'])
    buildings[index]['multiplier'] += delta
    clicksPerSecond += Number(building_count * building_cps * delta);
}

async function initWorlds() {
    worlds = await fetchWorlds();
}

async function initBuildings() {
    let jsonBuildings = await fetchBuildings();
    let shopList = document.getElementById('shopList');
    jsonBuildings['buildings'].forEach(
        building => {
            building['count'] = 0;
            building['multiplier'] = 1;
            buildings.push(building);
            shopList.innerHTML = shopList.innerHTML +
                '<div class="tooltip-container">' +
                '<p id="'+ building['name'] +'-text" class="tooltip-text:before"></p>' +
                '<li><button id="' + building['name'] + '" value="10">' + building['name'] + ' ' + building['cost'] + ' brains</button></li></div>';
        }
    )
    buildings.forEach(building => {
        document.getElementById(building['name']).addEventListener("click", buyBuilding, false);
        info(building['name'], building['displayed-text'])
        setBuildingButtonValues(building['name'], building['cost'], building['cps']);
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
            if (!bought_items.some(element => element === item.name) && matchRequirements(item.name)){
            itemShopList.innerHTML = itemShopList.innerHTML +'<div class="tooltip-container">' +
                '<p id="'+ item['name'] +'-text" class="tooltip-text:before"></p>' +'<li><button id="' + item['name'] + '" value="10">' + item['name'] + ' ' + item['cost'] + ' brains</button></li></div>';
        }})
    items.forEach(item => {
        if (document.getElementById(item['name']) != null) {
            document.getElementById(item['name']).addEventListener("click", buyItem, false);
            info(item['name'], item['displayed-text'])
            setItemsButtonValues(item['name'], item['cost'], item['clickP'], item['buildingName'], item['ClickMultiplier'], item['buildingMultiplier'])
    }})

}
function setItemsButtonValues(name, cost, clickP, buildingName, clickMultiplier, buildingMultiplier) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.clickP = clickP;
    button.buildingName = buildingName
    button.clickMultiplier = clickMultiplier;
    button.buildingMultiplier = buildingMultiplier;
    button.innerText = name + ' ' + cost + ' brains';
}

function setBuildingButtonValues(name, cost, cps) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.cps = cps;
    button.innerText = name + ' ' + cost + ' brains';
}

function initResetWindow() {
    document.getElementById('resetButton').addEventListener("click", showResetWindow);
    document.getElementById('resetGameConfirm').addEventListener("click", resetGame);
    document.getElementById('resetGameCancel'). addEventListener("click", hideResetWindow)
}

function showResetWindow() {
    document.getElementById('resetMessageBox').removeAttribute('hidden');
}

function hideResetWindow() {
    document.getElementById('resetMessageBox').setAttribute('hidden', '');
}

function initMainButton() {
    document.getElementById('mainButton').addEventListener("click", buttonClick)
}

function initNewGameButton() {
    document.getElementById('winningParagraph').innerText = 'Well done you have killed everyone ' + worlds['worlds'][currentWorld]['locationText'];
    document.getElementById('newGameButton').removeEventListener('click', nextWorld);
    document.getElementById('newGameButton').removeEventListener('click',resetGame);
    if (worlds['worlds'].length !== currentWorld + 1) {
        document.getElementById('newGameButton').innerText = 'Move on to ' + worlds['worlds'][currentWorld+1]['name'];
        document.getElementById('newGameButton').addEventListener("click", nextWorld);
    } else {
        document.getElementById('newGameButton').innerText = 'New Game';
        document.getElementById('newGameButton').addEventListener("click", resetGame);
    }
}

function readCookies(){
    zombies = Number(document.cookie.match(new RegExp('(^| )' + 'zombies' + '=([^;]+)'))[2]);
    currentWorld = Number(document.cookie.match(new RegExp('(^| )' + 'currentWorld' + '=([^;]+)'))[2]);
    brains = Number(document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)'))[2]);
    buildings = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'buildings' + '=([^;]+)'))[2]);
    clickPower = Number(document.cookie.match(new RegExp('(^| )' + 'clickPower' + '=([^;]+)'))[2]);
    clickPowerMultiplier = Number(document.cookie.match(new RegExp('(^| )' + 'clickPowerMultiplier' + '=([^;]+)'))[2]);
    clicksPerSecond = Number(document.cookie.match(new RegExp('(^| )' + 'clicksPerSecond' + '=([^;]+)'))[2]);
    bought_items = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'bought_items' + '=([^;]+)'))[2]);
    buildings.forEach(building => setBuildingButtonValues(building['name'], building['cost'], building['cps']))
}

function saveCookies() {
    document.cookie = 'brains=' + brains + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'zombies=' + zombies + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'buildings=' + JSON.stringify(buildings) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clicksPerSecond=' + clicksPerSecond + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPower=' + clickPower + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPowerMultiplier=' + clickPowerMultiplier + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'bought_items=' + JSON.stringify(bought_items) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'currentWorld=' + currentWorld + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
}

function update_cps(){
    console.log(buildings)
    let cps = 0
    for (let i = 0; i < buildings.length; i++){
        cps += Number(buildings[i]['cps'] * buildings[i]['multiplier'] * buildings[i]['count'])
    }
    console.log(cps, buildings[0]['cps'], buildings[0]['multiplier'],  buildings[0]['count'])
    clicksPerSecond = cps
}

function idle_loop() {
    let initialZombies = zombies;
    zombies += Math.round(clicksPerSecond);
    zombies = Math.min(zombies, worlds['worlds'][currentWorld]['population']);
    let zombieDelta = zombies - initialZombies;
    brains += zombieDelta;
    updateGame();
}

function updateGame() {
    document.getElementById('brains').innerText = brains + ' brains';
    document.getElementById('living').innerText = worlds['worlds'][currentWorld]['population'] - zombies + ' living';
    document.getElementById('zombies').innerText = zombies + ' zombies';
    saveCookies();
    updateStatistics();
    updateBuildingCounts();
    updateItems();
    updateItemsOwned();
    checkWinCondition();
    updateProgressBar()
}

function updateProgressBar() {
    let bar = document.getElementById('progessBar');
    bar.style.width=zombies / worlds['worlds'][currentWorld]['population'] * 100 + '%';
}

function checkWinCondition() {
    if (zombies === worlds['worlds'][currentWorld]['population']) {
        document.getElementById('winMessageBox').removeAttribute('hidden')
    }
}
function updateClickPower(){
    clickPowerMultiplied = clickPower * clickPowerMultiplier;
}

function updateStatistics() {
    updateClickPower()
    document.getElementById('clickPower').innerText = String(clickPowerMultiplied);
    // document.getElementById('clickPowerMultiplier').innerText = String(clickPowerMultiplier);
    document.getElementById('clicksPerSecond').innerText = String(clicksPerSecond);
    // document.getElementById('clicksPerSecondMultiplier').innerText = String(clicksPerSecondMultiplier);
}

function buttonClick() {
    let initialZombies = zombies;
    zombies += Math.round(clickPower * clickPowerMultiplier);
    zombies = Math.min(zombies, worlds['worlds'][currentWorld]['population']);
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
    currentWorld = 0;
    bought_items = [];
    clickPowerMultiplier = 1;
    location.reload()
    updateGame()
}

function info(elementId, text){
const target = document.getElementById(elementId);
const tooltip = document.getElementById(elementId + "-text");
target.addEventListener('mouseover', () => {
    tooltip.innerText = text
      tooltip.style.display = 'block';
    tooltip.classList.toggle('tooltip-text:before')
      tooltip.classList.toggle('tooltip-text')
}, false);

target.addEventListener('mouseleave', () => {
    // tooltip.innerText = ''
      tooltip.style.display = 'none';
      tooltip.classList.toggle('tooltip-text:before')
      tooltip.classList.toggle('tooltip-text')
}, false);

}

function nextWorld() {
    currentWorld++;
    document.getElementById('winMessageBox').setAttribute('hidden', '');
    initNewGameButton();
    updateGame();
}
