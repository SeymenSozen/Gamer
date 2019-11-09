const Discord = require('discord.js');


exports.run = function(client, message) {

    message.channel.send("Pingim " + client.ping + "ms");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['Ping',' Ping',],
  permLevel: 0
};

exports.help = {
  name: 'Ping',
  description: 'Botun pingini gösterir',
  usage: 'Ping'
};
