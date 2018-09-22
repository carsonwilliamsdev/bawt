var asciify = require('asciify-image');

var options = {
  fit:    'box',
  width:  30,
  height: 30,
  color: false
}

module.exports = {
   new: function(filename) {
     return asciify(filename, options)
       .then(function (asciified) {
         return asciified;
       })
       .catch(function (err) {
         return err
       });
   }
}
