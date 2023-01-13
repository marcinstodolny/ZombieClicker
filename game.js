let brains = 0;
let zombies = 0;
let clickPower = 1;
let clickPowerMultiplied = 0;
let clickPowerMultiplier = 1;
let brainsPerSecond = 0;
let buildings = [];
let items = [];
let bought_items = [];
let worlds = [];
let currentWorld = 0;


import {fetchBuildings, buyBuilding, buildingMatchRequirements} from './buildings.js';
import {fetchItems, buyItem, matchRequirements, updateItemsOwned} from './items.js';
import {fetchWorlds} from './worlds.js';

//exports
export {buildings, brains, items, clickPower, bought_items, brainsPerSecond, updateGame, adjustBrains, updateItems,updateBuildings, adjustClicksPerSecond, adjustClickPower, adjustClickPowerMultiplier,adjustClicksPerSecondMultiplier, updateBrainsPerSecond};

initGame();

async function initGame() {
    initResetWindow();
    initMainButton();
    if ((document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)')) !== null)){
        readCookies()
    }
    await updateItems();
    await initWorlds();
    await updateBuildings();
    initNewGameButton();
    updateGame();
    AnimateBrain();
    setInterval(idle_loop, 100);
}

function adjustBrains(delta) {
    brains += delta;
}

function adjustClicksPerSecond(delta) {
    brainsPerSecond += delta;
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
    brainsPerSecond += Number(building_count * building_cps * delta);
}

async function initWorlds() {
    worlds = await fetchWorlds();
}

async function updateBuildings() {
    let jsonBuildings = await fetchBuildings();
    let shopList = document.getElementById('shopList');
    if (buildings.length === 0){
        jsonBuildings['buildings'].forEach(
        building => {
            if (!items.some(element => element === building.name)) {
                building['count'] = 0;
                building['multiplier'] = 1;
                buildings.push(building);
            }})}
    shopList.innerHTML = ''
    buildings.forEach(
        building => {
            if (buildingMatchRequirements(building)){
            shopList.innerHTML = shopList.innerHTML +
                '<div id="'+building['name']+'" class="building-info">' +
                '<span class="tooltiptext">'+building["displayed-text"] + '\n(+' + building['cps']*building['multiplier'] + ' BPS per purchase)</span>' +
                '<div class="buy"><p>BUY</p></div>' +
                '<div class="building-name-and-price">' +
                '<p class="building-name">'+ building['name'] +'</p>' +
                '<p id="cost'+building['name']+'" class="price">'+ building['cost'] +' Brains</p></div>' +
                '<div id="count'+building['name']+'" class="buildings-amount-init"><p>'+ building['count'] +'</p></div></div></div>';
        }}
    )
    buildings.forEach(building => {
        if (buildingMatchRequirements(building)){
        document.getElementById(building['name']).addEventListener("click", buyBuilding, false);
        setBuildingButtonValues(building['name'], building['cost'], building['cps']);
    }});
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
            itemShopList.innerHTML = itemShopList.innerHTML  +
                '<div id="'+item['name']+'" class="item-container">' +
                '<span class="tooltiptext">'+item["displayed-text"]+'</span>' +
                '<div class="buy-item">BUY</div>' +
                '<div class="item-name-and-price">' +
                '<div class="item-name">'+ item['name'] +'</div>' +
                '<div class="item-price">'+ item['cost'] +' Brains</div></div></div>';
        }})
    items.forEach(item => {
        if (document.getElementById(item['name']) != null) {
            document.getElementById(item['name']).addEventListener("click", buyItem, false);
            setItemsButtonValues(item['name'], item['cost'], item['clickP'], item['buildingName'], item['ClickMultiplier'], item['buildingMultiplier']);
    }})
    updateItemsOwned();
    updateBuildings();
}
function setItemsButtonValues(name, cost, clickP, buildingName, clickMultiplier, buildingMultiplier) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.clickP = clickP;
    button.buildingName = buildingName
    button.clickMultiplier = clickMultiplier;
    button.buildingMultiplier = buildingMultiplier;
}

function setBuildingButtonValues(name, cost, cps) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.cps = cps;
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
    document.getElementById('brainImage').addEventListener("click", buttonClick)
}

function initNewGameButton() {
    document.getElementById('winningParagraph').innerText = 'Well done, you have killed everyone ' + worlds['worlds'][currentWorld]['locationText'];
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
    brainsPerSecond = Number(document.cookie.match(new RegExp('(^| )' + 'clicksPerSecond' + '=([^;]+)'))[2]);
    bought_items = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'bought_items' + '=([^;]+)'))[2]);
    // buildings.forEach(building => setBuildingButtonValues(building['name'], building['cost'], building['cps']))
}

function saveCookies() {
    document.cookie = 'brains=' + brains + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'zombies=' + zombies + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'buildings=' + JSON.stringify(buildings) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clicksPerSecond=' + brainsPerSecond + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPower=' + clickPower + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPowerMultiplier=' + clickPowerMultiplier + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'bought_items=' + JSON.stringify(bought_items) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'currentWorld=' + currentWorld + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
}

function updateBrainsPerSecond(){
    console.log(buildings)
    let brains_per_second = 0
    for (let i = 0; i < buildings.length; i++){
        brains_per_second += Number(buildings[i]['cps'] * buildings[i]['multiplier'] * buildings[i]['count'])
    }
    console.log(brains_per_second, buildings[0]['cps'], buildings[0]['multiplier'],  buildings[0]['count'])
    brainsPerSecond = brains_per_second
}

function idle_loop() {
    let initialZombies = zombies;
    zombies += brainsPerSecond / 10;
    zombies = Math.min(zombies, worlds['worlds'][currentWorld]['population']);
    let zombieDelta = zombies - initialZombies;
    brains += zombieDelta;
    updateGame();
}

function updateGame() {
    document.getElementById('brains').innerText = Math.round(brains) + ' BRAINS';
    document.getElementById('zombies').innerText = 'Zombies: ' + Math.round(zombies);
    document.getElementById('living').innerText = 'Living population: ' + (Math.round(worlds['worlds'][currentWorld]['population'] - zombies)).toString();
    saveCookies();
    updateStatistics();
    checkWinCondition();
    updateProgressBar();
}

function updateProgressBar() {
    let bar = document.getElementById('progressBar');
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
    document.getElementById('clicksPerSecond').innerText = String(brainsPerSecond);
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
    brainsPerSecond = 0;
    buildings = [];
    currentWorld = 0;
    bought_items = [];
    clickPowerMultiplier = 1;
    location.reload()
    updateGame()
}

function nextWorld() {
    currentWorld++;
    document.getElementById('winMessageBox').setAttribute('hidden', '');
    initNewGameButton();
    updateGame();
}

function AnimateBrain(){
const target = document.getElementById('brainImage');
target.addEventListener('mouseover', () => {
    target.classList.toggle('brainResize')
}, false);

target.addEventListener('mouseleave', () => {
   target.classList.toggle('brainResize')
}, false);

target.addEventListener('click', () => {
   target.classList.toggle('brainAnimation')
    setTimeout(() => {target.classList.toggle('brainAnimation')}, 50)
}, false);

}