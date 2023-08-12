let { EmbedBuilder } = require("discord.js");
let { isValidInteraction } = require("../../all-config");
let { slash_opgg } = require("../../slash-commands/config");
let { modifyID, riotHeaders } = require("../config");

async function leagueOpGG(i) {
  // only opgg interaction
  if (!isValidInteraction(i) || i.commandName !== slash_opgg) {
    return;
  }

  await i.deferReply();
  let summonerName = i.options.data[0].value.toLowerCase();
  let server = i.options.data[1].value.toLowerCase();
  let headers = riotHeaders();

  try {
    let r = await fetch(
      `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURI(
        summonerName
      )}`,
      { headers }
    );
    let accInfo = await r.json();
    let id = accInfo.id;

    // if not id, then don't look further
    if (!id) {
      return i.editReply(
        `**${i.user.username} I couldn't find a summoner with such name!**`
      );
    }

    let r2 = await fetch(
      `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}`,
      { headers }
    );
    let masteries = await r2.json();
    let r3 = await fetch(
      `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
      { headers }
    );
    let ranks = await r3.json();

    // get only the solo/duo rank
    ranks = ranks.filter((x) => x.queueType === "RANKED_SOLO_5x5");
    let [v] = ranks;
    ranks = v;

    let embed = new EmbedBuilder();
    embed
      .setColor("Random")
      .setTitle(`${accInfo.name}, ${accInfo.summonerLevel} level (${server})`)
      .setThumbnail(
        `http://ddragon.leagueoflegends.com/cdn/13.15.1/img/profileicon/${accInfo.profileIconId}.png`
      )
      .addFields({
        name: "Ranked Statistics",
        value: ranks
          ? `${ranks.tier} ${ranks.rank} ${ranks.leaguePoints} LP, 
        ${((ranks.wins / (ranks.wins + ranks.losses)) * 100).toFixed(
          1
        )}% w/r (${ranks.wins} wins / ${ranks.losses} losses), Solo/Duo`
          : `Solo/Duo, Unranked 0 LP`,
        inline: false,
      })
      .setTimestamp();

    if (masteries.length >= 3) {
      for (let i = 0; i < 3; i++) {
        masteries[i].championId = modifyID(masteries[i].championId);
        masteries[i].championPoints =
          masteries[i].championPoints.toLocaleString("it-IT");
      }

      let [x1, x2, x3] = masteries;

      embed.addFields(
        {
          name: "Extraordinary on (top 1 champ)",
          value: `${x1.championId} (${x1.championPoints} pts)`,
          inline: true,
        },
        {
          name: "Best on (top 2 champ)",
          value: `${x2.championId} (${x2.championPoints} pts)`,
          inline: true,
        },
        {
          name: "Good on (top 3 champ)",
          value: `${x3.championId} (${x3.championPoints} pts)`,
          inline: true,
        }
      );
    } else {
      embed.addFields({
        name: "Champions mastered are less than 3..!",
        value: "Try another summoner!",
      });
    }

    await i.editReply({ embeds: [embed] });
  } catch (e) {
    await i.editReply("An error has occured..");
    console.log(e);
  }
}

module.exports = leagueOpGG;
