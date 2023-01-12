let brains = 0;
let zombies = 0;
let clickPower = 1;
let clickPowerMultiplier = 1;
let clicksPerSecond = 0;
let clicksPerSecondMultiplier = 1;
let buildings = [];
let items = [];
let bought_items = [];
let totalPopulation = 8010096000;

import {fetchBuildings, buyBuilding} from './buildings.js';
import {getItems, fetchItems, buyItem, matchRequirements, updateItemsOwned} from './items.js';

//exports
export {buildings, brains, items, clickPower, bought_items, clicksPerSecond, updateGame, adjustBrains, adjustClicksPerSecond, adjustClickPower};

initGame();

async function initGame() {
    await initBuildings();
    if ((document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)')) !== null)){
        readCookies()
    }
    // await updateItems();
    updateGame();
    setInterval(idle_loop, 1000);
    initResetWindow();
    initMainButton();
    initNewGameButton();
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
            shopList.innerHTML = shopList.innerHTML +
                '<div id="'+building['name']+'"><div id="buy'+building['name']+'">' +
                '<p>BUY</p></div><div id="name-and-price-container'+building['name']+'">' +
                '<p id="name'+building['name']+'">'+ building['name'] +'</p>' +
                '<p id ="cost'+ building['name'] +'">'+ building['cost'] +' Brains</p></div>' +
                '<div id="count'+building['name']+'"><p>'+ building['count'] +'</p></div></div><br>';
        }
    )
    buildings.forEach(building => {
        document.getElementById(building['name']).addEventListener("click", buyBuilding, false);
        document.getElementById(building['name']).classList.add("building-info");
        document.getElementById("cost"+building['name']).classList.add("price");
        document.getElementById("count"+building['name']).classList.add("buildings-amount-init");
        // document.getElementById("buy-icon").classList.add("buy-icon");
        document.getElementById("name"+building['name']).classList.add("building-name");
        document.getElementById("buy"+building['name']).classList.add("buy");
        document.getElementById("name-and-price-container" + building['name']).classList.add("building-name-and-price");
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
            itemShopList.innerHTML = itemShopList.innerHTML +
                '<div id="'+item['name']+'">' +
                '<div id="buy-item'+item['name']+'">BUY</div>' +
                '<div id="item-name-and-price'+item['name']+'">' +
                '<div id="item-name'+item['name']+'">'+ item['name'] +'</div>' +
                '<div id="item-price'+item['name']+'">'+ item['cost'] +'</div></div></div>';
        }})
    items.forEach(item => {
        if (document.getElementById(item['name']) != null) {
            document.getElementById(item['name']).addEventListener("click", buyItem, false);
            document.getElementById(item['name']).classList.add("item-container");
            document.getElementById("buy-item"+item['name']).classList.add("buy-item");
            document.getElementById("item-name-and-price"+item['name']).classList.add("item-name-and-price");
            // document.getElementById("buy-icon").classList.add("buy-icon");
            document.getElementById("item-name"+item['name']).classList.add("item-name");
            document.getElementById("item-price"+item['name']).classList.add("item-price");
            setItemsButtonValues(item['name'], item['cost'], item['clickP'])
    }})
}
function setItemsButtonValues(name, cost, clickP) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.clickP = clickP;
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
    document.getElementById('mainButton').addEventListener("click", buttonClick)
}

function initNewGameButton() {
    document.getElementById('newGameButton').addEventListener("click", newGame)
}

function readCookies(){
    zombies = Number(document.cookie.match(new RegExp('(^| )' + 'zombies' + '=([^;]+)'))[2]);
    brains = Number(document.cookie.match(new RegExp('(^| )' + 'brains' + '=([^;]+)'))[2]);
    buildings = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'buildings' + '=([^;]+)'))[2]);
    clickPower = Number(document.cookie.match(new RegExp('(^| )' + 'clickPower' + '=([^;]+)'))[2]);
    clicksPerSecond = Number(document.cookie.match(new RegExp('(^| )' + 'clicksPerSecond' + '=([^;]+)'))[2]);
    bought_items = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'bought_items' + '=([^;]+)'))[2]);
    // totalPopulation = Number(document.cookie.match(new RegExp('(^| )' + 'totalPopulation' + '=([^;]+)'))[2]);
    buildings.forEach(building => setBuildingButtonValues(building['name'], building['cost'], building['cps']))
}

function saveCookies() {
    document.cookie = 'brains=' + brains + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'zombies=' + zombies + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'buildings=' + JSON.stringify(buildings) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clicksPerSecond=' + clicksPerSecond + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPower=' + clickPower + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'bought_items=' + JSON.stringify(bought_items) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'totalPopulation=' + totalPopulation + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
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
    document.getElementById('brains').innerText = brains + ' BRAINS';
    document.getElementById('living').innerText = 'Living population: ' + (totalPopulation - zombies).toString();
    document.getElementById('zombies').innerText = 'Zombies: ' + zombies;
    saveCookies();
    updateStatistics();
    updateItems();
    updateItemsOwned();
    checkWinCondition();
    updateProgressBar()
}

function updateProgressBar() {
    let bar = document.getElementById('progessBar');
    bar.style.width=zombies / totalPopulation * 100 + '%';
}

function checkWinCondition() {
    if (zombies === totalPopulation) {
        document.getElementById('winMessageBox').removeAttribute('hidden')
    }
}

function updateStatistics() {
    document.getElementById('clickPower').innerText = String(clickPower);
    document.getElementById('clicksPerSecond').innerText = String(clicksPerSecond);
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
    bought_items = [];
    location.reload()
    updateGame()
}

function newGame() {
    totalPopulation = 1823470191283974123483475;
    document.getElementById('winMessageBox').setAttribute('hidden', '');
    updateGame()
}