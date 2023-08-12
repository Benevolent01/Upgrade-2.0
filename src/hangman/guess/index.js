const { isValidInteraction } = require("../../all-config");
const { slash_hm_guess } = require("../../slash-commands/config");
const {
  setShowString,
  hangmanQ,
  validChar,
  chIsContained,
  revealSoFar,
} = require("../config");

async function hangmanGuess(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_hm_guess) {
    return;
  }
  await i.deferReply();

  if (!hangmanQ.has(i.guildId)) {
    return await i.editReply("``Initialise a word first, then try to guess!``");
  }

  try {
    // guaranteed to be a char
    let guessCh = i.options.data[0].value.toLowerCase();

    if (!validChar(guessCh)) {
      return await i.editReply(
        "``" + "Characters [a-z] allowed only. Try again!" + "``"
      );
    }

    let { lives, soFarWord, realWord, author } = hangmanQ.get(i.guildId);

    if (chIsContained(realWord, soFarWord, guessCh) === -1) {
      return await i.editReply(
        "``" + `Characters of ${guessCh} have already been revealed!` + "``"
      );
    } else if (!chIsContained(realWord, soFarWord, guessCh)) {
      lives -= 1;
      if (lives === 0) {
        hangmanQ.clear();
        return await i.editReply(
          "``" +
            `You have run out of lives! Secret word was ${realWord}, ${author} beat you all! Resetting the queue..` +
            "``"
        );
      }

      hangmanQ.set(i.guildId, {
        ...hangmanQ.get(i.guildId),
        lives,
      });
      return await i.editReply(
        "``" +
          `Character '${guessCh}' is not contained in the word! Lives remaining: ${lives}` +
          "``"
      );
    }

    let newWord = revealSoFar(realWord, soFarWord, guessCh);
    let formattedWord = setShowString(newWord);

    hangmanQ.set(i.guildId, {
      ...hangmanQ.get(i.guildId),
      soFarWord: newWord,
    });

    await i.editReply("``Nice Guess!``");
    await i.channel.send(`You've got ${lives} lives remaining, next guess!`);
    await i.channel.send(formattedWord);

    if (newWord === realWord) {
      clearTimeout(hangmanQ.get(i.guildId).timeout);
      hangmanQ.clear();
      await i.editReply(
        "``" +
          `You have won! The secret word was ${realWord}! ${author} lost! Resetting the queue..` +
          "``"
      );
    }
  } catch (e) {
    if (e.status === 403) {
      return await i.editReply("I can't DM you! Open your Dms and try again!");
    }
    console.log(e);
    await i.editReply("An error occurred try again!");
  }
}

module.exports = hangmanGuess;
