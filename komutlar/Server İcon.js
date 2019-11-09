const Discord = require('discord.js');


exports.run = function(client, message) {

    const embed = new Discord.RichEmbed()
        .setDescription("**SUNUCU ICONU**")
        .setImage(message.guild.iconURL)

    message.channel.send(embed);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['Servericon'],
  permLevel: 0
};

exports.help = {
  name: 'Servericon',
  description: 'Serverin iconunu gösterir',
  usage: 'Servericon'
};
