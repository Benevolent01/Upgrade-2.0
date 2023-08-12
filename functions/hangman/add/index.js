const { isValidInteraction } = require("../../all-config");
const { slash_hm_add, slash_hm_guess } = require("../../slash-commands/config");
const {
  validInputWord,
  validDifficulty,
  setLives,
  setShowString,
  hangmanQ,
  diff1,
  diff2,
  diff3,
  minLength,
  maxLength,
  timeoutAwaitInput,
  revealSoFar,
  hiddenCh,
  queueTimeout,
} = require("../config");

const INITIALIZING_QUEUE = "initialising";

async function hangmanAdd(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_hm_add) {
    return;
  }
  await i.deferReply();

  if (hangmanQ.has(INITIALIZING_QUEUE)) {
    return await i.editReply(
      "``There already exists a queue! You can't do that.``"
    );
  }

  try {
    await i.editReply("``" + "Initialising..." + "``");
    let author = i.user;

    hangmanQ.set(INITIALIZING_QUEUE, 1);

    let msgs = await author.send(
      "``" +
        `Send me two messages. First one containing the secret word with length between (${minLength}-${maxLength}) containing characters from a-z, ` +
        `and the second one containing the difficulty choose between (${diff1}, ${diff2}, ${diff3})! ` +
        `Your word must have at least two distinct letters! Request will timeout in ${timeoutAwaitInput}s` +
        "``"
    );

    let cId = await msgs.channel.awaitMessages({
      max: 2,
      time: 1000 * timeoutAwaitInput,
      errors: ["time"],
    });

    // word always lowercase
    let word = cId.first().content.toLowerCase();

    // evade case-sensitivity, we just need characters from aA-zZ
    let difficulty = cId.last().content.toLowerCase();

    if (!validInputWord(word) || !validDifficulty(difficulty)) {
      hangmanQ.clear();
      return i.editReply("``" + "Author gave wrong input!" + "``");
    }

    let wordNow = hiddenCh.repeat(word.length);
    let lives = setLives(difficulty);
    let soFarWord = revealSoFar(word, wordNow, word[0]);
    let showString = setShowString(soFarWord);

    hangmanQ.set(i.guildId, {
      lives,
      soFarWord,
      realWord: word,
      author: i.user.username,
      timeout: setTimeout(async () => {
        await i.channel.send(
          "``" + `You took too long! Queue has timed out! Resetting...` + "``"
        );
        hangmanQ.clear();
      }, queueTimeout),
    });

    await i.channel.send(
      "``Game on! Everything is in a-z characters. (lowercase)``"
    );
    await i.channel.send(
      `You've got ${lives} lives remaining and ${
        queueTimeout / (60 * 1000)
      } minutes, start guessing with /${slash_hm_guess}`
    );
    await i.channel.send(showString);
  } catch (e) {
    console.log(e);
    if (e.status === 403) {
      hangmanQ.clear();
      return await i.editReply("I can't DM you! Open your Dms and try again!");
    }
    hangmanQ.clear();
    await i.editReply("``" + "Request timed out! Resetting queue..." + "``");
  }
}

module.exports = hangmanAdd;
