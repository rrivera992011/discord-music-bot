const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
    execute: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("There is no song playing.");
            return;
        }

        const currentSong = queue.current;

        queue.setPaused(true);

        await interaction.reply("The current song has been paused");
    }
}