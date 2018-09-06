// Bawt
const Discord = require("discord.js");
const client = new Discord.Client();
var GphApiClient = require('giphy-js-sdk-core')
giphyclient = GphApiClient(process.env.GIPHYAPIKEY)
const prefix = "bawt";
const keywords = require('./keywords');
var CronJob = require('cron').CronJob;

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
  if (message.member.roles.find("name", "LUCKY") && roll < 80)
  {
    roll += 20;
  }
  return `${message.author.username} rolled ${roll} (${min}-${max})`
}

const initializeNewsWatcher = (channel) => {
  var Watcher  = require('feed-watcher'),
  feed     = 'https://www.infowars.com/feed/custom_feed_rss',
  interval = 60 // seconds
  
  var watcher = new Watcher(feed, interval)
  
  // Check for new entries every 60 seconds.
  watcher.on('new entries', function (entries) {
    entries.forEach(function (entry) {
      console.log(entry.title);
      channel.send("BREAKING NEWS ALERT FROM INFOWARS.COM");
      channel.send(entry.title);
      giphyclient.search('gifs', {"q": "alex jones infowars", "limit" : 10, "rating" : "pg-13"})
      .then((response) => {
        channel.send(response.data[Math.floor(Math.random() * (10 - 1) + 1)].url);
      })
      .catch((err) => {
      })
    })
  })
  
  // Start watching the feed.
  watcher
  .start()
  .then(function (entries) {
  console.log(entries);
    channel.send(`Watching ${feed} for breaking news about the globalists.`);
  })
  .catch(function(error) {
    console.error(error)
  })
}

client.on("message", (message) => {
  // log message [servername] [channelname] author: msg
  console.log(`["${message.guild} ] [${message.channel.name}] ${message.author.username}: ${message.content}`);

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
    message.channel.send("nm");
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
  else if (command ==='trump-quote') {
    fetch("https://api.whatdoestrumpthink.com/api/v1/quotes/random")
    .then(function(response) {
        return response.json();
      })
      .then(function(trumpJson) {
        message.channel.send(trumpJson.message);
    });
  }
});

client.login(process.env.TOKEN);
