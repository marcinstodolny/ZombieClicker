import {buildings, brains, clicksPerSecond, updateGame, adjustBrains, adjustClicksPerSecond} from "./game.js";

//exports
// export {updateBuildingCounts};
export {fetchBuildings, buyBuilding};
async function fetchBuildings() {
    let response = await fetch('buildings.json')
    let json = await response.json();
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
}

// function updateBuildingCounts(){
//     let text = ''
//     for (let i = 0; i< buildings.length; i++){
//         text += (buildings[i]['name'] +' '+ buildings[i]['count'] + '\n')
//         }
//     document.getElementById('buildingsList').innerText = text
// }

function buyBuilding(evt) {
    let element = evt.currentTarget.name;
    let price = evt.currentTarget.cost;
    let cps = evt.currentTarget.cps;
    if (price <= brains){
        let new_price = Math.round(price * 1.5)
        console.log(buildings)
        if (buildings.some(item => item.name === element)){
            let index = buildings.findIndex(({ name }) => name === element);
            buildings[index]['count'] += 1;
            buildings[index]['cost'] = new_price;
            console.log(index, buildings[index]['name'])
            console.log(buildings[0]['id'])
            // document.getElementById("cost"+buildings[index]['id']).innerText = new_price.toString();
        } else {
            buildings[buildings.length] = {name:element, count:1, cost:new_price, cps:cps};
        }
        let index = buildings.findIndex(({ name }) => name === element);
        adjustBrains(-price);
        adjustClicksPerSecond(cps);
        document.getElementById(element).cost = new_price;
        document.getElementById('cost'+buildings[index]['name']).innerText = buildings[index]['cost'] + " Brains";
        document.getElementById('count'+buildings[index]['name']).innerText = buildings[index]['count'];
        document.getElementById('count'+buildings[index]['name']).classList.add("buildings-amount");
        // document.getElementById(element).innerText = element + ' ' + new_price + ' brains';
    }

    updateGame();
}