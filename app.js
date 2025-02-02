const Discord = require('discord.js');
const client  = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk   = require('chalk');
const fs      = require('fs');
const moment  = require('moment');
const db      = require("quick.db");
const ms      = require("parse-ms");
const request = require("request")

require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
//Seviye Sistemi//////////////////////////////////////////////////////////////////////
client.on("message", async message => {
if(message.content.startsWith(prefix)) return;
if(message.author.bot) return;
var id = message.author.id;
var gid = message.guild.id;
var xp = await db.fetch(`xp_${id}_${gid}`);
var lvl = await db.fetch(`lvl_${id}_${gid}`);
var xpToLvl = await db.fetch(`xpToLvl_${id}_${gid}`);
if(!lvl) {
db.set(`xp_${id}_${gid}`, 5);
db.set(`lvl_${id}_${gid}`, 1);
db.set(`xpToLvl_${id}_${gid}`, 100);
} else {
var random = Math.random() * (8 - 3) + 3;
db.add(`xp_${id}_${gid}`, random.toFixed());
console.log(xp);
if(xp > xpToLvl) {
db.add(`lvl_${id}_${gid}`, 1);
db.add(`xpToLvl_${id}_${gid}`, await db.fetch(`lvl_${id}_${gid}`) * 100);
var lvl = await db.fetch(`lvl_${id}_${gid}`);
message.channel.send("Tebrikler, " + message.author + ". Seviye atladın! Yeni seviyen: **" + lvl + "**");
var role = message.guild.roles.get(await db.fetch(`role_${gid}_${lvl}seviye`));
if(!role) return;
else {
message.member.addRole(role);
message.channel.send("Tebrikler! **" + lvl + "** seviye olarak @" + role.name + " rolünü kazandınız.");
}}}});;
///////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("guildMemberAdd", member => {
var channel = member.guild.channels.find("name", "giriş-çıkış");
if (!channel) return;
var role = member.guild.roles.find("name", "üye");
if (!role) return;
member.addRole(role);
channel.send(member + " artık " + role + " rolü ile aramızda");
member.send("Aramıza hoş geldin! Artık @üye rolüne sahipsin!")
});
//////////////////////////////////////////Küfür Filtresi////////////////////////////////////////
client.on("message", message => {
  if(!message.guild) return;
  if(message.author.bot) return;
  request.get("https://pinkie-api.glitch.me/api/kufur", (err, res, body) => { //Barış Demirci tarafından hazırlanmıştır xd
    const json = JSON.parse(body);
    const contains = json.filter(word => {
      const wordExp = new RegExp("(\\b)+(" + word + ")+(\\b)", "gui");
      return (wordExp.test(message.content));
    }).length > 0 || false;
    if(contains) {
      message.delete();
      request.get("https://pinkie-api.glitch.me/api/kufurCevap", (err, res, body) => { //API Barış Demirciye aittir
        const cevaplar = JSON.parse(body);
        var rand = cevaplar[Math.floor(Math.random() * cevaplar.length)];
        var cevap = rand.replace("%member%", message.author);
        message.channel.send(cevap);
      });
    }
  });
});
///////////////////////////////////////////////Geçici Kanal/////////////////////////////////////
client.on("voiceStateUpdate", async (oldChannel, newChannel) => {

  const categoryID = "642721446199689216";
  if (!oldChannel.guild.channels.get(categoryID)) return console.log("kategori bulunamadı");
  const channelID = "642721493192671284";
  if (!oldChannel.guild.channels.get(channelID)) return console.log("kanal bulunamadı.");
  if (oldChannel.user.bot) return;
  if (newChannel.user.bot) return;

  if (newChannel.voiceChannelID === channelID) {
    newChannel.guild.createChannel("geçici-" + newChannel.user.username, "voice").then(newVoiceChannel => {
      newVoiceChannel.overwritePermissions(newChannel.user, {
        CONNECT: true,
        SPEAK: true,
        MOVE_MEMBERS: true,
        VIEW_CHANNEL: true,
        USE_VAD: true,
        PRIORITY_SPEAKER: true
      })
      newVoiceChannel.setParent(newChannel.guild.channels.get(categoryID))
      newChannel.setVoiceChannel(newChannel.guild.channels.get(newVoiceChannel.id));
    })
  }

  if (oldChannel.voiceChannelID) {

    oldChannel.guild.channels.forEach(allChannels => {

      if (allChannels.parentID === categoryID) {

        if (allChannels.id === channelID) return;

        if (oldChannel.voiceChannelID === allChannels.id) {

          if (oldChannel.voiceChannel.members.size == 0) allChannels.delete();

        }

      }

    })

  }


})



















client.login(ayarlar.token);
