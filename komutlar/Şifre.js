const Discord = require('discord.js');
const generator = require('generate-password');


exports.run = function(client, message, args) {
    var uzunluk = args.slice(0).join(' ');

    if (!uzunluk) return message.reply('Bir uzunluk belirt. **Doğru Kullanım**: ?şifre <uzunluk>')



    var password = generator.generate({
        length: uzunluk,
        numbers: true,
    })

    message.channel.send(password);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['Şifre',' Şifre','şifre',' şifre'],
  permLevel: 0
};

exports.help = {
  name: 'Şifre',
  description: 'Rastgele bir şifre oluşturur.',
  usage: 'Şifre <uzunluk>'
};
