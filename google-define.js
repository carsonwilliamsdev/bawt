let defineWord = function (query) {
  console.log(query)
  return fetch(`https://googledictionaryapi.eu-gb.mybluemix.net?define=${query['word']}&lang=en`)
  .then(function(response) {
      return response.json()
  })
  .then(function(json)  {
    let result = json[0]
    if (query.typeOfWord) {
      definition = result.meaning[query.typeOfWord][0].definition
    } else {
      definition = result.meaning['noun'][0].definition
    }
    return definition
 })
}

module.exports = {
   new: function(query) {
     return defineWord(query);
  }
}
