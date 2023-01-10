import {buildings, brains, clicksPerSecond, updateGame} from "./game.js";

//exports
export {getBuildings, fetchBuildings};

async function fetchBuildings() {
    let response = await fetch('buildings.json')
    let json = await response.json();
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
}

function getBuildings(){
    let text = ''
    for (let i = 0; i< buildings.length; i++){
        text += (buildings[i]['name'] +' '+ buildings[i]['count'] + '\n')
        }
    document.getElementById('buildings').innerText = text
}