const { MessageEmbed } = require("discord.js")
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  Permissions
} = require(`discord.js`);
const { Modal, TextInputComponent, showModal } = require('discord-modals')
const client = require("../index.js")
const discordTranscripts = require('discord-html-transcripts');
const colors = require("colors")
const db = require('quick.db')
const s = `6`;
client.on("interactionCreate", async (interaction) => {

  const role = db.get(`adminrole_${interaction.guild.id}${s}`);
  const cat = db.get(`category_${interaction.guild.id}${s}`) || null;
  const logs = db.get(`ticketlogs_${interaction.guild.id}`) || null;
  const message = db.get(`ticketmsg_${interaction.guild.id}${s}`) || null;

if(!interaction.isButton() && !interaction.isSelectMenu()) return;
      const wait = require('util').promisify(setTimeout);

      if(interaction.customId == `create_ticket${s}`) {
          const tcname = db.fetch(`ticketname_${interaction.guild.id}`)
                       .replace(/{user}/g, interaction.user.username)
                       
        console.log("Ticket Creation - GUILD: "+interaction.guild.name+" | OPENER: "+interaction.user.tag+"".green.dim)
        if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: `${client.emoji.wrong} **I couldnt Create the ticket!**\n> *Make sure that i have the \`MANAGE_CHANNELS\` permission!*`, ephemeral: true })
        var nameer = `${tcname || `ticket-${interaction.user.username}`}`
                var checkTickets = interaction.guild.channels.cache.find(c => c.name == nameer.split(' ').join('-').toLocaleLowerCase());
                if (checkTickets) {
                  const embed = new MessageEmbed()
        .setColor(client.config.color.purple)
        .setTitle(`${client.emoji.wrong} You already have a Ticket Opened!`)
        .setDescription(`***You already have a open ticket in ${checkTickets}! Please close it first!***`)
        .setFooter(`Ticketing by Azury.live`, interaction.guild.iconURL())
                   return interaction.reply({ embeds: [embed], ephemeral: true})
                 } 
                const reasons = new MessageActionRow()
        .addComponents([
          new MessageButton()
          .setLabel(`View Possible Reasons`)
          .setStyle(`PRIMARY`)
          .setCustomId(`error_reasons`)
          
        ])
         await interaction.reply({ content: `<a:Loading:920516789883002880> **Creating your ticket (This could take a few seconds)...**`, ephemeral: true })
        interaction.guild.channels.create(`${tcname || `ticket-${interaction.user.username}`}`, {
                    permissionOverwrites: [{
                            id: interaction.user.id,
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        },
                        {
                            id: require('quick.db').fetch(`adminrole_${interaction.guild.id}${s}`),
                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                        }, {
                            id: interaction.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ],
                    type: 'text',
                    parent: cat,
                    topic: `📨 Ticket for: ${interaction.user.tag} (${interaction.user.id})`
                }).catch(() => {
          interaction.editReply({ content: `${client.emoji.wrong} **An Error Occured While Creating Your Ticket!**\n> *ErrCode: \`hHa_8\`*`, components: [reasons], ephemeral: true })
                }).then(async function(channel) {
                  db.set(`Ticketopener_${channel.id}`, interaction.user);
                await wait(1000)
                await interaction.editReply({ content: `${client.emoji.correct} **Successfuly Created your ticket in ${channel}**`, ephemeral: true })
                  
        const embed = new MessageEmbed()
        .setColor(client.config.color.yellow)
        .setAuthor(`Ticket for: ${interaction.user.tag}`, interaction.user.displayAvatarURL(), `https://discord.gg/azury`)
        .setDescription(`${message || `**Thanks for opening a ticket, please tell us what you need!**`}`)
        .setThumbnail(interaction.guild.iconURL())
        const embed2 = new MessageEmbed()
        .setColor(client.config.color.main)
        .setAuthor(`A staff member will claim this ticket soon!`, `https://cdn.discordapp.com/emojis/833101350623117342.gif?size=512`)
        .setDescription(`> *Please wait for one of the users with <@&${role}> to claim!*`)
        .setFooter(`🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())

        const buttons = new MessageActionRow()
        .addComponents([,
          new MessageButton()
          .setStyle(`PRIMARY`)
          .setEmoji(`📝`)
          .setLabel(`Transcript this Ticket`)
          .setCustomId(`transcript_ticket${s}`),
          new MessageButton()
          .setStyle(`LINK`)
          .setEmoji(`🔶`)
          .setLabel(`Report a Ticket-Bug`)
          .setURL(`https://discord.gg/azury`)
        ])
          const row = new MessageActionRow()
          .addComponents([
            new MessageSelectMenu()
			      .setCustomId('tck_options')
			      .setPlaceholder('Manage this User\'s ticket')
			      .addOptions([
              { label: `Delete Ticket`, description: `Delete the ticket if user is done with support!`, value: `delete_ticket${s}`, emoji: `🗑️`},
              { label: `Lock Ticket`, description: `Remove/lock the user from the ticket!`, value: `close_ticket${s}`, emoji: `🔒`},
              { label: `Pin Ticket`, description: `Delete the ticket if user is done with support!`, value: `pin_ticket${s}`, emoji: `📌`},
              { label: `Claim Ticket`, description: `Claim this ticket if you are a staff member!`, value: `claim_ticket${s}`, emoji: `✅` },
              
            ]),
          ])


        channel.send({ content: `**${interaction.user}** | **<@&${role}>**`, embeds: [embed, embed2], components: [buttons, row] }).then(msg => {
              msg.pin();
                    })
                    });
                    } else if(interaction.values == `close_ticket${s}`) {
       
        const norole = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} You need the Admin Role to Manage this ticket!`)
        .setDescription(`***You need <@&${role}> to close this ticket!***`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())
                      if(!interaction.member.roles.cache.has(role)) {
                        return interaction.reply({ embeds: [norole], ephemeral: true})
                      }
        const opener = db.get(`Ticketopener_${interaction.channel.id}`)
       
       const tcopener = interaction.guild.members.cache.get(opener.id);  interaction.channel.permissionOverwrites.edit(require('quick.db').fetch(`adminrole_${interaction.guild.id}${s}`), {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
        })
        interaction.channel.permissionOverwrites.edit(opener.id, {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: false,
        })
        await interaction.deferUpdate({ ephemeral: false }).catch(() => {});
        
        const embed = new MessageEmbed()
        .setColor(client.config.color.success)
        .setTitle(`${client.emoji.correct} Locked the ticket!`)
        .setDescription(`**I have locked the ticket and removed <@${require(`quick.db`).fetch(`Ticketopener_${interaction.channel.id}`).id}> from it!**\n*They can no-longer see the ticket!*`)
        .setFooter(`🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())

        interaction.channel.send({ embeds: [embed] })

        tcopener.send({ content: `${client.emoji.manage} **Your ticket was Locked by \`${interaction.user.tag}\`** ${client.emoji.manage}`})

      }  else if (interaction.values == `pin_ticket${s}`) {
        const opener = db.get(`Ticketopener_${interaction.channel.id}`)
                      const tcname = db.fetch(`ticketname_${interaction.guild.id}`)
                       .replace(/{user}/g, opener.username)
        const pinned = db.get(`pinned_${interaction.channel.id}`);
        const norole = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} You need the Admin Role to Manage this ticket!`)
        .setDescription(`***You need <@&${role}> to pin this ticket!***`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())
                      if(!interaction.member.roles.cache.has(role)) {
                        return interaction.reply({ embeds: [norole], ephemeral: true})
                      }
         const alreadypinned = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} Ticket has already been pinned!`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())

        if(pinned) return interaction.reply({ embeds: [alreadypinned], ephemeral: true})
        
        interaction.channel.setName(`📌・${tcname || `ticket-${opener.username}`}`)
        const embed = new MessageEmbed()
        .setColor(client.config.color.success)
        .setTitle(`📌 Pinned the Ticket!`)
        .setDescription(`> ***${interaction.user} has pinned this ticket!***`)
        .setFooter(`🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())
        db.set(`pinned_${interaction.channel.id}`, "pinned")
        interaction.channel.send({ embeds: [embed] })
        await interaction.deferUpdate({ ephemeral: false }).catch(() => {});
      } else if(interaction.values == `delete_ticket${s}`) {
         const norole = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} You need the Admin Role to Manage this ticket!`)
        .setDescription(`***You need <@&${role}> to delete this ticket!***`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())
                      if(!interaction.member.roles.cache.has(role)) {
                        return interaction.reply({ embeds: [norole], ephemeral: true})
                      }
        const modal = new Modal() // We create a Modal
