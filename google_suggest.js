let convert = require('xml-js');

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

let parseXml = function (xml) {
  let jsonResponse = convert.xml2json(xml, {compact: true, spaces: 4});
  json = JSON.parse(jsonResponse)
  return generateSuggestion(json)
}

let generateSuggestion = function (json) {
  let answer = "I dont have an opinion about that."
  let suggestions = json.toplevel.CompleteSuggestion
  if (suggestions && suggestions.length > 0) {
    let suggestionJson = suggestions[Math.floor(Math.random()*suggestions.length)]
    answer = suggestionJson.suggestion["_attributes"].data
  }
  return answer
}

let fetchXml = function (url) {
  return fetch(url).then(function(response) {
    return response.text()
  })
  .then(function(xml)  {
    return parseXml(xml);
 })
}

let generateUrl = function (query, word) {
  if (query.split(" ").length > 0) {
    query = query.split(" ").join("%20")
  }
  return url = `http://clients1.google.com/complete/search?hl=en&output=toolbar&q=${query}%20${word}%20`
}

let makeRequest = function (query) {
  let words = ['is', 'are', 'can', 'will', 'and']
  let word = words.randomElement();
  let wordTwo = words.randomElement();
  let wordThree = words.randomElement();
  let url = generateUrl(query, word);
  let result = fetchXml(url);
  return result
}

module.exports = {
   new: function(query) {
     return makeRequest(query);
  }
}
