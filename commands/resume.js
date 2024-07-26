const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
    execute: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("There is no song playing.");
            return;
        }

        const currentSong = queue.current;

        queue.setPaused(false);

        await interaction.reply("Resumed playing.");
    }
}