const Discord = require('discord.js');
const agith = require('./agith');
//const urlGrabber = require('./urlGrabber');

const client = new Discord.Client();
var broadcast;

const token = 'MjcyMTE1ODg1MzY2NDQ0MDM1.DCHYow.Ms2WquOkJc68LpGgozdom8BvT5o';

var agithVoiceID; //to keep track of which voice channel Agith is in
var isBroadcast; //keeps track of if agith should make a new broadcast

client.on('ready', () => {
  console.log('I am ready!');
});


//commands
client.on('message', message => {
  //client.sweepMessages(45);

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
    if(message.member.voiceChannelID == null) {
      agith.noVoiceChannel(message);
      return;
    }
    agith.join(message);
  }

  //leave voice channel
  if(message == "agith leave") {
    if(message.member.voiceChannelID == null) {
      agith.noVoiceChannel(message);
      return;
    }
    agith.leave(message);
  }

  //play file
  if(message == "agith song") {
    if(message.member.voiceChannelID == null) {
      agith.noVoiceChannel(message);
      return;
    }
    if(isBroadcast == false || isBroadcast == undefined) {
        broadcast = client.createVoiceBroadcast();
        isBroadcast = true;
    }
    agith.song(message);
  }

  //pause file
  if(message == "agith pause") {
    agith.pause(message, broadcast);
  }

  //resume paused music
  if(message == "agith resume") {
    agith.resume(message, broadcast);
  }

  //stop playing music
  if(message == "agith stop" || message == "agith end") {
    agith.stop(message, broadcast);
    isBroadcast = false;
  }

  //streaming music from YT
  if(message == "agith play " + message.content.substring(11)) {
    if(message.member.voiceChannelID == null) {
      agith.noVoiceChannel(message);
      return;
    }
    if(isBroadcast == false || isBroadcast == undefined) {
        broadcast = client.createVoiceBroadcast();
        isBroadcast = true;
    }
    var videoURL = message.content.substring(11);
    if(!videoURL.includes('youtube.com/watch?v=')) {
      /* YT API function here */
      //urlGrabber.start();
      //videoURL = 'youtube.com/watch?v=' + urlGrabber.getVideoID(null, videoURL);
    }
    agith.stream(message, videoURL, broadcast);
    isPaused = false;
  }

  if(message == "agith queue") {
    agith.printQueue(message);
  }

  //purge or delete messages
  if(message == "agith purge " + message.content.substring(12)) {
    var purgeNum = message.content.substring(12);
    agith.purge(purgeNum, message);
  }

});

client.login(token);
