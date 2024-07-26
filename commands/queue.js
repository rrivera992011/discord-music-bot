const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue"),
    
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.reply("There is no song playing.");
            return;
        }

        const queuedString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i + 1}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently playing:**\n\` ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queuedString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}