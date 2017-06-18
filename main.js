const Discord = require('discord.js');
const agith = require('./agith');

const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast();

const token = 'MjcyMTE1ODg1MzY2NDQ0MDM1.DCHYow.Ms2WquOkJc68LpGgozdom8BvT5o';

var agithVoiceID; //to keep track of which voice channel Agith is in
var isPlaying; //keeps track of if a song is playing
var isPaused; //keeps track of if a song is paused

client.on('ready', () => {
  console.log('I am ready!');
});


//commands
client.on('message', message => {
  if(message.content == 'ping') {
    //message.reply('pong');
    //message.channel.send('Test');
    //console.log(clientID); //reminder that declaring a global variable
                           //and then giving it a value later on
                           //allows you to use it in other parts of code
    message.channel.send("Happy birthday, Via.");
  }
  //join voice channel
  if(message == "agith join") {
    agithVoiceID = message.member.voiceChannelID;
    agith.join(message, agithVoiceID);
  }
  //leave voice channel
  if(message == "agith leave") {
    agith.leave(message, agithVoiceID);
  }

  //play file
  if(message == "agith song") {
    agithVoiceID = message.member.voiceChannelID;
    broadcast.end();
    isPlaying = true;
    isPaused = false;
    agith.song(message, broadcast);
  }

  //pause file
  if(message == "agith pause" && isPaused == false) {
    isPaused = true;
    agith.pause(message, broadcast);
  }

  //resume paused music
  if(message == "agith resume" && isPaused) {
    isPaused = false;
    agith.resume(message, broadcast);
  }

  //stop playing music
  if(message == "agith stop" || message == "agith end") {
    isPlaying = false;
    agith.stop(message, broadcast);
  }

  if(message == "agith play " + message.content.substring(11)) {
    //broadcast.destroy();
    agithVoiceID = message.member.voiceChannelID;
    var videoURL = message.content.substring(11);
    agith.stream(message, broadcast, videoURL, agithVoiceID);
    isPlaying = true;
    isPaused = false;
  }

  //purge or delete messages
  if(message == "agith purge " + message.content.substring(12)) {
    var purgeNum = message.content.substring(12);
    agith.purge(purgeNum, message);
  }

});

client.login(token);
