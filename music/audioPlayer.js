const { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { getUserQueue } = require('./queueManager');
const logger = require('../utils/logger');
const { messageHandler } = require('../events/messageHandler');

class AudioPlayerManager {
    constructor(client) {
        this.client = client;
        this.audioPlayer = createAudioPlayer();
        this.connection = null;

        this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
            logger.info('Audio Player is now playing.');
        });

        this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            logger.info('Audio Player is idle. Attempting to play next song.');
            this.playNextSong();
        });

        this.audioPlayer.on('error', (error) => {
            logger.error(`Audio player error: ${error.message}`);
        });
    }

    async joinVoiceChannel(interaction) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        this.connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        this.connection.on(VoiceConnectionStatus.Ready, () => {
            logger.info('The bot has connected to the channel!');
        });

        this.connection.on(VoiceConnectionStatus.Disconnected, () => {
            logger.info('The bot has disconnected from the channel.');
        });

        return interaction.reply('Joined the voice channel!');
    }

    async playSong(interaction, songUrl) {
        try {
            const resource = createAudioResource(songUrl, { inlineVolume: true });
            this.audioPlayer.play(resource);
            this.connection.subscribe(this.audioPlayer);
            logger.info(`Playing song: ${songUrl}`);
            return true;
        } catch (error) {
            logger.error(`Error playing song: ${error.message}`);
            return false;
        }
    }

    async pauseSong(interaction) {
        try {
            if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
                this.audioPlayer.pause();
                logger.info('Playback paused.');
                return true;
            }
            logger.warn('No song is currently playing to pause.');
            return false;
        } catch (error) {
            logger.error(`Error pausing song: ${error.message}`);
            return false;
        }
    }

    async resumeSong(interaction) {
        try {
            if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
                this.audioPlayer.unpause();
                logger.info('Playback resumed.');
                return true;
            }
            logger.warn('No song is currently paused to resume.');
            return false;
        } catch (error) {
            logger.error(`Error resuming song: ${error.message}`);
            return false;
        }
    }

    async stopSong(interaction) {
        try {
            this.audioPlayer.stop();
            this.connection.destroy();
            logger.info('Playback stopped and connection closed.');
            return true;
        } catch (error) {
            logger.error(`Error stopping song: ${error.message}`);
            return false;
        }
    }

    async skipSong(interaction) {
        try {
            const queue = await getUserQueue(interaction.user.id);
            if (queue.length > 0) {
                await this.playSong(interaction, queue[0]);
                logger.info('Skipped to the next song in the queue.');
                return true;
            }
            logger.warn('No song to skip to.');
            return false;
        } catch (error) {
            logger.error(`Error skipping song: ${error.message}`);
            return false;
        }
    }

    async playNextSong() {
        try {
            const queue = await getUserQueue(this.controllerUser.id);
            if (queue.length > 0) {
                const nextSongUrl = queue.shift();
                await this.playSong(nextSongUrl);
                logger.info(`Now playing next song: ${nextSongUrl}`);
            } else {
                logger.info('Queue is empty, nothing to play.');
            }
        } catch (error) {
            logger.error(`Error playing next song: ${error.message}`);
        }
    }
}

module.exports = {
    AudioPlayerManager,
};