const Discord = require('discord.js');


exports.run = function(client, message, args) {
const mesaj = args.slice(0).join(' ')
  if (mesaj < 1){
   message.reply("yazmam için bir şey belirt")
 } else {
   message.delete();
   message.channel.send(mesaj)
 }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['yaz'],
  permLevel: 0
};

exports.help = {
  name: 'Yaz',
  description: 'Bota istediğinizi yazdırır',
  usage: 'Yaz <mesaj>'
};
