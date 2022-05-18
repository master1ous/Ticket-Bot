const client = require("../index");
const { MessageEmbed } = require('discord.js')

client.on('messageCreate', async(message) => {

  if(message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`){
    return message.reply(`**:wave: Hello __${message.author.username}__, I have migrated to all *\`/\`* commands!**\n ↳  *Use \`/help\` to view all my commands!*`)
  }

})