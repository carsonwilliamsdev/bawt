const { TwitchChannel } = require('twitch-channel');

const twitchchannel = new TwitchChannel({
    channel: 'realBAWITDABAW',
    bot_name: 'BAWCITYBAWT', // twitch bot login
    bot_token: process.env.TWITCHCHANNELTOKEN, // create your token here https://twitchapps.com/tmi/
    client_id: process.env.TWITCHCLIENTID, // get it by registering a twitch app https://dev.twitch.tv/dashboard/apps/create (Redirect URI is not used)
    client_secret: process.env.TWITCHSECRET, // secret of your registered twitch app
    //streamlabs_socket_token: '', // get yours here https://streamlabs.com/dashboard#/apisettings in API TOKENS then "your socket API token"
    port: 3100, // the lib will listen to this port
    callback_url: 'http://localhost', // url to your server, accessible from the outside world
    secret: process.env.TWITCHCHANNELSECRET, // any random string
    is_test: true, // set to true to listen to test donations and hosts from streamlabs
  });
  
  twitchchannel.on('debug', msg => console.log(msg));
  twitchchannel.on('info', msg => console.log(msg));
  twitchchannel.on('error', err => console.error(err));
   
  twitchchannel.on('chat', ({ viewerId, viewerName, message }) => { mainChannel.send("FROM TWITCHCHAT | " + viewerName + ": " + message)});
  twitchchannel.on('cheer', ({ viewerId, viewerName, amount, message }) => {});
  twitchchannel.on('sub', ({ viewerId, viewerName, amount, message }) => {});
  twitchchannel.on('resub', ({ viewerId, viewerName, amount, message, months }) => {});
  twitchchannel.on('subgift', ({ viewerId, viewerName, recipientId }) => {});
  twitchchannel.on('host', ({ viewerId, viewerName, viewers }) => {});
  twitchchannel.on('raid', ({ viewerId, viewerName, viewers }) => {});
  twitchchannel.on('follow', ({ viewerId, viewerName }) => {});
  twitchchannel.on('stream-begin', ({ game }) => {
    
  
  });
  twitchchannel.on('stream-change-game', ({ game }) => {});
  twitchchannel.on('stream-end', () => {});
  twitchchannel.on('streamlabs/donation', ({ viewerId, viewerName, amount, currency, message }) => {}); // viewerId provided when found from the donator name
  twitchchannel.connect();