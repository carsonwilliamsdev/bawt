
let supCommand = (command, message) => {
}

let commands = { "sup": supCommand}

module.exports = {
   sup: function(command, message) {
     message.channel.send(version);
   }
}


//
// else if (command === "avatar") {
//   if (!message.mentions.users.size) {
//       return message.channel.send(message.author.displayAvatarURL);
//   }
//   const avatarList = message.mentions.users.map(user => {
//       return user.displayAvatarURL;
//   });
//   message.channel.send(avatarList);
// }
// else if (command === "roll") {
//   message.channel.send(roll(message))
// }
// else if (command === "gif")
// {
//   let query = args.join(' ');
//   message.channel.send(query);
//   let rating = "pg-13";
//   if(message.channel.nsfw)
//   {
//     rating = "r";
//   }
//   giphyclient.search('gifs', {"q": query, "limit" : 10, "rating" : rating})
//   .then((response) => {
//     message.channel.send(response.data[Math.floor(Math.random() * (10 - 1) + 1)].url);
//   })
//   .catch((err) => {
//     message.channel.send("giphy didn't work....");
//   })
// }
// else if (command === "hot-gif")
// {
//   let rating = "pg-13";
//   giphyclient.trending("gifs", {"rating" : rating})
//   .then((response) => {
//     message.channel.send(response.data[Math.floor(Math.random() * (10 - 1) + 1)].url);
//   })
//   .catch((err) => {
//     console.log(err);
//   })
// }
// else if (command === 'trump-quote') {
//   fetch("https://api.whatdoestrumpthink.com/api/v1/quotes/random")
//   .then(function(response) {
//       return response.json();
//     })
//     .then(function(trumpJson) {
//       message.channel.send(trumpJson.message);
//   });
// }
// else if (command === 'lukas-quote') {
//   redditQuote.new().then(function(response) {
//     message.channel.send(response);
//   })
// }
// else if (command === 'opinion') {
//   let query = args.join(' ');
//   googleSuggest.new(query).then(function(response) {
//     if (response) {
//       message.channel.send(response);
//     } else {
//       message.channel.send('Try google, bruv : |')
//     }
//   })
// }
// else if (command === 'dank-meme') {
//   meme.new('dankmemes').then(function(meme) {
//     message.channel.send({embed: meme})
//   })
// }
// else if (command === 'trump-meme') {
//   meme.new('presidenttrumptwitter').then(function(meme) {
//     message.channel.send({embed: meme})
//   })
// }
// else if (command === 'crackhead-cl') {
//   meme.new('crackheadcraigslist').then(function(meme) {
//     message.channel.send({embed: meme})
//   })
// }
// else if (command === 'stockphoto') {
//   meme.new('shittystockphotos').then(function(meme) {
//     message.channel.send({embed: meme})
//   })
// }
// else if (command === 'bpt-meme') {
//   meme.new('blackpeopletwitter').then(function(meme) {
//     message.channel.send({embed: meme})
//   })
// }
// else if (command === 'starterpack') {
//   meme.new('starterpacks').then(function(meme) {
//     message.channel.send({embed: meme})
//   })
// }
// else if (command === 'comic') {
//   message.channel.send(`generated comic`, {
//     files: ["./comic-.png"]
//   });
// }
// else if (command === 'help') {
//   message.channel.send(help.commands());
// }
// else if (command === 'define') {
//   word = args[0]
//   typeOfWord = args[1]
//   let query = {word: word, typeOfWord: typeOfWord}
//   defineWord.new(query).then(function(definition){
//     response = `${query.word}: ${definition}`
//     message.channel.send(response)
//   })
// }
// });
