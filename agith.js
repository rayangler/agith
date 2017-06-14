const Discord = require('discord.js');

module.exports = {
  //deletes x number of messages
  purge: function(purgeNum, message) {
    console.log("Purge command called by " + message.author.username +
      ". Deleting messages.");
    if (purgeNum >= 2 && purgeNum <= 98) {
      message.channel.bulkDelete(++purgeNum);
      console.log("Deleted " + purgeNum + " messages.");
    } else {
        message.reply("Please enter a valid number from 2-98. It's all good in the hood though.");
        console.log("Invalid number used. Request incomplete.");
      }
  }

}
