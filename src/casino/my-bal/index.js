let { MongoClient, ServerApiVersion } = require("mongodb");
let { isValidInteraction } = require("../../all-config");
let { slash_balance } = require("../../slash-commands/config");
let {
  dbName,
  collName,
  jackpotChance,
  jackpotMultiplier,
} = require("../config");
let { EmbedBuilder } = require("discord.js");

let uri = process.env.MONGODB_CRED;

let clientDb = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function showBalance(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_balance) {
    return;
  }

  await i.deferReply();

  try {
    let currColl = clientDb.db(dbName).collection(collName);

    let user = await currColl.findOne({ name: i.user.username });

    if (!user) {
      return await i.editReply(
        "`You don't have an account yet, start betting and you will!`"
      );
    }

    let embed = new EmbedBuilder();
    embed
      .setColor("Random")
      .setTitle(`${i.guild.name}'s Casino`)
      .setThumbnail(i.member.displayAvatarURL())
      .addFields(
        { name: `Current balance`, value: `${user.money}$ 💰`, inline: true },
        {
          name: `Time to bet on a jackpot chance of ${jackpotChance * 100}%`,
          value: `with a multiplier of ${jackpotMultiplier}x`,
        }
      )
      .setFooter({ text: `${i.guild.name}, inc.` })
      .setTimestamp();

    await i.editReply({ embeds: [embed] });
  } catch (e) {
    await i.editReply("`There was an error showing your balance..!`");
    console.log(e);
  }
}

module.exports = showBalance;
