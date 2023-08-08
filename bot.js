require("dotenv").config();
let { Client } = require("discord.js");
let { GatewayIntentBits } = require("discord-api-types/v10");

let client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});

let EventEmitter = require("events");
let emitter = new EventEmitter();
emitter.setMaxListeners(30);
let { REST } = require("@discordjs/rest");
let { Routes } = require("discord-api-types/v9");

// ---------------------------------------------- //
let slashCommands = require("./functions/slash-commands");
const {
  BOT_PRESENCE_STATUS,
  BOT_ACTIVITY_DESC,
  BOT_ACTIVITY_TYPE,
} = require("./functions/all-config");
const moderateChat = require("./functions/chat-moderation");
const leagueOpGG = require("./functions/league-related/op-gg");
const masteriesGG = require("./functions/league-related/masteries-gg");
const getChampQuote = require("./functions/league-related/get-champ-quote");
const handleBet = require("./functions/casino/bet");
const balanceReset = require("./functions/casino/bal-reset");
const showBalance = require("./functions/casino/my-bal");
const handleCollection = require("./functions/casino/database/model");

// --------------------- On ready ---------------------- //

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ status: BOT_PRESENCE_STATUS });
  client.user.setActivity(BOT_ACTIVITY_DESC, { type: BOT_ACTIVITY_TYPE });

  let rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

  let commands = [];
  for (let obj in slashCommands) {
    commands.push(slashCommands[obj]);
  }
  commands.map((command) => command.toJSON());

  rest.put(
    Routes.applicationGuildCommands(
      process.env.BOT_ID,
      process.env.MAIN_GUILD_ID
    ),
    { body: commands }
  );
});

// --------------------- Moderation ---------------------- //

// Chat Moderation
client.on("messageCreate", async (msg) => moderateChat(msg));

// --------------------- League Related ---------------------- //

// OP-GG
client.on("interactionCreate", async (interaction) => leagueOpGG(interaction));

// Get masteries
client.on("interactionCreate", async (interaction) => masteriesGG(interaction));

// Get champ quote
client.on("interactionCreate", async (interaction) =>
  getChampQuote(interaction)
);

// --------------------- Casino ---------------------- //

let initializingCollection = true;
if (initializingCollection) {
  handleCollection();
}

client.on("interactionCreate", async (interaction) => handleBet(interaction));

client.on("interactionCreate", async (interaction) =>
  balanceReset(interaction)
);

client.on("interactionCreate", async (interaction) => showBalance(interaction));

// --------------------- Hangman ---------------------- //

client.on("messageCreate", () => {});

//HangMan
client.on("interactionCreate", async () => {
  /*
  add
   - initialize the queue
   - input user WORD and DIFFICULTY
   - push embed
   - if not input, delete queue

  guess
    input character,
    if the character matches any, show all characters and print message
    - push embed (shows lives remaining and the word)

  reset
    - delete the queue

  initially the word is completely hidden, depending to difficulty config:

  easy: show 3 random characters, 20 lives
  medium: show 2 random characters, 15 lives
  hard: show 1 random character, 10 lives

  hangmanQ {
    id: serverId, 
    word_to_appear: "",
    lives: Number(),
    realWord: "",
  }
  */
});

client.login(process.env.DISCORD_BOT_TOKEN);
