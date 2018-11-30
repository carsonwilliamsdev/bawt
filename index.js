// Bawt
const Discord = require("discord.js");
const client = new Discord.Client();
var GphApiClient = require('giphy-js-sdk-core')
giphyclient = GphApiClient(process.env.GIPHYAPIKEY)
const prefix = "bawt";
const version = "yo";
const keywords = require('./keywords');
var CronJob = require('cron').CronJob;
const redditQuote = require ('./reddit_quote')
const googleSuggest = require ('./google_suggest')
const dankMeme = require ('./dank_meme')
var Jimp = require('jimp');

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

client.on("ready", () => {
  console.log("Bawt is ready!");

  mainChannel = client.channels.get(process.env.MAINCHANNELID);
  newsChannel = client.channels.get(process.env.NEWSCHANNELID);

  new CronJob('0 20 16 * * *', function() {
    mainChannel.send("#blazeit");
  }, null, true, 'America/Denver');

  initializeNewsWatcher(newsChannel);
});

const keyWords = keywords.keyWords();
const keyWordsJson = keywords.keyWordsJson();

const roll = (message) => {
  let min = 1;
  let max = 100;
  let roll = Math.floor(Math.random() * (max - min) + 1);
  return `${message.author.username} rolled ${roll} (${min}-${max})`
}

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
  if(message.length > 240 || message.mentions.users.size || message.attachments.size || message.channel != mainChannel)
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
        .write("./comic-.png", () => { // todo: what are the callback params for this?
          message.channel.send(`generated comic`, {
            files: ["./comic-.png"]
        });
      })

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

  // messages must start with prefix
  if (!message.content.toLowerCase().startsWith(prefix))  return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase().trim();

  if (command === "sup") {
    message.channel.send(version);
  }
  else if (command === "avatar") {
    if (!message.mentions.users.size) {
        return message.channel.send(message.author.displayAvatarURL);
    }
    const avatarList = message.mentions.users.map(user => {
        return user.displayAvatarURL;
    });
    message.channel.send(avatarList);
  }
  else if (command === "roll") {
    message.channel.send(roll(message))
  }
  else if (command === "gif")
  {
    let query = args.join(' ');
    message.channel.send(query);
    let rating = "pg-13";
    if(message.channel.nsfw)
    {
      rating = "r";
    }
    giphyclient.search('gifs', {"q": query, "limit" : 10, "rating" : rating})
    .then((response) => {
      message.channel.send(response.data[Math.floor(Math.random() * (10 - 1) + 1)].url);
    })
    .catch((err) => {
      message.channel.send("giphy didn't work....");
    })
  }
  else if (command === "hot-gif")
  {
    let rating = "pg-13";
    giphyclient.trending("gifs", {"rating" : rating})
    .then((response) => {
      message.channel.send(response.data[Math.floor(Math.random() * (10 - 1) + 1)].url);
    })
    .catch((err) => {
      console.log(err);
    })
  }
  else if (command === 'trump-quote') {
    fetch("https://api.whatdoestrumpthink.com/api/v1/quotes/random")
    .then(function(response) {
        return response.json();
      })
      .then(function(trumpJson) {
        message.channel.send(trumpJson.message);
    });
  }
  else if (command === 'lukas-quote') {
    redditQuote.new().then(function(response) {
      message.channel.send(response);
    })
  }

  else if (command === 'opinion') {
    let query = args.join(' ');
    googleSuggest.new(query).then(function(response) {
      if (response) {
        message.channel.send(response);
      } else {
        message.channel.send('Try google, bruv : |')
      }
    })
  }
  else if (command === 'dank-meme') {
    dankMeme.new().then(function(meme) {
      message.channel.send(meme)
    })
  }
});

client.login(process.env.TOKEN);
