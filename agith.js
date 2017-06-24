const Discord = require('discord.js');
const ytdl = require('ytdl-core');

var dispatcher; //keeps track of the dispatcher being used

var songs = []; //keeps track of all of the songs for queueing
var nextSong; //keeps track of the next song in queue (songs[0])

var isPlaying; //keeps track of if agith is playing a song
var isStopped; //force stop streaming

//Should I include a module of just allGood statements?
function allGoodThough() {
  return "It's all good in the hood though.";
}

function allGoodHope() {
  return "I hope everything is all good in the hood.";
}

function allGoodEverything() {
  return "Everything's all good in the hood.";
}

function noSong() {
  return "Nothing is playing right now. ";
}

function songEnd(message, dispatcher, url) {
  dispatcher.on('end', () => {
    console.log(url + ' has ended.');
    isPlaying = false;
    nextSong = songs.shift();
    if(nextSong) {
      module.exports.stream(message, nextSong);
      console.log(nextSong + ' has been removed from the queue.');
    } else {
      message.channel.send("There are no more songs in the queue. " +
        allGoodHope());
      console.log('No more songs in queue.');
      isStopped = true;
    }
  });
}

module.exports = {
  /*** voice channel commands ***/
  /*NOTE: need to fix this!*/

  addQueue: function(message, url) {
    if(songs.length != 20) {
      songs.push(url);
      console.log(message.author.username + ' has added ' +
        url + ' to the queue.');
    }
  },

  //joins voice channel
  join: function(message) {
    console.log(message.author.username + " has requested me to join.");
    message.member.voiceChannel.join()
      .then(connection => console.log('Connected'))
      .catch(console.error);
    console.log("Joined voice channel.");
  },

  //leave voice channel
  leave: function(message) {
    console.log(message.author.username + " has requested me to leave " +
      "voice channel.");
    message.member.voiceChannel.leave();
    console.log("Left voice channel.");
  },

  //pause agith's voice
  pause: function(message, broadcast) {
    dispatcher.pause();
    message.channel.send("Music paused by " + message.author.username +
      ". " + allGoodHope());
    console.log('Music paused.')
  },

  //resume any broadcast
  resume: function(message, broadcast) {
    dispatcher.resume();
    message.channel.send("Music resumed by " + message.author.username +
      ". " + allGoodEverything());
    console.log("Music resumed.");
  },

  //play local song file
  song: function(message, broadcast) {
    message.member.voiceChannel.join()
    .then(connection => {
      return connection.playFile('./music/rock-riff.mp3');
    })
    .then(dispatcher => {
      songEnd(message, dispatcher, "Song");
    })
    .catch(console.error);
    console.log("Playing music.");
  },

  //end any broadcast
  stop: function(message, broadcast) {
    for(var i = 0; i < songs.length; i++) {
      songs.pop();
    }
    console.log('All songs in queue have been removed.');
    isPlaying = false;
    isStopped = true;
    setTimeout(function() { dispatcher.end();}, 1000);
    message.channel.send("Music ended.");
    console.log('Music stopped.');
  },

  printQueue: function(message) {
    songs.forEach(function(item, index, array) {
      message.channel.send("```\n" + ++index + " " + item + "```");
      console.log(item, index);
    });
  },

  //stream YouTube videos
  stream: function(message, url, broadcast) {
    if(isPlaying) {
      this.addQueue(message, url);
      return;
    }
    message.member.voiceChannel.join()
      .then(connection => {
        const stream = ytdl(url, { filter: 'audioonly' });
        console.log('Playing ' + url);
        isPlaying = true;
        dispatcher = connection.playStream(stream);
        return dispatcher;
      })
      .then(dispatcher => {
        songEnd(message, dispatcher, url);
      })
      .catch(console.error);
  },

  /*** agith responses ***/
  noVoiceChannel: function(message) {
    message.reply("you must be in a voice channel to use this command. " +
      allGoodThough());
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
        message.reply("please enter a valid number from 1-98. " +
          allGoodThough());
        console.log("Invalid number used. Request incomplete.");
      }
  },


  /*** for testing purposes ***/
  testPrint: function(years) {
    console.log('I am ' + years + ' years old.');
  }
}
