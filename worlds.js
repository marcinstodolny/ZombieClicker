// exports
export {fetchWorlds};

async function fetchWorlds() {
    let response = await fetch('worlds.json')
    let json = await response.json();
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
}