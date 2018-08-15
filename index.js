// Bawt
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "bawt";

client.on("ready", () => {
  console.log("Bawt is ready!");
});

client.on("message", (message) => {
  // messages must start with prefix and ignore all bot messages
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase().trim();
  
  if (command === "sup") {
    message.channel.send("nm");
  }
  else if (command === "avatar") {
    if (!message.mentions.users.size) {
        return message.channel.send(message.author.displayAvatarURL);
    }
    const avatarList = message.mentions.users.map(user => {
        return user.displayAvatarURL;
    });
    message.channel.send(avatarList);
  }
  else if (command === "roll") {
    message.channel.send(message.author.username + " rolled " + Math.floor(Math.random() * (100 - 1) + 1) + " (1-100)")
  }
});

client.login(process.env.TOKEN);