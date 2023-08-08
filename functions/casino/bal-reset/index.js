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

async function balanceReset(interaction) {
  if (
    !isValidInteraction(interaction) ||
    interaction.commandName !== slash_cas_reset
  ) {
    return;
  }

  await interaction.deferReply();

  try {
    let currColl = clientDb.db(dbName).collection(collName);

    let user = await currColl.findOne({ name: interaction.user.username });

    if (!user) {
      return await interaction.editReply(
        "`You don't have an account yet, start betting and you will!`"
      );
    }

    await currColl.findOneAndUpdate(
      { name: interaction.user.username },
      { $set: { money: initial_amount_ofmoney } }
    );

    let embed = new EmbedBuilder();
    embed
      .setColor("Random")
      .setTitle(`${interaction.guild.name}'s Casino`)
      .setThumbnail(interaction.member.displayAvatarURL())
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
      .setFooter({ text: `${interaction.guild.name}, inc.` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    await interaction.editReply(
      "`There was an error resetting your casino balance..!`"
    );
    console.log(e);
  }
}

module.exports = balanceReset;
