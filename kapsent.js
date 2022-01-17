const { Discord, MessageEmbed, Client } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ayarlar = require("./ayarlar.json");
const userRoles = require("./userRoles.js")
const mongoose = require("mongoose")
const queue = new Map();
const moment = require("moment");
const fs = require("fs");
const db = require("quick.db");
mongoose.connect("")

mongoose.connection.on("open", async => {
console.log("bagladımmongoyu")
})

const log = message => {
  console.log(`${message}`);
};

client.on("message", (message) => {
    if (message.author.bot ||!message.content.startsWith(ayarlar.prefix) || !message.channel || message.channel.type == "dm") return;
    let args = message.content
      .substring(ayarlar.prefix.length)
      .split(" ");
    let command = args[0];
    let bot = message.client;
    args = args.splice(1);
    let beta;
    if (commands.has(command)) {
      beta = commands.get(command);
      beta.execute(bot, message, args);
    } else if (aliases.has(command)) {
      beta = aliases.get(command);
      beta.execute(bot, message, args);
    }
});


fs.readdir("./Events", (err, files) => {
if(err) return console.error(err);
files.filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    if(!prop.configuration) return;
    client.on(prop.configuration.name, prop);
});
});

client.on("presenceUpdate", async (eski, yeni) => {
  const { MessageEmbed } = require("discord.js")
    const kapsent = Object.keys(yeni.user.presence.clientStatus);
    const embed = new MessageEmbed();
    const kanal = client.channels.cache.find((e) => e.id === "932613843643945023");
    const roller = yeni.member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && [8, 4, 2, 16, 32, 268435456, 536870912, 134217728, 128].some((a) => e.permissions.has(a)));
    if (!yeni.user.bot && yeni.guild.id === ayarlar.guildID && [8, 4, 2, 16, 32, 268435456, 536870912, 134217728, 128].some((e) => yeni.member.permissions.has(e)) ) {
      const sunucu = client.guilds.cache.get(ayarlar.guildID);
      if (sunucu.ownerID === yeni.user.id) return;
      if (kapsent.find(e => e === "web")) {
        await userRoles.findOneAndUpdate({ guildID: ayarlar.guildID, userID: yeni.user.id }, { $set: { roles: roller.map((e) => e.id) } }, { upsert: true });
        await yeni.member.roles.remove(roller.map((e) => e.id), "Web girişi koruma.");
        kanal.send(`@everyone Şüpheli İşlem! Tarayıcıdan giriş yapıldı ve rolünü çektim! ${yeni.user.toString()} (Çekilen Rol : ${roller.map((e) => `<@&${e.id}>)`).join("\n")}`)
      } 
    }
    if (!kapsent.find(e => e === "web")) {
      const veri = await userRoles.findOne({ guildID: ayarlar.guildID, userID: yeni.user.id });
      if (!veri) return;
      if (veri.roles || veri.roles.length) {
        await veri.roles.map(e => yeni.member.roles.add(e, "Web den çıkış yaptıgı için rolleri verildi.").then(async () => {
          await userRoles.findOneAndDelete({ guildID: ayarlar.guildID, userID: yeni.user.id });
        }).catch(() => {}));
      }
    }
  });


client.login(ayarlar.token);
