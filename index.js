// Bawt
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Bawt is ready!");
});

client.on("message", (message) => {
  if (message.content.startsWith("Bawt")) {
    message.channel.send("keep my name outcha mouf");
  }
});

client.login(process.env.TOKEN);