.setCustomId(`close-modal`)
.setTitle(`Close: ${interaction.channel.name}`)
.addComponents([
  new TextInputComponent() // We create a Text Input Component
  .setCustomId('closeText-modal')
  .setLabel('What is the reason of closing this ticket?')
  .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
  .setMinLength(1)
  .setMaxLength(40)
  .setPlaceholder('Type your Reason here')
  .setRequired(false) // If it's required or not
]);
      
    showModal(modal, {
      client: client, // Client to show the Modal through the Discord API.
      interaction: interaction // Show the modal with interaction data.
    })
        
        
                   
        
      } else if(interaction.customId == `transcript_ticket${s}`) {
        const attachment = await discordTranscripts.createTranscript(interaction.channel);
        

        interaction.reply({ content: `**${client.emoji.correct} Transcript of: \`${interaction.channel.name}\`**`, files: [attachment] , ephemeral: true})
      } else if (interaction.values == `claim_ticket${s}`) {
        const claimed = db.get(`claimed_${interaction.channel.id}`);
        const user = db.get(`Ticketopener_${interaction.channel.id}`);
        
        const norole = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} You need the Admin Role to Manage this ticket!`)
        .setDescription(`***You need <@&${role}> to claim this ticket!***`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())

        const rolebutuser = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} You cant claim your Ticket!`)
        .setDescription(`***You have <@&${role}> but you opened this ticket!***`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())

        const alreadyclaimed = new MessageEmbed()
        .setColor(client.config.color.red)
        .setTitle(`${client.emoji.wrong} Ticket has already been claimed by another user!`)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())
        
        if(!interaction.member.roles.cache.has(role)) {
                        return interaction.reply({ embeds: [norole], ephemeral: true})
                      }
        if(claimed) return interaction.reply({ embeds: [alreadyclaimed], ephemeral: true})
        if(user.id == interaction.user.id) return interaction.reply({ embeds: [rolebutuser], ephemeral: true})
        const embed = new MessageEmbed()
        .setAuthor(`${interaction.user.username} Claimed this ticket!`, interaction.user.displayAvatarURL())
        .setColor(client.config.color.main)
        .setFooter(`Ticketing by Azury.live\n🔷 On Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())

        const embed2 = new MessageEmbed()
        .setColor(client.config.color.main)
        .setAuthor(`${interaction.user.tag} ⚡ Staff Member`, interaction.user.displayAvatarURL(), `https://discord.gg/azury`)
        .setDescription(`> _**${interaction.user.username}** has claimed this ticket!_`)
        .setFooter(`🔷 On Shard: ${interaction.guild.shardId}`)

        db.set(`claimed_${interaction.channel.id}`, "claimed")
        interaction.message.edit({ embeds: [interaction.message.embeds[0], embed2]})
        interaction.reply({ embeds: [embed] })
      } 


})
