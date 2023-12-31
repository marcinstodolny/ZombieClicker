import {
    buildings,
    brains,
    brainsPerSecond,
    updateGame,
    adjustBrains,
    adjustClicksPerSecond,
    updateBrainsPerSecond,
    updateItems,
    updateBuildings,
    bought_items, items
} from "./game.js";


export {fetchBuildings, buyBuilding, buildingMatchRequirements};

let priceMultiplier = 1.2
async function fetchBuildings() {
    let response = await fetch('./data/buildings.json')
    let json = await response.json();
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
}

function buyBuilding(evt) {
    let element = evt.currentTarget.name;
    let price = evt.currentTarget.cost;
    let cps = evt.currentTarget.cps;
    if (price <= brains){
        let new_price = Math.round(price * priceMultiplier)
        if (buildings.some(item => item.name === element)){
            let index = buildings.findIndex(({ name }) => name === element);
            buildings[index]['count'] += 1;
            buildings[index]['cost'] = new_price;
        } else {
            buildings[buildings.length] = {name:element, count:1, cost:new_price,multiplier:1, cps:cps};
        }
        let index = buildings.findIndex(({ name }) => name === element);
        adjustBrains(-price);
        adjustClicksPerSecond(cps);
        document.getElementById(element).cost = new_price;
        document.getElementById('cost'+buildings[index]['name']).innerText = buildings[index]['cost'] + " Brains";
        document.getElementById('count'+buildings[index]['name']).innerText = buildings[index]['count'];
        document.getElementById('count'+buildings[index]['name']).classList.add("buildings-amount");
        updateBrainsPerSecond()
        updateItems()
        updateBuildings()
    }

    updateGame();
}
function buildingMatchRequirements(buildingToCheck){
    let index = buildings.findIndex(({ name }) => name === buildingToCheck['buildingRequirement']);
    if (index === -1){
        return true
    }
    return buildingToCheck['buildingRequirement'] === buildings[index]['name']
        && buildings[index]['count'] >= 1;

}