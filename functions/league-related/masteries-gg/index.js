let { EmbedBuilder } = require("discord.js");
let { isValidInteraction } = require("../../all-config");
let { slash_mast_gg } = require("../../slash-commands/config");
let { modifyID, riotHeaders } = require("../config");

async function masteriesGG(interaction) {
  if (
    !isValidInteraction(interaction) ||
    interaction.commandName !== slash_mast_gg
  ) {
    return;
  }

  await interaction.deferReply();
  let summonerName = interaction.options.data[0].value.toLocaleLowerCase();
  let server = interaction.options.data[1].value.toLocaleLowerCase();
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
      return interaction.editReply(
        `**${interaction.user.username} I couldn't find a summoner with such name!**`
      );
    }

    let r2 = await fetch(
      `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}`,
      { headers }
    );
    let masteries = await r2.json();

    let embedInfo = masteries.slice(0, 25).map((obj, idx) => {
      return {
        name: `Top ${idx + 1}`,
        value: `${modifyID(
          obj.championId
        )} (${obj.championPoints.toLocaleString("it-IT")} pts)`,
        inline: true,
      };
    });

    if (!embedInfo.length) {
      embedInfo = [{ name: "No champs mastered..!", value: "-", inline: true }];
    }

    // "discord.js"
    let embed = new EmbedBuilder();
    embed
      .setColor("Random")
      .setTitle(`${accInfo.name}, ${accInfo.summonerLevel} level, ${server}`)
      .setThumbnail(
        `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${accInfo.profileIconId}.jpg`
      )
      .addFields(embedInfo)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    await interaction.editReply("An error has occured..");
    console.log(e);
  }
}

module.exports = masteriesGG;
