<h1 align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
  <br>Discord Music Playback Bot
</h1>
<h4 align="center">A feature-rich bot for seamless music playback on Discord servers.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<p align="center">
	<img src="https://img.shields.io/badge/Framework-Node.js-blue" alt="">
	<img src="https://img.shields.io/badge/Backend-JavaScript-red" alt="">
	<img src="https://img.shields.io/badge/Database-MongoDB-green" alt="">
	<img src="https://img.shields.io/badge/Audio Processing-FFmpeg-yellow" alt="">
</p>
<p align="center">
	<img src="https://img.shields.io/github/last-commit/spectra-ai-codegen/discord-music-playback-bot?style=flat-square&color=5D6D7E" alt="git-last-commit" />
	<img src="https://img.shields.io/github/commit-activity/m/spectra-ai-codegen/discord-music-playback-bot?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
	<img src="https://img.shields.io/github/languages/top/spectra-ai-codegen/discord-music-playback-bot?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</p>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📜 API Documentation
- 📄 License
- 👏 Authors

## 📍 Overview
The **Discord Music Playback Bot** is designed to enhance the social and entertainment experiences of users on Discord by providing a seamless music playback system. This bot supports various music sources through integration with popular APIs and encourages user interaction via shared musical experiences.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 🎶 | **Music Playback**  | Play, pause, resume, and stop music from services like YouTube, Spotify, and SoundCloud directly in Discord.      |
| 📜 | **Playlist Management** | Users can create, edit, and manage song queues tailored to their preference, fostering collaborative experiences.   |
| 🔍 | **Search Functionality** | Easily find songs using simple text commands; integrates with third-party APIs for accurate results.             |
| 🔊 | **Volume Control**  | Users can adjust volume levels according to their preferences for a personalized audio experience.                |
| 🎛️ | **Audio Effects**   | Apply audio effects such as bass boost and echo for customized sound quality.                                   |
| ⚙️ | **Robust Command System** | An intuitive command system enables easy interaction, with help commands for guidance.                      |
| 🔒 | **Permissions Management** | Ensure server order and security by regulating access to various commands based on user roles.               |
| 🔄 | **Cross-Server Functionality** | Retain user preferences across different Discord servers, promoting community sharing.                          |
| 🎉 | **User Engagement Features** | Add music-based games, quizzes, or voting systems for song selections to deepen user interaction.                |

## 📂 Structure
```plaintext
project-root
├─ commands
│   ├─ audioCommands.js
│   ├─ playlistCommands.js
│   ├─ userCommands.js
│   └─ adminCommands.js
├─ events
│   ├─ messageHandler.js
│   ├─ musicPlayerEvents.js
│   └─ userJoinLeaveEvents.js
├─ music
│   ├─ audioPlayer.js
│   ├─ volumeControl.js
│   ├─ audioEffects.js
│   └─ queueManager.js
├─ services
│   ├─ discordService.js
│   ├─ youtubeService.js
│   ├─ spotifyService.js
│   └─ soundcloudService.js
├─ models
│   ├─ userModel.js
│   ├─ playlistModel.js
│   └─ songModel.js
├─ middlewares
│   ├─ errorHandler.js
│   ├─ permissionsHandler.js
│   └─ rateLimiter.js
├─ utils
│   ├─ config.js
│   ├─ logger.js
│   └─ commandParser.js
├─ database
│   └─ mongoConnection.js
├─ .env
├─ .gitignore
├─ package.json
└─ README.md
```

## 💻 Installation
### 🔧 Prerequisites
- Node.js
- npm
- Docker

### 🚀 Setup Instructions
1. Clone the repository:
   - `git clone https://github.com/spectra-ai-codegen/discord-music-playback-bot.git`
2. Navigate to the project directory:
   - `cd discord-music-playback-bot`
3. Install dependencies:
   - `npm install`

## 🏗️ Usage
### 🏃‍♂️ Running the Bot
1. Start the bot:
   - `node index.js`
2. Follow the bot's setup instructions to invite it to your server.

### ⚙️ Configuration
Adjust configuration settings in `config.js` or the `.env` file as needed.

## 🌐 API Documentation
### 🔍 Endpoints
- **GET /api/play**: To play a song in the voice channel.
- **POST /api/playlist**: To create or update a user's playlist.

### 🔒 Authentication
Utilizes OAuth for user authentication and session management via Discord.

## 📜 License
This project is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/).

## 👥 Authors
- **Drix10** - [GitHub Profile](https://github.com/Drix10)

<p align="center">
    <h1 align="center">🌐 Spectra.Codes</h1>
</p>
<p align="center">
    <em>Why only generate Code? When you can generate the whole Repository!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Developer-Drix10-red" alt="">
	<img src="https://img.shields.io/badge/Website-Spectra.codes-blue" alt="">
	<img src="https://img.shields.io/badge/Backed_by-Google_&_Microsoft_for_Startups-red" alt="">
	<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4-black" alt="">
<p>