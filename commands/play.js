const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song.")
                .addStringOption(option => option.setName("searchterms").setDescription("Search keywords").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YouTube")
                .addStringOption(option => option.setName("url").setDescription("Playlist url").setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("song")
                .setDescription("Plays song from YouTube")
                .addStringOption(option => option.setName("url").setDescription("Song url").setRequired(true)
                )
        ),
    execute: async ({client, interaction}) => {
        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel) {
            await interaction.reply("You must be in a voice channel to use this command.");
            return;
        }

        // Create a play queue for the server
        const queue = await client.player.queues.create(interaction.guild);

        // Wait until you are connected to the channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");

            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // Finish if no tracks were found
            if (result.tracks.length === 0) {
                return interaction.reply("No results");
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("No playlist found");
                return;
            }

            const playlist = result.playlist;
            await queue.addTracks(playlist);

            embed
                .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Duration: ${playlist.duration}`});
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("No results found");
                return;
            }

            const song = result.tracks[0];
            await queue.addTracks(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        }

        if (!queue.playing) await queue.play();
        
        await interaction.reply({
            embeds: [embed]
        })
    }
}