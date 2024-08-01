const { AudioPlayerStatus } = require('@discordjs/voice');
const logger = require('../utils/logger');
const { getUserQueue } = require('./queueManager');

class VolumeControl {
    constructor() {
        this.volume = 1.0; // Default volume level
    }

    setVolume(newVolume, interaction) {
        if (newVolume < 0 || newVolume > 100) {
            logger.error(`Volume level ${newVolume} out of bounds. Must be between 0 and 100.`);
            return false;
        }

        // Normalize volume between 0 and 1
        this.volume = newVolume / 100;

        const player = interaction.client.player;
        if (player) {
            player.setVolume(this.volume); // Set the player's volume
            logger.info(`Volume set to ${newVolume}.`);
            interaction.reply(`Volume set to ${newVolume}.`);
            return true;
        } else {
            logger.error('Audio player not found in interaction client.');
            return false;
        }
    }

    async getVolume(interaction) {
        interaction.reply(`Current volume is set to ${Math.round(this.volume * 100)}.`);
    }

    adjustVolume(interaction, adjustment) {
        const previousVolume = this.volume * 100;

        this.volume += adjustment;
        this.volume = Math.max(0, Math.min(this.volume, 1)); // Clamp between 0 and 1

        const newVolume = Math.round(this.volume * 100);
        const player = interaction.client.player;

        if (player && player.state.status === AudioPlayerStatus.Playing) {
            player.setVolume(this.volume);
            logger.info(`Volume changed from ${previousVolume} to ${newVolume}.`);
            interaction.reply(`Volume adjusted from ${previousVolume} to ${newVolume}.`);
            return true;
        } else {
            logger.error('Audio player not found or not playing.');
            interaction.reply('Audio player is not currently playing.');
            return false;
        }
    }

    async checkAndSetVolume(interaction) {
        const queue = await getUserQueue(interaction.user.id);
        if (queue.length > 0) {
            await this.setVolume(this.volume * 100, interaction);
        }
    }
}

module.exports = new VolumeControl();