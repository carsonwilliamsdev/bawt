
let Parser = require('rss-parser');
let parser = new Parser();

module.exports = {
   newQuote: function() {
      return  (async () => {
        let user = 'beeyayzah'
        let feed = await parser.parseURL(`http://www.reddit.com/user/${user}/comments/.rss`);
        var item = feed.items[Math.floor(Math.random()*feed.items.length)];
        let quote = item.contentSnippet
        return quote
      })();
   }
}
