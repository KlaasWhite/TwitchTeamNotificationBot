import { AxiosRequestConfig } from "axios";
import DiscordHelper from "./DiscordHelper";
import {
    getCurrentSubscriptions,
    getTwitchChannelInformation,
    getTwitchUserInformation,
    twitchGetTeam,
    twitchStartSubscription,
    twitchStopSubscription,
    twitchTokenRequest,
} from "./utils/axiosRequests";
import EnvironmentVariables from "./utils/EnvironmentVariables";

export type CurrentStreamerInformation = {
    twitchPfp: string;
    name: string;
    game: string;
    title: string;
};

export type Streamer = {
    id: string;
    loginName: string;
    subscriptionId: string;
};

export default class TwitchHelper {
    static teamStreamers = new Map<string, Streamer>();
    static twitchOAuthToken = "";

    public static async getOAuthToken() {
        this.twitchOAuthToken = await twitchTokenRequest();
    }

    public static getDefaultConfig = (): AxiosRequestConfig => {
        let config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${this.twitchOAuthToken}`,
                "Client-Id": EnvironmentVariables.TWITCH_APPLICATION_CLIENT_ID,
            },
        };

        return config;
    };

    public static async loadStreamersInTeam() {
        let url = `https://api.twitch.tv/helix/teams?name=${EnvironmentVariables.TWITCH_TEAM_NAME}`;
        let twitchResponse = await twitchGetTeam(url);
        if (twitchResponse.users) {
            twitchResponse.users.forEach((user) => {
                if (
                    !EnvironmentVariables.TWITCH_EXCLUDED_STREAMERS.includes(
                        user.user_login
                    )
                ) {
                    let streamer: Streamer = {
                        id: user.user_id,
                        loginName: user.user_login,
                        subscriptionId: "",
                    };
                    this.teamStreamers.set(user.user_id, streamer);
                }
            });
        }
    }

    public static async startSubscriptions() {
        this.teamStreamers.forEach(async (streamer, id) => {
            streamer.subscriptionId = await twitchStartSubscription(streamer);
        });
        DiscordHelper.subscriptionStarted(this.teamStreamers);
    }

    public static async stopSubscriptions() {
        this.teamStreamers.forEach(async (streamer, id) => {
            if (streamer.subscriptionId !== "") {
                let success = await twitchStopSubscription(
                    streamer.subscriptionId
                );
                if (success) {
                    streamer.subscriptionId === "";
                }
            }
        });
    }

    public static getStreamer(streamerId: string) {
        return this.teamStreamers.get(streamerId);
    }

    public static async getCurrentStreamerInformation(
        streamerId: string
    ): Promise<CurrentStreamerInformation> {
        return new Promise(async (resolve, reject) => {
            let userInformation = await getTwitchUserInformation(streamerId);
            let channelInformation = await getTwitchChannelInformation(
                streamerId
            );

            let currentStreamerInformation = {
                twitchPfp: userInformation.profile_image_url,
                name: userInformation.display_name,
                game: channelInformation.game_name,
                title: channelInformation.title,
            };
            resolve(currentStreamerInformation);
        });
    }

    public static async removeOldSubscriptions() {
        let currentSubscriptions = await getCurrentSubscriptions();
        currentSubscriptions.forEach(async (subscription) => {
            await twitchStopSubscription(subscription.id);
        });
    }
}
