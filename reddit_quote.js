
let Parser = require('rss-parser');
let parser = new Parser();

module.exports = {
   newQuote: function() {
      return  (async () => {
        let user = 'beeyayzah'
        let limit = 10000
        let feed = await parser.parseURL(`http://www.reddit.com/user/${user}/comments/.rss?limit=${limit}`);
        var item = feed.items[Math.floor(Math.random()*feed.items.length)];
        let quote = item.contentSnippet
        return quote
      })();
   }
}
