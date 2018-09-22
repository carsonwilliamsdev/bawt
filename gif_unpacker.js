var gifFrames = require('gif-frames');
var fs = require('fs');

module.exports = {
   new: function() {
     gifFrames({ url: 'https://i.imgur.com/pSjmN36.gif',
         frames: 'all',
         outputType: 'png' })
     .then(function (frameData) {
       frameData.forEach(function(element, index) {
         let imgPath = `./tmp/frame${index}.png`
         element.getImage().pipe(fs.createWriteStream(imgPath))
       })
     });
   }
}
