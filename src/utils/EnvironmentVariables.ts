import { generateRandomString } from "./functions";

export default class EnvironmentVariables {
    static PORT = "";
    static SERVER_URL = "";
    static API_KEY = "";

    static DISCORD_BOT_TOKEN = "";
    static DISCORD_NOTIFICATION_SERVER = "";
    static DISCORD_NOTIFICATION_CHANNEL = "";

    static TWITCH_APPLICATION_CLIENT_ID = "";
    static TWITCH_APPLICATION_CLIENT_SECRET = "";

    static TWITCH_TEAM_NAME = "";
    static TWITCH_EXCLUDED_STREAMERS: string[] = [];

    static TWITCH_SIGNING_SECRET = "";

    public static loadAndCheckVariables(): boolean {
        if (process.env.PORT && process.env.PORT !== "") {
            this.PORT = process.env.PORT as string;
        } else {
            return false;
        }
        if (process.env.SERVER_URL && process.env.SERVER_URL !== "") {
            this.SERVER_URL = process.env.SERVER_URL as string;
        } else {
            return false;
        }
        if (process.env.API_KEY && process.env.API_KEY !== "") {
            this.API_KEY = process.env.API_KEY as string;
        } else {
            return false;
        }
        if (
            process.env.DISCORD_BOT_TOKEN &&
            process.env.DISCORD_BOT_TOKEN !== ""
        ) {
            this.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;
        } else {
            return false;
        }
        if (
            process.env.DISCORD_NOTIFICATION_SERVER &&
            process.env.DISCORD_NOTIFICATION_SERVER !== ""
        ) {
            this.DISCORD_NOTIFICATION_SERVER = process.env
                .DISCORD_NOTIFICATION_SERVER as string;
        } else {
            return false;
        }
        if (
            process.env.DISCORD_NOTIFICATION_CHANNEL &&
            process.env.DISCORD_NOTIFICATION_CHANNEL !== ""
        ) {
            this.DISCORD_NOTIFICATION_CHANNEL = process.env
                .DISCORD_NOTIFICATION_CHANNEL as string;
        } else {
            return false;
        }
        if (
            process.env.TWITCH_APPLICATION_CLIENT_ID &&
            process.env.TWITCH_APPLICATION_CLIENT_ID !== ""
        ) {
            this.TWITCH_APPLICATION_CLIENT_ID = process.env
                .TWITCH_APPLICATION_CLIENT_ID as string;
        } else {
            return false;
        }
        if (
            process.env.TWITCH_APPLICATION_CLIENT_SECRET &&
            process.env.TWITCH_APPLICATION_CLIENT_SECRET !== ""
        ) {
            this.TWITCH_APPLICATION_CLIENT_SECRET = process.env
                .TWITCH_APPLICATION_CLIENT_SECRET as string;
        } else {
            return false;
        }
        if (
            process.env.TWITCH_TEAM_NAME &&
            process.env.TWITCH_TEAM_NAME !== ""
        ) {
            this.TWITCH_TEAM_NAME = process.env.TWITCH_TEAM_NAME as string;
        } else {
            return false;
        }
        if (
            process.env.TWITCH_EXCLUDED_STREAMERS &&
            process.env.TWITCH_EXCLUDED_STREAMERS !== ""
        ) {
            this.TWITCH_EXCLUDED_STREAMERS =
                process.env.TWITCH_EXCLUDED_STREAMERS.split(",");
        } else {
            return false;
        }
        this.TWITCH_SIGNING_SECRET = generateRandomString(40);
        return true;
    }
}
