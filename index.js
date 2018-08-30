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
  new CronJob('0 20 16 * * *', function() {
    client.channels.get(process.env.MAINCHANNELID).send("#blazeit");
  }, null, true, 'America/Denver');
});

const keyWords = keywords.keyWords();
const keyWordsJson = keywords.keyWordsJson();

client.on("message", (message) => {
  console.log(message.author.username + ": " + message.content);

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
    let min = 1;
    let max = 100;
    let roll = Math.floor(Math.random() * (max - min) + 1);
    if (message.member.roles.find("name", "LUCKY") && roll < 80)
    {
      roll += 20;
    }
    message.channel.send(message.author.username + " rolled " + roll + " (" + min + "-" + max + ")")
  }
  else if (command === "gif")
  {
    let tags = args.join('+');
    message.channel.send(tags);
    giphyclient.random('gifs', {"tag" : tags})
    .then((response) => {
      message.channel.send(response.data.url);
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
