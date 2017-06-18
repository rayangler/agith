const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1};


//const game = require.('./agithGames')

function allGood() {
  return "It's all good in the hood though.";
}

function noSong() {
  return "Nothing is playing right now. ";
}

module.exports = {
  /*** voice channel commands ***/
  //joins voice channel
  join: function(message, voiceID) {
    //if user is not in a voice channel
    if(voiceID == null) {
      message.reply("You must be in a voice channel to execute" +
        " this command. " + allGood());
      return;
    }
    console.log(message.author.username + " has requested me to join " +
      voiceID);
    message.member.voiceChannel.join()
      .then(connection => console.log('Connected'))
      .catch(console.error);
    console.log("Joined voice channel.");
  },

  //leave voice channel
  leave: function(message, voiceID) {
    //if the user is not in the same voice channel as Agith
    if(message.member.voiceChannelID != voiceID) {
      message.reply("You must be in the proper voice channel to execute" +
        " this command. " + allGood());
      return;
    }
    console.log(message.author.username + " has requested me to leave " +
      "voice channel.");
    message.member.voiceChannel.leave();
    console.log("Left voice channel.");
  },

  //pause any broadcast
  pause: function(message, broadcast) {
    broadcast.pause();
    message.channel.send("Music paused.");
    console.log("Music paused");
  },

  //resume any broadcast
  resume: function(message, broadcast) {
    broadcast.resume();
    message.channel.send("Music resumed.");
    console.log("Music resumed.");
  },

  //play local song file
  song: function(message, broadcast) {
    message.member.voiceChannel.join()
    .then(connection => {
      broadcast.playFile('./eighteen.mp3');
      const dispatcher = connection.playBroadcast(broadcast);
    })
    .catch(console.error);
    console.log("Playing music.");
  },

  //end any broadcast
  stop: function(message, broadcast) {
    broadcast.destroy();
    message.channel.send("Music ended.");
    console.log("Music stopped.");
  },

  //stream YouTube videos
  stream: function(message, broadcast, videoURL) {
    if(message.member.voiceChannelID == null) {
      message.reply("You must be in a voice channel for this to work. " +
        allGood());
      return;
    }
    message.member.voiceChannel.join()
      .then(connection => {
        const stream = ytdl(videoURL, { filter: 'audioonly' });
        broadcast.playStream(stream, streamOptions);
        const dispatcher = connection.playBroadcast(broadcast);
      })
      .catch(console.error);
  },


  /*** text channel commands ***/
  //deletes x number of messages
  purge: function(purgeNum, message) {
    console.log("Purge command called by " + message.author.username +
      ". Deleting messages.");
    //purgeNum must be between 2 and 99
    if (purgeNum >= 1 && purgeNum <= 98) {
      message.channel.bulkDelete(++purgeNum);
      console.log("Deleted " + purgeNum + " messages.");
    } else {
        message.reply("Please enter a valid number from 1-98. " +
          allGood());
        console.log("Invalid number used. Request incomplete.");
      }
  }

}
