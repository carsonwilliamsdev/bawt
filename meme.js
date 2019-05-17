const Discord = require("discord.js");

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function imageUrl(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function generateMsg(result) {
  if (imageUrl(result.data.url)) {
    return {
      title: result.data.title,
      image: { url: result.data.url }
    }
  } else {
    return {
      title: result.data.title,
      description: result.selftext
    }
  }
}


module.exports = {
   new: function(subreddit) {
       return fetch(`https://www.reddit.com/r/${subreddit}/new/.json`)
       .then(function(response) {
         return response.json()
       })
       .then(function(json)  {
         let results = json.data.children
         let result = results.randomElement()
         embeddedMsg = generateMsg(result)
         console.log(embeddedMsg)
         return embeddedMsg
      })
   }
}
