var gifFrames = require('gif-frames');
var fs = require('fs');
var asciify = require('asciify-image');

module.exports = {
   new: function() {
     return gifFrames({ url: 'https://i.imgur.com/Xo3pYeB.gif', frames: 'all', quality: 100 })
     .then(function (frameData) {
       let frames = []
       var options = {
         fit:    'box'
       }
       frameData.forEach(function(element, index) {
         let imgPath = `tmp/frame${index}.jpg`
         element.getImage().pipe(fs.createWriteStream(imgPath));
         asciify(imgPath, options).then(function (err, asciified) {
           if (err) throw err;
           // Print to console
           frames.push(asciified);
          })
          .catch(function (err) {
            // Print error to console
            console.error(err);
          });
         });
         return frames
       });
   }
}
