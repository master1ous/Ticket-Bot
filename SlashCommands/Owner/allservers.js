 const { Client, MessageEmbed, CommandInteraction, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

 module.exports = {
     name: "allservers",
     description: "🔒",
     run: async (client, interaction, args) => {
       let msg = await interaction.followUp({ content: `Fetching..` })

       if (!client.config.developers.includes(interaction.user.id)) return msg.edit({ content: `🔐 **This command is locked to the "BOT DEVELOPERS" only!**`, ephemeral: true})

       let array = []
       client.guilds.cache.forEach(async(x) => {
           array.push(`${x.name} [${x.memberCount}]`);
           return msg.edit(`${array.join("\n")}`)
       });
     },
 };