const gifUnpacker = require ('./gif_unpacker')
const asciiGenerator = require ('./ascii_generator')
var fs = require('fs');

let getFiles = function () {

}

module.exports = {
   initialize: function() {
     setTimeout(function() {
       gifUnpacker.new()
     }, 1000)},
   new: function () {
     let promiseArray = []
     let files = fs.readdirSync('./tmp/');
     let gifArray = []
     files.forEach(function (file) {
       promiseArray.push(asciiGenerator.new(`tmp/${file}`).then(function (ascii) {
         gifArray.push(ascii);
       }))
     })
     return Promise.all(promiseArray).then(function () {
       return gifArray;
     })
   }
}
