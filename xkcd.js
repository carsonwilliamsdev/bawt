const Discord = require("discord.js");

Array.prototype.randomNumber = function () {

}

module.exports = {
   new: function() {
       let comicNumber = Math.floor(Math.random() * 2130)
       return fetch(`https://xkcd.com/${comicNumber}/info.0.json`)
       .then(function(response) {
         return response.json()
       })
       .then(function(json)  {
         let comic = json.img
         const embeddedMsg = {
           title: json.title,
           image: { url: json.img }
         }
         console.log(embeddedMsg)
         return embeddedMsg
      })
   }
}
