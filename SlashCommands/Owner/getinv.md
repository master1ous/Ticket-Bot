const { Client, MessageEmbed, CommandInteraction, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "getinv",
    description: "Finds a guild invite, verifying its valid",
    options: [
      {
        name: "guild",
        description: "guild_id",
        type: "STRING",
        required: true,
      }
    ], 
    run: async (client, interaction, args) => {
      let gti_id = interaction.options.getString('guild');
      let msg = await interaction.followUp({ content: `Fetching..` })

      if (!client.config.developers.includes(interaction.user.id)) return msg.edit({ content: `🔐 **This command is locked to the "BOT DEVELOPERS" only!**`, ephemeral: true})

      let x = client.guilds.cache.get(gti_id)
      if(!x) return msg.edit(`🤔 **GUILD not found**, its possible I'm not in that server!`)

      client.guilds.cache.forEach(async(z) => {
        if(z.id != gti_id) return
        z.channels.cache.last().createInvite().then(async(v) => {
          return msg.edit(`${x.name} • ${v.url}`)
        }).catch((e)=>console.log(e))
      });
    },
};