// champsId, champName
let championsMap = new Map([]);

// retrieve champ
let championsHandleCase = new Map([]);

async function updateChamps() {
  let version = (await (await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)).json()).shift();
  let leagueChampsApi = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
  await fetch(leagueChampsApi).then(data => data.json()).then(obj => {
      for (let champ in obj.data) {
        let champName = obj.data[champ].name;

        championsMap.set(parseInt(obj.data[champ].key), champName);
        championsHandleCase.set(champName.toLowerCase(), champName);
      }
  })
} updateChamps();

// setTimeout(() => { console.log(championsHandleCase)}, 1000);

let modifyID = (id) => {
  if (championsMap.has(id)) return championsMap.get(id);
  return "Champion is not found! Will be fixed soon!";
};

let VALID_SERVERS = ["EUN1", "EUW1", "JP1", "KR", "LA1", "LA2", "NA1", "OC1", "PH2", "RU", "SG2", "TH2", "TR1", "TW2", "VN2", "BR1"]

function riotHeaders() {
  return {"X-Riot-Token": process.env.RIOT_API_KEY}
}

function filterChampQuote(array, champName) {
  // first item is the sound effect
  // quotes that contain the champ name (possibly aren't quotes but acts) ["Lillia grunts, Lillia laughs.."]
  array.shift();
  array = array.filter(item => {
    return !item.includes(champName);
  })
  array = array.map(item => item.replaceAll('"', ''));
  return array;
}

module.exports = { modifyID, VALID_SERVERS, riotHeaders, filterChampQuote, championsHandleCase };
