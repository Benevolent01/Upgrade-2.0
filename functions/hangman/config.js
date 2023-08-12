let diff1 = "easy";
let diff2 = "medium";
let diff3 = "hard";

let minLength = 5;
let maxLength = 50;

let timeoutAwaitInput = 60;

let hiddenCh = "*";

let hangmanQ = new Map();
let queueTimeout = 15 * 60 * 1000;

module.exports = {
  diff1,
  diff2,
  diff3,
  minLength,
  maxLength,
  timeoutAwaitInput,
  hangmanQ,
  hiddenCh,
  queueTimeout,

  validInputWord: (word) => {
    let ok = 1;
    for (let i = 0; i < word.length; i++) {
      if (!(word[i] >= "a" && word[i] <= "z")) ok = 0;
    }
    // at least two distinct chars
    let st = new Set();
    for (let ch of word) st.add(ch);
    return ok && st.size > 1;
  },

  validDifficulty: (diff) => {
    return [diff1, diff2, diff3].some((d) => d === diff.toLowerCase());
  },

  setLives: (diff) => {
    switch (diff) {
      case diff1:
        return 20;
      case diff2:
        return 10;
      case diff3:
        return 5;
      default:
        return 18;
    }
  },

  revealSoFar: (word, wordNow, ch) => {
    let s = "";
    for (let i = 0; i < word.length; i++) {
      if (word[i] === wordNow[i]) s += word[i];
      else if (word[i] === ch) s += ch;
      else s += hiddenCh;
    }
    return s;
  },

  setShowString: (word) => {
    let s = "";
    for (let i = 0; i < word.length; i++) {
      s += word[i];
      if (i + 1 < word.length) s += " ";
    }
    return "```" + s + "```";
  },

  validChar: (ch) => {
    return new RegExp(/([a-z]{1})/g).test(ch);
  },

  chIsContained: (word, wordNow, ch) => {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === ch && wordNow[i] === hiddenCh) return 1;
      else if (word[i] === ch && wordNow[i] === word[i]) return -1;
    }
    return 0;
  },
};
