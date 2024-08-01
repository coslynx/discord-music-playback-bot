const { CommandInteraction } = require('discord.js');
const logger = require('./logger');
const { AudioCommands } = require('../commands/audioCommands');
const { PlaylistCommands } = require('../commands/playlistCommands');
const { UserCommands } = require('../commands/userCommands');
const { AdminCommands } = require('../commands/adminCommands');

class CommandParser {
    constructor(client) {
        this.client = client;
        this.audioCommands = new AudioCommands(client);
        this.playlistCommands = new PlaylistCommands(client);
        this.userCommands = new UserCommands(client);
        this.adminCommands = new AdminCommands(client);
    }

    async parseCommand(interaction) {
        if (!interaction.isCommand()) return;

        try {
            switch (interaction.commandName) {
                case 'play':
                case 'pause':
                case 'resume':
                case 'stop':
                case 'skip':
                case 'volume':
                case 'queue':
                case 'clear':
                    await this.audioCommands.executeCommand(interaction);
                    break;

                case 'create':
                case 'add':
                case 'remove':
                case 'clear':
                case 'view':
                    await this.playlistCommands.executeCommand(interaction);
                    break;

                case 'play':
                case 'skip':
                case 'stop':
                case 'queue':
                    await this.userCommands.executeCommand(interaction);
                    break;

                case 'set-permissions':
                case 'get-permissions':
                    await this.adminCommands.executeCommand(interaction);
                    break;

                default:
                    await interaction.reply('Unknown command.');
                    break;
            }
        } catch (error) {
            logger.error(`Error processing command: ${error.message}`);
            await interaction.reply('An error occurred while processing your command.');
        }
    }
}

module.exports = new CommandParser();