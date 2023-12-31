// op.gg, mastery-gg, champ-quote
// bet, balance, casino-reset
// hangman add, guess, reset
let { SlashCommandBuilder } = require("@discordjs/builders");
let {
  slash_opgg,
  slash_opgg_desc,
  slash_opgg_fo,
  slash_opgg_so,
  slash_mast_gg,
  slash_mast_desc,
  slash_cq,
  slash_cq_desc,
  slash_cq_fo,
  slash_bet,
  slash_bet_desc,
  slash_bet_fo,
  slash_balance,
  slash_bal_desc,
  slash_cas_reset,
  slash_cas_reset_desc,
  slash_hm_add_desc,
  slash_hm_add,
  slash_hm_guess,
  slash_hm_guess_desc,
  slash_hm_reset,
  slash_hm_reset_desc,
  slash_hm_guess_opt_desc,
  slash_hm_guess_opt,
} = require("./config");

module.exports = {
  // --------------------- League Related ---------------------- //
  opgg: new SlashCommandBuilder()
    .setName(slash_opgg)
    .setDescription(slash_opgg_desc)
    .addStringOption((opt) =>
      opt
        .setName(slash_opgg_fo.name)
        .setDescription(slash_opgg_fo.description)
        .setRequired(slash_opgg_fo.required)
    )
    .addStringOption((opt) =>
      opt
        .setName(slash_opgg_so.name)
        .setDescription(slash_opgg_so.description)
        .setRequired(slash_opgg_so.required)
        .addChoices(
          ...slash_opgg_so.options.map((server) => ({
            name: server,
            value: server,
          }))
        )
    ),

  masterygg: new SlashCommandBuilder()
    .setName(slash_mast_gg)
    .setDescription(slash_mast_desc)
    .addStringOption((opt) =>
      opt
        .setName(slash_opgg_fo.name)
        .setDescription(slash_opgg_fo.description)
        .setRequired(slash_opgg_fo.required)
    )
    .addStringOption((opt) =>
      opt
        .setName(slash_opgg_so.name)
        .setDescription(slash_opgg_so.description)
        .setRequired(slash_opgg_so.required)
        .addChoices(
          ...slash_opgg_so.options.map((server) => ({
            name: server,
            value: server,
          }))
        )
    ),

  champquote: new SlashCommandBuilder()
    .setName(slash_cq)
    .setDescription(slash_cq_desc)
    .addStringOption((opt) =>
      opt
        .setName(slash_cq_fo.name)
        .setDescription(slash_cq_fo.description)
        .setRequired(slash_cq_fo.required)
    ),

  // --------------------- Casino ---------------------- //
  bet: new SlashCommandBuilder()
    .setName(slash_bet)
    .setDescription(slash_bet_desc)
    .addIntegerOption((opt) =>
      opt
        .setName(slash_bet_fo.name)
        .setDescription(slash_bet_fo.desc)
        .setRequired(slash_bet_fo.required)
        .setMinValue(1)
        .setMaxValue(1e9)
    ),

  balance: new SlashCommandBuilder()
    .setName(slash_balance)
    .setDescription(slash_bal_desc),

  casino_reset: new SlashCommandBuilder()
    .setName(slash_cas_reset)
    .setDescription(slash_cas_reset_desc),

  // --------------------- Hangman ---------------------- //
  hangman_add: new SlashCommandBuilder()
    .setName(slash_hm_add)
    .setDescription(slash_hm_add_desc),

  hangman_guess: new SlashCommandBuilder()
    .setName(slash_hm_guess)
    .setDescription(slash_hm_guess_desc)
    .addStringOption((opt) =>
      opt
        .setName(slash_hm_guess_opt)
        .setDescription(slash_hm_guess_opt_desc)
        .setRequired(true)
        .setMaxLength(1)
        .setMinLength(1)
    ),

  hangman_reset: new SlashCommandBuilder()
    .setName(slash_hm_reset)
    .setDescription(slash_hm_reset_desc),
};
