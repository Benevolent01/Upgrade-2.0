let win_less_than =  0.6;
let jackpotChance = 0.01;
let jackpotMultiplier = 500;

// the inbetween difference, is the possibilities
// now, 60%, 30%, 10%
let first_possibility = 0.6;
let first_pos_multiplier = 2;

let second_possibility = 0.9;
let second_pos_multiplier = 4;

let third_possibility = 1;
let third_pos_multiplier = 8;

let lose_cut_divider = 2;

module.exports = {
  dbName: process.env.MONGODB_DB_NAME,
  collName: process.env.MONGO_DB_COLL_NAME,

  initial_amount_ofmoney: 50,
  jackpotChance,
  jackpotMultiplier,

  handleWinLose: (amount) => {
    // 60% win, 40% lose
    let winOrLose = Math.random() <= win_less_than;

    // 1% chance
    let jackpot = Math.random() <= jackpotChance;
    
    let chance = Math.random();

    // x: possibility won, y: multiplier
    let luck = {x: null, y: null};

    if (chance <= first_possibility) {
      luck.x = first_possibility;
      luck.y = first_pos_multiplier

    } else if (chance <= second_possibility) {
      luck.x = second_possibility - first_possibility;
      luck.y = second_pos_multiplier;

    } else if (chance <= third_possibility) {
      luck.x = third_possibility - second_possibility;
      luck.y = third_pos_multiplier;

    }

    if (jackpot) {
      winOrLose = 1;
      jackpot = 1;
      luck.x = jackpotChance;
      luck.y = jackpotMultiplier;
    }

    let endAmount = winOrLose ? (amount * luck.y * 1) : ((amount * luck.y * -1) / lose_cut_divider);

    return {possibility: luck.x, mul: luck.y, win: winOrLose, cut: lose_cut_divider, endAmount, jackpot};
  }
}