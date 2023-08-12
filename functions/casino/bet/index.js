let { MongoClient, ServerApiVersion } = require("mongodb");
let { isValidInteraction } = require("../../all-config");
let { slash_bet } = require("../../slash-commands/config");
let {
  dbName,
  collName,
  initial_amount_ofmoney,
  handleWinLose,
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

async function handleBet(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_bet) {
    return;
  }

  await i.deferReply();

  let name = i.user.username;

  let amount = parseInt(i.options.data[0].value);

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
      });

      let embed = new EmbedBuilder();
      embed
        .setColor("Random")
        .setTitle(`${i.guild.name}'s Casino`)
        .setThumbnail(i.member.displayAvatarURL())
        .addFields({
          name: `Welcome to ${i.guild.name}'s casino!`,
          value: `Your cash now is set to *${initial_amount_ofmoney}$*`,
          inline: true,
        })
        .setFooter({ text: `${i.guild.name}, inc.` });

      return await i.editReply({ embeds: [embed] });
    }

    let cashNow = parseInt(findUser.money);

    if (cashNow < amount) {
      return await i.editReply(
        "`You don't have that much money to make this bet! Reset your balance and try again!`"
      );
    }

    let { possibility, mul, win, cut, endAmount, jackpot } =
      handleWinLose(amount);

    // console.log(possibility, mul, win, cut, endAmount);

    let newBalance = Number(cashNow + endAmount);

    await currColl.findOneAndUpdate({ name }, { $set: { money: newBalance } });

    let embed = new EmbedBuilder();
    embed
      .setColor("Random")
      .setTitle(`${i.guild.name}'s Casino`)
      .setThumbnail(i.member.displayAvatarURL())
      .addFields(
        { name: `Previous Balance`, value: `${cashNow}$`, inline: true },
        {
          name: `Analytics: ${
            jackpot ? `JACKPOT! 💰` : win ? "✅ Won" : "❌ Lost"
          } ${endAmount}$!`,
          value: `Possibility ${
            possibility.toFixed(1) * 100
          }%, with a ${mul}x multiplier${
            !win
              ? `, and a divisor cut of ${cut} (saved +${
                  (1 / cut).toFixed(2) * 100
                }%)`
              : ""
          }`,
          inline: true,
        },
        {
          name: `Current balance`,
          value: ` ${newBalance}$ (${cashNow} ${win ? `+` : "-"} ${Math.abs(
            endAmount
          )})`,
          inline: true,
        }
      )
      .setFooter({ text: `${i.guild.name}, inc.` })
      .setTimestamp();

    await i.editReply({ embeds: [embed] });
  } catch (e) {
    await i.editReply("There was an error betting..");
    console.log(e);
  }
}

module.exports = handleBet;
