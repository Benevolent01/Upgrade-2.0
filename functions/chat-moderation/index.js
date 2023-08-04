let { isValidMessage } = require("../all-config");
let { badWords, containsBadWord, shouldProceedWithBan, timeout_duration } = require("./config");
let mp = new Map([]);

badWords.forEach(word => mp.set(word, 1));

async function moderateChat(msg) {
  
  if (!isValidMessage(msg)) {
    return;
  }
  
  if (!containsBadWord(msg, mp) || !shouldProceedWithBan()) {
    return;
  }
  
  try {
    let hours = timeout_duration / 3600000;
    await msg.member.timeout(timeout_duration, "They deserved it.")
    .then(async (e) => {
      msg.delete();
      msg.channel.send(`${msg.author.username} got timed out for ${hours} hour${hours > 1 ? "s" : ""}!`);
    }).catch(e => {
      console.log(e)
      msg.channel.send("I'm sure you said a bad word, but I can't time out out?!")
    })
  } catch (e) { 
    console.log(e)
    msg.channel.send("I'm sure you said a bad word, but I can't time out out?!") 
  }
}

module.exports = moderateChat;