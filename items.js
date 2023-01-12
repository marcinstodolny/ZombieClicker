import {buildings, brains, bought_items, items, updateGame, adjustBrains, adjustClickPower, adjustClickPowerMultiplier, adjustClicksPerSecondMultiplier, updateItems} from "./game.js";

//exports
export {fetchItems, buyItem, matchRequirements, updateItemsOwned};

async function fetchItems() {
    let response = await fetch('./data/items.json')
    let json = await response.json();
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
}

function buyItem(evt){
    let element = evt.currentTarget.name;
    let price = evt.currentTarget.cost;
    let cp = evt.currentTarget.clickP;
    let building = evt.currentTarget.buildingName;
    let clickMultiplier = evt.currentTarget.clickMultiplier;
    let buildingMultiplier = evt.currentTarget.buildingMultiplier;
     if (price <= brains && !bought_items.some(item => item === element)){
         bought_items.push(element)
         adjustBrains(-price);
         if (cp !== 0){
             adjustClickPower(cp);
         } else if ( clickMultiplier !== 0){
             adjustClickPowerMultiplier(clickMultiplier)
         } else if (buildingMultiplier !== 0){
            adjustClicksPerSecondMultiplier(buildingMultiplier, building)
         }
         updateGame()
         updateItems()
     }
}

function matchRequirements(itemToCheck){
    bought_items.some(item => item.name === items[0]['name'])
        for(let i = 0; i < items.length; i++){
            let index = buildings.findIndex(({ name }) => name === items[i]['buildingName']);
            if (index !== -1
                && items[i]['requirement'] <= buildings[index]['count']
                && buildings[index]['name'] === items[i]['buildingName']
                && !bought_items.some(item => item.name === items[i]['name'])
                && items[i]['name'] === itemToCheck
            ){
                return true
        }
    }
        return false
}

function updateItemsOwned(){
    let text = ''
    for (let i = 0; i< bought_items.length; i++){
        // text += (bought_items[i] +' ' + '\n')
        text += '<div><p class="tooltip-items">' + bought_items[i] + '<span class="tooltiptext-equipment">' + items[i]['displayed-text'] + '</span></p></div>'
        }
    document.getElementById('itemList').innerHTML = text
}
