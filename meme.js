const Discord = require("discord.js");

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
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
         const embeddedMsg = {
           title: result.data.title,
           image: { url: result.data.url }
         }
         console.log(embeddedMsg)
         return embeddedMsg
      })
   }
}
