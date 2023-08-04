let { MongoClient, ServerApiVersion } = require("mongodb");
let { isValidInteraction } = require("../../all-config");
let { slash_bet } = require("../../slash-commands/config");
let { dbName, collName, initial_amount_ofmoney, handleWinLose } = require("../config");
let { EmbedBuilder } = require("discord.js");

let uri = process.env.MONGODB_CRED;

let clientDb = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function handleBet(interaction) {

  if (!isValidInteraction(interaction) || interaction.commandName !== slash_bet) {
    return;
  }

  await interaction.deferReply();

  let name = interaction.user.username;

  let amount = parseInt(interaction.options.data[0].value);

  try {
    // name (string), money (int), isAdmin (boolean), dateRegistered (string),
    let currColl = clientDb.db(dbName).collection(collName);
    let findUser = await currColl.findOne({ name });

    if (!findUser) {
      await currColl.insertOne({
        name,
        money: initial_amount_ofmoney,
        isAdmin: false,
        dateRegistered: new Date().toLocaleString(),
      })

      let embed = new EmbedBuilder();
          embed.setColor("Random")
          .setTitle(`${interaction.guild.name}'s Casino`)
          .setThumbnail(interaction.member.displayAvatarURL())
          .addFields(
            { name: `Welcome to ${interaction.guild.name}'s casino!`, value: `Your cash now is set to *${initial_amount_ofmoney}$*`, inline: true }
          )
          .setFooter({ text: `${interaction.guild.name}, inc.`});

      return await interaction.editReply({ embeds: [embed]});
    }

    let cashNow = parseInt(findUser.money);

    if (cashNow < amount) {
      return await interaction.editReply("`You don't have that much money to make this bet! Reset your balance and try again!`");
    }

    let {possibility, mul, win, cut, endAmount, jackpot} = handleWinLose(amount);

    // console.log(possibility, mul, win, cut, endAmount);

    let newBalance = cashNow + endAmount;

    await currColl.findOneAndUpdate({ name }, { $set: {money: newBalance }});

    let embed = new EmbedBuilder();
    embed.setColor("Random")
         .setTitle(`${interaction.guild.name}'s Casino`)
         .setThumbnail(interaction.member.displayAvatarURL())
         .addFields(
          { name: `Previous Balance`, value: `${cashNow}$`, inline: true },
          { 
            name: `Analytics: ${jackpot ? `JACKPOT! 💰` : (win ? "✅ Won" : "❌ Lost")} ${endAmount}$!`, 
            value: `Possibility ${possibility.toFixed(1) * 100}%, with a ${mul}x multiplier${!win ? `, and a divisor cut of ${cut} (saved +${(1 / cut).toFixed(2) * 100}%)` : ""}`,
            inline: true,
          },
          { name: `Current balance`, value: ` ${newBalance}$ (${cashNow} ${(win ? `+` : '-')} ${Math.abs(endAmount)})`, inline: true },
         )
         .setFooter({ text: `${interaction.guild.name}, inc.`})
         .setTimestamp();
    
    await interaction.editReply({ embeds: [embed]});

  } catch (e) {
    await interaction.editReply("There was an error betting..");
    console.log(e);
  }
}

module.exports = handleBet;
