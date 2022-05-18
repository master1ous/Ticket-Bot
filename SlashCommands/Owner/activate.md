// const { Client, MessageEmbed, CommandInteraction, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
// const model = require("../../models/active")

// module.exports = {
//     name: "activate",
//     description: "Activate",
//     options: [
//       {
//         name: "guild",
//         description: "guild_id",
//         type: "STRING",
//         required: true,
//       }
//     ], 
//     run: async (client, interaction, args) => {
//       let gti_id = interaction.options.getString('guild');
//       let msg = await interaction.followUp({ content: `Fetching..` })

//       if (!client.config.developers.includes(interaction.user.id)) return msg.edit({ content: `🔐 **This command is locked to the "BOT DEVELOPERS" only!**`, ephemeral: true})

//       let x = client.guilds.cache.get(gti_id)
//       if(!x) return msg.edit(`🔐 **GUILD not found**, I'm most likely not in that server!`)
      
//       model.findOne({ Guild: x.id }, async(err, data) => {
//         if(data) return msg.edit(`🎓 **${x.name}** is already saved within the database`)

//         new model({
//           Guild: x.id,
//           Mod: interaction.user.id,
//         }).save()
//         return msg.edit(`🎓 **${x.name}** is now listed within our database`)
//       })
//     },
// };