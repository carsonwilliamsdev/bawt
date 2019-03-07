const keywords = require('./keywords');
const help = require('./help');
const redditQuote = require ('./reddit_quote')
const googleSuggest = require ('./google_suggest')
const meme = require ('./meme')
const defineWord = require ('./google-define')

const version = "yeet";

const roll = (message) => {
  let min = 1;
  let max = 100;
  let roll = Math.floor(Math.random() * (max - min) + 1);
  return `${message.author.username} rolled ${roll} (${min}-${max})`
}

let sup = function () {
    return version
  }

let botMessage = function (command, message, args) {
    if (command == 'sup') {
      return sup()
    } else if (command == 'avatar') {
      if (!message.mentions.users.size) {
          return message.channel.send(message.author.displayAvatarURL);
      }
      const avatarList = message.mentions.users.map(user => {
          return user.displayAvatarURL;
      });
      return (avatarList);
    } else if (command === "roll") {
      return roll(message);
    }
    else if (command === "gif")
    {
      let rating = "pg-13";
      let query = args.join(' ');
      if(message.channel.nsfw)
      {
        rating = "r";
      }
      giphyclient.search('gifs', {"q": query, "limit" : 10, "rating" : rating})
      .then((response) => {
        let responseUrl = response.data[Math.floor(Math.random() * (10 - 1) + 1)].url
        return responseUrl
      })
      .catch((err) => {
        return "giphy didn't work...."
      })
    }
    else if (command === "hot-gif")
    {
      let rating = "pg-13";
      giphyclient.trending("gifs", {"rating" : rating})
      .then((response) => {
        let responseUrl = response.data[Math.floor(Math.random() * (10 - 1) + 1)]
        return response.url
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
          return trumpJson.message
      });
    }
    else if (command === 'lukas-quote') {
      redditQuote.new().then(function(response) {
        return response
      })
    }
    else if (command === 'opinion') {
      googleSuggest.new(query).then(function(response) {
        if (response) {
          return response
        }
      })
    }
    else if (command === 'dank-meme') {
      meme.new('dankmemes').then(function(meme) {
        return {embed: meme}
      })
    }
    else if (command === 'trump-meme') {
      meme.new('presidenttrumptwitter').then(function(meme) {
        return {embed: meme}
      })
    }
    else if (command === 'crackhead-cl') {
      meme.new('crackheadcraigslist').then(function(meme) {
        return {embed: meme}
      })
    }
    else if (command === 'stockphoto') {
      meme.new('shittystockphotos').then(function(meme) {
        return {embed: meme}
      })
    }
    else if (command === 'bpt-meme') {
      meme.new('blackpeopletwitter').then(function(meme) {
        return {embed: meme}
      })
    }
    else if (command === 'starterpack') {
      meme.new('starterpacks').then(function(meme) {
        message.channel.send({embed: meme})
      })
    }
    else if (command === 'comic') {
      return {
        files: ["./comic-.png"]
      }
    }
    else if (command === 'help') {
      return help.commands()
    }
    else if (command === 'define') {
      word = args[0]
      typeOfWord = args[1]
      let query = {word: word, typeOfWord: typeOfWord}
      defineWord.new(query).then(function(definition){
        response = `${query.word}: ${definition}`
        return response
      })
    }
}

module.exports = {
  new: function(command, message, args) {
    return botMessage(command, message, args);
  }
}
