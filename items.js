import {buildings, brains, bought_upgrades, items, clickPower, updateGame, adjustBrains, adjustClickPower} from "./game.js";

//exports
export {getItems, fetchItems, buyItem, matchRequirements};

async function fetchItems() {
    let response = await fetch('items.json')
    let json = await response.json();
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
}

function getItems(){
    let text = ''
    for (let i = 0; i< buildings.length; i++){
        text += (buildings[i]['name'] +' '+ buildings[i]['count'] + '\n')
        }
    document.getElementById('buildingsList').innerText = text
}

function buyItem(evt){
    let element = evt.currentTarget.name;
    let price = evt.currentTarget.cost;
    let cp = evt.currentTarget.clickP;
     if (price <= brains && !bought_upgrades.some(item => item === element)){
         bought_upgrades.push(element)
         adjustBrains(-price);
         adjustClickPower(cp);
         updateGame()
     }
}

function matchRequirements(itemToCheck){
    bought_upgrades.some(item => item.name === items[0]['name'])
        for(let i = 0; i < items.length; i++){
            let index = buildings.findIndex(({ name }) => name === items[i]['buildingName']);
            if (items[i]['requirement'] <= buildings[index]['count']
                && buildings[index]['name'] === items[i]['buildingName']
                && !bought_upgrades.some(item => item.name === items[i]['name'])
                && items[i]['name'] === itemToCheck
            ){
                return true
        }
    }
        return false
}