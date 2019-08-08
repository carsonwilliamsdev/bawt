const Discord = require("discord.js");

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function imageUrl(result) {
    return (result.data.url.match(/\.(jpeg|jpg|gif|png)$/) != null)
}

function memeDisallowed(result) {
  if (result.data.is_video ||
    result.data.selftext.length > 2049 ||
    result.data.over_18)  {
      return true
    } else {
      return false
    }
}

function youtubeUrl(result) {
  return (result.data.media && result.data.media.type == 'youtube.com')
}

function generateMsg(results) {
  let result = results.randomElement()
  if (memeDisallowed(result)) {
    return
  }
  if (imageUrl(result)) {
    return {
      title: result.data.title,
      image: { url: result.data.url }
    }
  } else if (youtubeUrl(result)) {
    return {
      title: result.data.title,
      video: { url: result.data.url }
    }
  }
  else {
    return {
      title: result.data.title,
      description: result.data.selftext
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
         let result = generateMsg(results)
         return result
      })
   }
}
