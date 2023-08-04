let { MongoClient, ServerApiVersion } = require("mongodb");
let { isValidInteraction } = require("../../all-config");
let { slash_balance } = require("../../slash-commands/config");
let { dbName, collName, initial_amount_ofmoney, jackpotChance, jackpotMultiplier } = require("../config");
let { EmbedBuilder } = require("discord.js");

let uri = process.env.MONGODB_CRED;

let clientDb = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function showBalance(interaction) {

  if (!isValidInteraction(interaction) || interaction.commandName !== slash_balance) {
    return;
  }

  await interaction.deferReply();

  try {

    let currColl = clientDb.db(dbName).collection(collName);

    let user = await currColl.findOne({ name: interaction.user.username });

    if (!user) {
      return await interaction.editReply("`You don't have an account yet, start betting and you will!`");
    }

    let embed = new EmbedBuilder();
    embed.setColor("Random")
         .setTitle(`${interaction.guild.name}'s Casino`)
         .setThumbnail(interaction.member.displayAvatarURL())
         .addFields(
          { name: `Current balance`, value: `${user.money}$ 💰`, inline: true },
          { name: `Time to bet on a jackpot chance of ${jackpotChance * 100}%`, value: `with a multiplier of ${jackpotMultiplier}x` }
         )
         .setFooter({ text: `${interaction.guild.name}, inc.`})
         .setTimestamp();
    
    await interaction.editReply({ embeds: [embed]});

  } catch (e) {
    await interaction.editReply("`There was an error showing your balance..!`");
    console.log(e);
  }
}

module.exports = showBalance;