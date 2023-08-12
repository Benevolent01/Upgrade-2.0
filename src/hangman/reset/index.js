const { isValidInteraction } = require("../../all-config");
const { slash_hm_reset } = require("../../slash-commands/config");
const { hangmanQ } = require("../config");

async function hangmanReset(i) {
  if (!isValidInteraction(i) || i.commandName !== slash_hm_reset) {
    return;
  }

  await i.deferReply();

  if (!hangmanQ.has(i.guildId)) {
    return await i.editReply("``There doesn't exist a queue currently.``");
  }

  try {
    clearTimeout(hangmanQ.get(i.guildId).timeout);
    hangmanQ.clear();
    await i.editReply("``" + "The queue has been reset! Resting..." + "``");
  } catch (e) {
    console.log(e);
    await i.editReply("An error occurred try again!");
  }
}

module.exports = hangmanReset;
