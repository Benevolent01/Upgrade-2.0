let { VALID_SERVERS } = require("../league-related/config");

module.exports = {
  // --------------------- League Related ---------------------- //

  // op-gg
  slash_opgg: "get-info",
  slash_opgg_desc: "Get a player's league account info!",
  // first string opt
  slash_opgg_fo: {
    name: "summoner-name",
    description: "Enter your summoner name",
    required: true,
  },
  // second string opt
  slash_opgg_so: {
    name: "server",
    description: "Select your region",
    required: true,
    options: VALID_SERVERS,
  },

  // mastery-gg
  slash_mast_gg: "mastery-gg",
  slash_mast_desc:
    "Find out the 25 top highest mastery champions of said player",

  // champ-quote
  slash_cq: "champ-quote",
  slash_cq_desc: "Randomly pick one of your favourite champion's quote",
  slash_cq_fo: {
    name: "champion-name",
    description: "Your champion's name",
    required: true,
  },

  // --------------------- Casino ---------------------- //

  // casino bet
  slash_bet: "bet",
  slash_bet_desc: "Play casino! Bet an amount!",
  slash_bet_fo: {
    name: "amount",
    desc: "Select the amount you want to bet",
    required: true,
  },

  // my balance
  slash_balance: "my-balance",
  slash_bal_desc: "Displays your current balance",

  // casino reset
  slash_cas_reset: "casino-reset",
  slash_cas_reset_desc: "Reset your money to a small amount",

  // --------------------- Hangman ---------------------- //

  // hangman add
  slash_hm_add: "hm-add",
  slash_hm_add_desc: "Initialise a word to play hangman!",

  // hangman guess
  slash_hm_guess: "hm-guess",
  slash_hm_guess_desc: "Hangman - Guess a character!",
  // guess option
  slash_hm_guess_opt: "guess",
  slash_hm_guess_opt_desc: "Input a character to guess!",

  // hangman reset
  slash_hm_reset: "hm-reset",
  slash_hm_reset_desc: "Reset the queue for hangman",
};
