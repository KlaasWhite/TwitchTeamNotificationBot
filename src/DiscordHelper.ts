import Discord, {
    EmbedBuilder,
    IntentsBitField,
    TextBasedChannel,
    TextBasedChannelMixin,
} from "discord.js";
import TwitchHelper, { Streamer } from "./TwitchHelper";
import EnvironmentVariables from "./utils/EnvironmentVariables";

export default class DiscordHelper {
    static client: Discord.Client;

    static channel: TextBasedChannel;

    public static initialiseDiscord() {
        let myIntents = new IntentsBitField();
        myIntents.add(IntentsBitField.Flags.Guilds);
        this.client = new Discord.Client({
            intents: myIntents,
        });

        this.client.on("ready", () => {
            console.log(`${this.client.user?.tag} has logged in`);
        });

        this.client.login(process.env.DISCORD_BOT_TOKEN);

        this.client.guilds
            .fetch(EnvironmentVariables.DISCORD_NOTIFICATION_SERVER)
            .then((guild) => {
                guild.channels
                    .fetch(EnvironmentVariables.DISCORD_NOTIFICATION_CHANNEL)
                    .then((channel) => {
                        if (channel?.isTextBased) {
                            this.channel = channel as TextBasedChannel;
                        }
                    });
            });
    }

    public static subscriptionStarted(streamers: Map<string, Streamer>) {
        let streamerList = "";
        streamers.forEach((streamer) => {
            streamerList += `${streamer.loginName} \n`;
        });
        const subscriptionStartEmbed = new EmbedBuilder()
            .setTitle(
                "Notification bot has been started and is listening of events on these channels: "
            )
            .setDescription(streamerList);

        this.channel.send({ embeds: [subscriptionStartEmbed] });
    }

    public static async triggerStreamUp(broadcasterUserId: string) {
        let streamInformation =
            await TwitchHelper.getCurrentStreamerInformation(broadcasterUserId);
        const liveAnnouncement = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(
                `${streamInformation.name}, member of the ${EnvironmentVariables.TWITCH_TEAM_NAME} stream team just went live!`
            )
            // .setDescription(`**${streamInformation.name} just went live!**`)
            .setFields({
                name: `Playing ${streamInformation.game}`,
                value: streamInformation.title,
                inline: false,
            })
            .addFields({
                name: `Watch them now live!`,
                value: `[Click](https://www.twitch.tv/${streamInformation.name})`,
                inline: false,
            })
            .setImage(`${streamInformation.twitchPfp}`)

            .setFooter({
                text: "Stream team notifications made by KlaasWhite",
            });

        this.channel.send({ embeds: [liveAnnouncement] });
    }
}
