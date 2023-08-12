let cheerio = require("cheerio");
let { isValidInteraction } = require("../../all-config");
let { slash_cq } = require("../../slash-commands/config");
let { filterChampQuote, championsHandleCase } = require("../config");

async function getChampQuote(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_cq) {
    return;
  }

  await i.deferReply();

  // the champion name has to be input (spelled) correctly
  let champQuery = i.options.data[0].value.toLowerCase();

  if (!championsHandleCase.has(champQuery)) {
    let msg =
      "**" + "That champion doesn't exist, or is spelled otherwise!" + "**";
    return await i.editReply(msg);
  }

  let correctChampName = championsHandleCase.get(champQuery);

  let url = `https://leagueoflegends.fandom.com/wiki/${correctChampName}/LoL/Audio`;

  try {
    let r = await fetch(url);
    let html = await r.text();
    let $ = cheerio.load(html);
    let quotesArray = [];
    $("i").each(function () {
      quotesArray.push($(this).text());
    });

    quotesArray = filterChampQuote(quotesArray, correctChampName);
    let randomIdx = () => Math.floor(Math.random() * quotesArray.length);

    let msg = "``" + quotesArray[randomIdx()] + "``";
    await i.editReply(msg);
  } catch (e) {
    await i.editReply("An error occured..");
    console.log(e);
  }
}

module.exports = getChampQuote;
