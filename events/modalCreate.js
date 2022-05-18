const { Modal, TextInputComponent, showModal } = require('discord-modals')
const client = require("../index.js")
const { Formatters } = require('discord.js');
const { MessageEmbed } = require("discord.js")
const discordTranscripts = require('discord-html-transcripts');
const db = require(`quick.db`)
client.on('modalSubmit', async (modal) => {
  if(modal.customId === `close-modal`) {
  const logs = db.get(`ticketlogs_${modal.guild.id}`) || null;
    const firstResponse = modal.getTextInputValue('closeText-modal')
    const attachment = await discordTranscripts.createTranscript(modal.channel);
    const opener = db.get(`Ticketopener_${modal.channel.id}`)
                    
        const embed = new MessageEmbed()
        .setColor(client.config.color.purple)
        .setTitle(`<a:Loading:920516789883002880> Deleting the Ticket...`)
        .setDescription(`*The ticket will be deleted in about 5 seconds!*`)
        .setFooter(`Action by ${modal.user.username}\n🔷 On Shard: ${modal.guild.shardId}`, modal.guild.iconURL())

        modal.reply({ embeds: [embed] })
            setTimeout(() => {
                    modal.channel.delete();
                }, 1000 * 4.3);
    
        const tcopener = modal.guild.members.cache.get(opener.id)
        const closed = new MessageEmbed()
    .setTitle(`${client.emoji.manage} | TICKET DELETED`)
          .setColor(`WHITE`)
          .addField(`**TICKET OPENER:**`, `\`\`\`\n${tcopener.user.tag} (${tcopener.user.id})\n\`\`\``)
    .addField(`**DELETED BY:**`, `\`\`\`\n${modal.user.tag} (${modal.user.id})\n\`\`\``)
    .addField(`**DELETE REASON:**`, `${Formatters.codeBlock('markdown', firstResponse) || "`NO REASON ADDED`"}`)
    .setFooter(`TRANSCRIPT IS ATTATCHED TO THE MESSAGE!`)
        

    tcopener.send({ embeds: [closed], files: [attachment]}).catch(() => {});
    client.channels.cache.get(logs.id).send({ embeds: [closed], files: [attachment]})
  }
})