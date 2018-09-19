Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

module.exports = {
   new: function() {
       return fetch("https://www.reddit.com/r/dankmemes/new/.json")
       .then(function(response) {
         return response.json()
       })
       .then(function(json)  {
         let results = json.data.children
         let result = results.randomElement()
         return result.data.url
      })
   }
}
