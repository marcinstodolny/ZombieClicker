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

//import
// import {updateBuildingCounts} from './buildings.js';
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
            shopList.innerHTML = shopList.innerHTML +
                '<div id="building'+building['id']+'"><div id="buy'+building['id']+'">' +
                '<p>BUY</p></div><div id="name-and-price-container'+building['id']+'">' +
                '<p id="name'+building['id']+'">'+ building['name'] +'</p>' +
                '<p id ="cost'+ building['id'] +'">'+ building['cost'] +' Brains</p></div>' +
                '<div id="count'+building['id']+'"><p>'+ building['count'] +'</p></div></div><br>';
        }
    )
    buildings.forEach(building => {
        document.getElementById("building"+building['id']).addEventListener("click", buyBuilding, false);
        document.getElementById("buy"+building['id']).addEventListener("click", buyBuilding, false);
        document.getElementById("building"+building['id']).classList.add("building-info");
        document.getElementById("cost"+building['id']).classList.add("price");
        document.getElementById("count"+building['id']).classList.add("buildings-amount");
        // document.getElementById("buy-icon").classList.add("buy-icon");
        document.getElementById("name"+building['id']).classList.add("building-name");
        document.getElementById("buy"+building['id']).classList.add("buy");
        document.getElementById("name-and-price-container" + building['id']).classList.add("building-name-and-price");




        setBuildingButtonValues("building"+building['id'], building['cost'], building['cps']);
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
    // itemShopList.innerHTML = ''
    jsonItems['items'].forEach(
        item => {
            if (!bought_items.some(element => element === item.name) && matchRequirements(item.name)){
            itemShopList.innerHTML = itemShopList.innerHTML + '<li><button id="' + item['name'] + '" value="10">' + item['name'] + ' ' + item['cost'] + ' brains</button></li>';
        }})
    items.forEach(item => {
        if (document.getElementById(item['name']) != null) {
            document.getElementById(item['name']).addEventListener("click", buyItem, false);
            setItemsButtonValues(item['name'], item['cost'], item['clickP'])
        }})
}
function setItemsButtonValues(name, cost, clickP) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.clickP = clickP;
    button.innerText = name + ' ' + cost + ' brains';
}

function setBuildingButtonValues(name, cost, cps) {
    let button = document.getElementById(name);
    button.name = name;
    button.cost = cost;
    button.cps = cps;
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
    bought_items = JSON.parse(document.cookie.match(new RegExp('(^| )' + 'bought_items' + '=([^;]+)'))[2]);
    // buildings.forEach(building => setBuildingButtonValues(building['name'], building['cost'], building['cps']))

}

function saveCookies() {
    document.cookie = 'brains=' + brains + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'zombies=' + zombies + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'buildings=' + JSON.stringify(buildings) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clicksPerSecond=' + clicksPerSecond + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'clickPower=' + clickPower + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
    document.cookie = 'bought_items=' + JSON.stringify(bought_items) + '; expires=Thu, 18 Dec 2033 12:00:00 UTC"';
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
    // updateBuildingCounts();
    updateItems();
    updateItemsOwned();
    checkWinCondition();
    updateProgressBar()
    // updateBuildings()
}

function updateProgressBar() {
    let bar = document.getElementById('progessBar');
    bar.style.width=zombies / totalPopulation * 100 + '%';
}

function checkWinCondition() {
    if (zombies === totalPopulation) {
        alert('You win!')
    }
}

function updateStatistics() {
    document.getElementById('clickPower').innerText = String(clickPower);
    // document.getElementById('clickPowerMultiplier').innerText = String(clickPowerMultiplier);
    document.getElementById('clicksPerSecond').innerText = String(clicksPerSecond);
    // document.getElementById('clicksPerSecondMultiplier').innerText = String(clicksPerSecondMultiplier);
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

