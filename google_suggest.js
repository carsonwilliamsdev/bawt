let convert = require('xml-js');

module.exports = {
   new: function(query) {
     let url = `http://clients1.google.com/complete/search?hl=en&output=toolbar&q=${query}%20is%20`
     if (query.split(" ").length > 0) {
       query = query.split(" ").join("%20")
       url = `http://clients1.google.com/complete/search?hl=en&output=toolbar&q=${query}%20is%20`
     }
     return fetch(url).then(function(response) {
       return response.text()
     })
     .then(function(xml)  {
        let answer = "I dont have an opinion about that."
        let json = convert.xml2json(xml, {compact: true, spaces: 4});
        json = JSON.parse(json)
        let suggestions = json.toplevel.CompleteSuggestion
        if (suggestions) {
          let suggestionJson = suggestions[Math.floor(Math.random()*suggestions.length)]
          answer = suggestionJson.suggestion["_attributes"].data
        }
        return answer
    })
  }
}
