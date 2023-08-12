let { MongoClient, ServerApiVersion } = require("mongodb");
let { isValidInteraction } = require("../../all-config");
let { slash_cas_reset } = require("../../slash-commands/config");
let { dbName, collName, initial_amount_ofmoney } = require("../config");
let { EmbedBuilder } = require("discord.js");

let uri = process.env.MONGODB_CRED;

let clientDb = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function balanceReset(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_cas_reset) {
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

    await currColl.findOneAndUpdate(
      { name: i.user.username },
      { $set: { money: initial_amount_ofmoney } }
    );

    let embed = new EmbedBuilder();
    embed
      .setColor("Random")
      .setTitle(`${i.guild.name}'s Casino`)
      .setThumbnail(i.member.displayAvatarURL())
      .addFields(
        { name: `Previous Balance`, value: `${user.money}$`, inline: true },
        {
          name: `Current balance`,
          value: `${initial_amount_ofmoney}$`,
          inline: true,
        },
        {
          name: `Status`,
          value: `You successfully reset your balance!`,
          inline: false,
        }
      )
      .setFooter({ text: `${i.guild.name}, inc.` })
      .setTimestamp();

    await i.editReply({ embeds: [embed] });
  } catch (e) {
    await i.editReply("`There was an error resetting your casino balance..!`");
    console.log(e);
  }
}

module.exports = balanceReset;
