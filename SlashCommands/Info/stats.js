const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: "stats",
    description: "View the bot's stats!",
    cooldown: 5,
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {


      interaction.followUp({ content: `I'm currently managing **${client.guilds.cache.size}** guilds, watching **${client.users.cache.size}** members & I'm currently on shard ** ${interaction.guild.shardId}**` })
    }
}