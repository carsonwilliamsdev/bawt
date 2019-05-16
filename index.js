// Bawt
const Discord = require("discord.js");
const client = new Discord.Client();
var GphApiClient = require('giphy-js-sdk-core')
giphyclient = GphApiClient(process.env.GIPHYAPIKEY)
const prefix = "bawt";
const keywords = require('./keywords');
var CronJob = require('cron').CronJob;
const botMessage = require ('./bot_message')
var Jimp = require('jimp');
var mainChannel;
const piwigo = require ('./piwigo')
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.DATABASE_HOST,
    port : process.env.DATABASE_PORT,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASS,
    database : process.env.DATABASE_NAME
  }
});

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

client.on("ready", () => {
  console.log("Bawt is ready!");

  new CronJob('0 20 16 * * *', function() {
    mainChannel.send("#blazeit");
  }, null, true, 'America/Denver');

  mainChannel = client.channels.get(process.env.MAINCHANNELID);
  newsChannel = client.channels.get(process.env.NEWSCHANNELID);

  initializeNewsWatcher(newsChannel);
});

const keyWords = keywords.keyWords();
const keyWordsJson = keywords.keyWordsJson();

const initializeNewsWatcher = (channel) => {
  var Watcher  = require('feed-watcher'),
  feed     = 'https://www.infowars.com/feed/custom_feed_rss',
  interval = 60 // seconds

  var watcher = new Watcher(feed, interval)

  // A bunch of Alex jones gifs from imgur
  const alexGifs = [
    'https://i.imgur.com/7tNfEHO.gif',
    'https://i.imgur.com/eLNfkb4.gif',
    'https://i.imgur.com/56RMHrA.gif',
    'https://i.imgur.com/fQjH53C.gif',
    'https://i.imgur.com/xctaySa.gif',
    'https://i.imgur.com/Xo3pYeB.gif',
    'https://i.imgur.com/ACJndq4.gif',
    'https://i.imgur.com/pSjmN36.gif',
    'https://i.imgur.com/zKKfSLi.gif'
  ]

  // Check for new entries every 60 seconds.
  watcher.on('new entries', function (entries) {
    channel.send("BREAKING NEWS ALERT FROM INFOWARS.COM");
    entries.forEach(function (entry) {
        channel.send(entry.link);
    })
    channel.send(alexGifs.randomElement())
  })

  // Start watching the feed.
  watcher
  .start()
  .then(function (entries) {
    console.log("news watcher initialized");
  })
  .catch(function(error) {
    console.error(error)
  })
}

var msgqueue = [];

client.on("message", (message) => {
  // log message [servername] [channelname] author: msg
  console.log(`[${message.guild}] [${message.channel.name}] ${message.author.username}: ${message.content}`);
  if (message.author.bot) return; // ignore all bot messages

  // no long messages, @mentions, or attachments
  if(message.length > 240 || message.mentions.users.size || message.attachments.size || message.channel != mainChannel || message.content.toLowerCase().startsWith(prefix))
  {
    msgqueue = [];
  }
  else
  {
    msgqueue.push(message);
  }
  while(msgqueue.length > 3)
  {
    msgqueue.shift();
  }

  if(msgqueue.length == 3 &&
    msgqueue[0].author.username === msgqueue[2].author.username &&
    msgqueue[0].author.username != msgqueue[1].author.username &&
    msgqueue[0].channel.name == msgqueue[1].channel.name &&
    msgqueue[1].channel.name == msgqueue[2].channel.name)
  {
    // comic trigger
    var avatar1url = "" + msgqueue[0].author.avatarURL;
    var avatar2url = "" + msgqueue[1].author.avatarURL;
    var comictemplatefilename = "./comictemplate.png";

    var avatar1promise = new Promise(function(resolve, reject) {
      Jimp.read(avatar1url, function (err, avatar1image) {
        if (err)
        {
          reject(err);
        }
        else
        {
          avatar1image.resize(90, 90);
          resolve(avatar1image);
        }
      });
    });

    var avatar2promise = new Promise(function(resolve, reject) {
      Jimp.read(avatar2url, function (err, avatar2image) {
        if (err)
        {
          reject(err);
        }
        else
        {
          avatar2image.resize(90, 90);
          resolve(avatar2image);
        }
      });
    });

    var comicpromise = new Promise(function(resolve, reject) {
      Jimp.read(comictemplatefilename, function (err, comicimage) {
        if (err)
        {
          reject(err);
        }
        else
        {
          resolve(comicimage);
        }
      });
    });

    var fontpromise = new Promise(function(resolve, reject) {
      Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
      .then(font => (resolve(font)));
    });

    Promise.all([avatar1promise, avatar2promise, comicpromise, fontpromise])
    .then(function(values){
      console.log("promises are done");

      var avatar1 = values[0];
      var avatar2 = values[1];
      var comic = values[2];
      var font = values[3];

      comic.blit(avatar1, 30, 221);
      comic.blit(avatar1, 495, 217);
      comic.blit(avatar1, 951, 227);

      comic.blit(avatar2, 245, 214);
      comic.blit(avatar2, 734, 206);
      comic.blit(avatar2, 1153, 218);

      comic.print(font, 36, 40, msgqueue[0].content, 305, 101)
        .print(font, 485, 44, msgqueue[1].content, 305, 101)
        .print(font, 942, 40, msgqueue[2].content, 305, 101)
        .write("./comic-.png");

      // clear queue
      msgqueue = [];
    })
    .catch(error => {
      console.log(error);
    });
  } // end comic trigger

  let messageWords = message.content.split(" ");
  keyWords.forEach(function(element) {
      let found = messageWords.filter(s => s.includes(element));
      if (found.length) {
        let response = keyWordsJson[found]
        message.channel.send(response);
      }
    });

  if (message.attachments) {
    message.attachments.forEach(attachment => {
      const url = attachment.url;
      console.log("attachment detected:" + url)
      piwigo.uploadImage(url)
    });
  }

  // messages must start with prefix
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase().trim();
  if (command) {
    botMessage.new(command, message, args)
  }
});

client.login(process.env.TOKEN);
