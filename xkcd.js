const Discord = require("discord.js");

Array.prototype.randomNumber = function () {

}

module.exports = {
   new: function(newest = null) {
     let comicUrl = "https://xkcd.com/info.0.json"
      if (newest == null) {
        let comicNumber = Math.floor(Math.random() * 2130)
        comicUrl = `https://xkcd.com/${comicNumber}/info.0.json`
      }
     return fetch(comicUrl)
       .then(function(response) {
         return response.json()
       })
       .then(function(json)  {
         let comic = json.img
         const embeddedMsg = {
           title: json.title,
           image: { url: json.img }
         }
         return embeddedMsg
      })
   }
}
