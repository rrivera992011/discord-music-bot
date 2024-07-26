# Basic discord music bot using discord.js and discord-player (Work in progress)

After you have cloned the repo make sure to create a `.env` file with the `TOKEN` and `CLIENT_ID` specified for example

```
TOKEN=xxx
CLIENT_ID=xxx
```

# Commands

- Play
  - Song {url}       - Plays the song from the youtube url
  - Search {keyword} - Searches for the keyword on youtube and plays the first result
  - Playlist {url}   - Plays the playlist from url

- Skip   - Skips the current song
- Queue  - Displays the first 10 songs in the queue
- Pause  - Pauses the current song
- Resume - Resumes playing the current song
- Exit   - Kicks the bot from the voice channel