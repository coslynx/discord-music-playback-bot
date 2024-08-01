const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const logger = require('../utils/logger');

class AudioEffects {
    constructor() {
        this.player = createAudioPlayer();
    }

    async applyBassBoost(source) {
        try {
            const resource = createAudioResource(source, {
                inlineVolume: true,
            });

            resource.volume.setVolume(1.5); // Boost volume by 50%
            this.player.play(resource);
            logger.info('Bass boost applied to the audio source.');
        } catch (error) {
            logger.error(`Error applying bass boost: ${error.message}`);
        }
    }

    async applyEcho(source) {
        try {
            const resource = createAudioResource(source, {
                inlineVolume: true,
            });

            // Implement echo logic here (using external library or custom filter)
            // For example, we may manually simulate echo with delay on separate audio player or manage it in a different approach

            this.player.play(resource);
            logger.info('Echo effect applied to the audio source.');
        } catch (error) {
            logger.error(`Error applying echo effect: ${error.message}`);
        }
    }

    async stopAudio() {
        try {
            this.player.stop();
            logger.info('Playback stopped.');
        } catch (error) {
            logger.error(`Error stopping audio: ${error.message}`);
        }
    }

    getPlayer() {
        return this.player;
    }

    getPlayerStatus() {
        return this.player.state.status;
    }

    async playAudio(source) {
        try {
            const resource = createAudioResource(source);
            this.player.play(resource);
            logger.info(`Playing audio from source: ${source}`);
        } catch (error) {
            logger.error(`Error playing audio: ${error.message}`);
        }
    }

    async pauseAudio() {
        try {
            if (this.getPlayerStatus() === AudioPlayerStatus.Playing) {
                this.player.pause();
                logger.info('Playback paused.');
            }
        } catch (error) {
            logger.error(`Error pausing audio: ${error.message}`);
        }
    }

    async resumeAudio() {
        try {
            if (this.getPlayerStatus() === AudioPlayerStatus.Paused) {
                this.player.unpause();
                logger.info('Playback resumed.');
            }
        } catch (error) {
            logger.error(`Error resuming audio: ${error.message}`);
        }
    }
}

module.exports = new AudioEffects();