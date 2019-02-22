Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

let defineWord = function (query) {
  return fetch(`https://googledictionaryapi.eu-gb.mybluemix.net?define=${query['word']}&lang=en`)
  .then(function(response) {
      return response.json()
  })
  .then(function(json)  {
    if (query.typeOfWord) {
      return json.meaning[query.typeOfWord][0].definition
    } else {
      return json.meaning['noun'][0].definition
    }
 })
}

module.exports = {
   new: function(query) {
     return defineWord(query);
  }
}
