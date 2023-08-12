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
let slashCommands = require("./slash-commands");
const {
  BOT_PRESENCE_STATUS,
  BOT_ACTIVITY_DESC,
  BOT_ACTIVITY_TYPE,
} = require("./all-config");
const moderateChat = require("./chat-moderation");
const leagueOpGG = require("./league-related/op-gg");
const masteriesGG = require("./league-related/masteries-gg");
const getChampQuote = require("./league-related/get-champ-quote");
const handleBet = require("./casino/bet");
const balanceReset = require("./casino/bal-reset");
const showBalance = require("./casino/my-bal");
const handleCollection = require("./casino/database/model");
const hangmanAdd = require("./hangman/add");
const hangmanGuess = require("./hangman/guess");
const hangmanReset = require("./hangman/reset");

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

  // register slash commands globally
  if (process.env.PRODUCTION_ENV) {
    await rest.put(Routes.applicationCommands(client.application.id), {
      body: commands,
    });
  } else {
    await rest.put(
      Routes.applicationGuildCommands(
        client.application.id,
        process.env.MAIN_GUILD_ID
      ),
      {
        body: commands,
      }
    );
  }
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

client.on("interactionCreate", (i) => hangmanAdd(i));

client.on("interactionCreate", (i) => hangmanGuess(i));

client.on("interactionCreate", async (i) => hangmanReset(i));

// --------------------- End ---------------------- //

client.login(process.env.DISCORD_BOT_TOKEN);
