const Discord = require('discord.js');



exports.run = async (client, message) => {
    let dönme = await message.channel.send({
        embed: {
            color: 0x00AE86,
            description: `${message.author.tag} bir stres çarkı çevirdi!`,
            image: {
                url: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjn3MWY-MHlAhWJ16QKHUmnDE8QjRx6BAgBEAQ&url=http%3A%2F%2Fstrescarki.biz%2Fisikli-stres-carki-turkuaz&psig=AOvVaw0j02FTpnHZel_Pc75whwhN&ust=1572454648024216"
            }
        }
    });

    let bitiş = (Math.random() * (60 - 5 +1)) + 5;
    setTimeout(() => {
        dönme.edit({
            embed: {
                color: 0x00AE86,
                description: `${message.author.tag}, stres çarkın ${bitiş.toFixed(2)} saniye döndü.`
            }
        });
    }, 5 * 1000);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['Stresçarkı',' Stresçarkı' ,'strasçarkı',' stresçarkı'],
  permLevel: 0
};

exports.help = {
  name: 'stresçarkı',
  description: 'Sizin için bir stres çarkı çevirir.',
  usage: 'stresçarkı'
};
