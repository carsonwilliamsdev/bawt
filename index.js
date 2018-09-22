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
const asciiGif = require ('./ascii_gif')

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

client.on("ready", () => {
  console.log("Bawt is ready!");
  mainChannel = client.channels.get(process.env.MAINCHANNELID);

  new CronJob('0 20 16 * * *', function() {
    mainChannel.send("#blazeit");
  }, null, true, 'America/Denver');

  initializeNewsWatcher(mainChannel);
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
    entries.forEach(function (entry) {
        channel.send("BREAKING NEWS ALERT FROM INFOWARS.COM");
        channel.send(entry.title);
    })
    channel.send(alexGifs.randomElement())
  })

  // Start watching the feed.
  watcher
  .start()
  .then(function (entries) {
  console.log(entries);
    // channel.send(`Watching ${feed} for breaking news about the globalists.`);
  })
  .catch(function(error) {
    console.error(error)
  })
}

client.on("message", (message) => {
  // log message [servername] [channelname] author: msg
  console.log(`[${message.guild}] [${message.channel.name}] ${message.author.username}: ${message.content}`);

  if (message.author.bot) return; // ignore all bot messages

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
  else if (command === 'alex-giffy') {
      asciiGif.initialize()
      asciiGif.new().then(function (asciiArray) {
        message.channel.send(`\`${asciiArray[0]}\``)
      })
    }
});

client.login(process.env.TOKEN);
