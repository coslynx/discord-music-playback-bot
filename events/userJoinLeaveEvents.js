const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
            if (!welcomeChannel) return;

            await welcomeChannel.send(`Welcome to the server, ${member}! Enjoy your stay!`);

            logger.info(`User joined: ${member.user.tag}`);
        } catch (error) {
            logger.error(`Error handling user join: ${error}`);
        }
    }
};

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            const leaveChannel = member.guild.channels.cache.find(channel => channel.name === 'goodbye');
            if (!leaveChannel) return;

            await leaveChannel.send(`${member.user.tag} has left the server. Goodbye!`);

            logger.info(`User left: ${member.user.tag}`);
        } catch (error) {
            logger.error(`Error handling user leave: ${error}`);
        }
    }
};