module.exports = {
  // dnd, idle, invisible, online
  BOT_PRESENCE_STATUS: "online",

  // any string
  BOT_ACTIVITY_DESC: "music for this server",

  // COMPETING, LISTENING, PLAYING, STREAMING, WATCHING
  BOT_ACTIVITY_TYPE: "PLAYING",

  isValidInteraction: (interaction) => {
    if (
      !interaction.isChatInputCommand() ||
      !interaction.guildId ||
      interaction.user.bot
    ) {
      return false;
    }
    return true;
  },

  isValidMessage: (msg) => {
    if (!msg.guildId || msg.author.bot) return false;
    return true;
  },

  getRandomHex: () => {
    let hex = "0123456789ABCDEF".split("");
    let hexColor = "#";
    let getRandomNum = () => Math.floor(Math.random() * hex.length);
    for (let i = 0; i < 6; i++) {
      hexColor += hex[getRandomNum()];
    }
    return hexColor;
  },
};
