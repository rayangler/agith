const Discord = require('discord.js');
const agith = require('./agith');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

function numberOnly(msg) {
  var num = msg.content.substring(12);
  return num;
}

//commands
client.on('message', message => {
  if(message.content == 'ping') {
    message.reply('pong');
    message.channel.send('Test');
  }
  if(message == "agith purge " + numberOnly(message)) {
    var purgeNum = numberOnly(message);
    agith.purge(purgeNum, message);
  }
});

client.login('MjcyMTE1ODg1MzY2NDQ0MDM1.DCHYow.Ms2WquOkJc68LpGgozdom8BvT5o');
