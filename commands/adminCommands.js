const { CommandInteraction } = require('discord.js');
const { validate } = require('class-validator');
const { Permissions } = require('discord.js');
const logger = require('../utils/logger');
const { setUserPermissions, getUserPermissions } = require('../middlewares/permissionsHandler');

class AdminCommands {
    constructor(client) {
        this.client = client;
    }

    async executeCommand(interaction) {
        try {
            const adminCommand = interaction.commandName;

            switch (adminCommand) {
                case 'set-permissions':
                    await this.setPermissions(interaction);
                    break;
                case 'get-permissions':
                    await this.getPermissions(interaction);
                    break;
                default:
                    await interaction.reply('Unknown command');
            }

        } catch (error) {
            logger.error('Error executing admin command: ', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    }

    async setPermissions(interaction) {
        const { options } = interaction;
        const userId = options.getUser('user').id;
        const permissionValue = options.getString('permission');

        const validationErrors = await validate(setUserPermissions);
        if (validationErrors.length > 0) {
            return interaction.reply('Invalid input detected. Please ensure valid values.');
        }

        const success = await setUserPermissions(userId, permissionValue);

        if (success) {
            await interaction.reply(`Permission for <@${userId}> has been set to ${permissionValue}.`);
        } else {
            await interaction.reply(`Failed to set permissions for <@${userId}>.`);
        }
    }

    async getPermissions(interaction) {
        const { options } = interaction;
        const userId = options.getUser('user').id;

        const permissions = await getUserPermissions(userId);
        
        if (permissions) {
            await interaction.reply(`Permissions for <@${userId}>: ${permissions}`);
        } else {
            await interaction.reply(`No permissions found for <@${userId}>.`);
        }
    }
}

module.exports = {
    AdminCommands
};