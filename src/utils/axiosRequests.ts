import axios, { AxiosRequestConfig } from "axios";
import TwitchHelper, { Streamer } from "../TwitchHelper";
import EnvironmentVariables from "./EnvironmentVariables";

export type TwitchTeamsResponse = {
    background_image_url: string;
    banner: string;
    created_at: string;
    id: string;
    info: string;
    team_display_name: string;
    team_name: string;
    thumbnail_url: string;
    updated_at: string;
    users: TwitchUser[];
};

export type TwitchUser = {
    user_id: string;
    user_name: string;
    user_login: string;
};

export const twitchGetTeam = (url: string): Promise<TwitchTeamsResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .get(url, TwitchHelper.getDefaultConfig())
            .then((value) => {
                resolve(value.data.data[0]);
            })
            .catch((error) => {
                console.error(error);
                resolve({} as TwitchTeamsResponse);
            });
    });
};

export const twitchTokenRequest = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        let params = new URLSearchParams();
        let client_id = process.env.TWITCH_APPLICATION_CLIENT_ID as string;
        let client_secret = process.env
            .TWITCH_APPLICATION_CLIENT_SECRET as string;
        params.append("client_id", client_id);
        params.append("client_secret", client_secret);
        params.append("grant_type", "client_credentials");

        let config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        axios
            .post("https://id.twitch.tv/oauth2/token", params, config)
            .then((value) => {
                resolve(value.data.access_token);
            })
            .catch((error) => {
                console.error(error);
                resolve("");
            });
    });
};

export const twitchStartSubscription = (
    streamer: Streamer
): Promise<string> => {
    return new Promise((resolve, reject) => {
        let url = "https://api.twitch.tv/helix/eventsub/subscriptions";
        let data = {
            type: "stream.online",
            version: "1",
            condition: {
                broadcaster_user_id: streamer.id,
            },
            transport: {
                method: "webhook",
                callback: `${EnvironmentVariables.SERVER_URL}/webhooks/callback`,
                secret: EnvironmentVariables.TWITCH_SIGNING_SECRET,
            },
        };
        axios
            .post(url, data, TwitchHelper.getDefaultConfig())
            .then((value) => {
                resolve(value.data.data[0].id);
            })
            .catch((error) => {
                console.error(error);
                resolve("");
            });
    });
};

export const twitchStopSubscription = (
    subscriptionId: string
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        let url = `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`;
        axios
            .delete(url, TwitchHelper.getDefaultConfig())
            .then((value) => {
                resolve(true);
            })
            .catch((error) => {
                console.error(error);
                resolve(false);
            });
    });
};

export type ChannelInformation = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: string;
    game_id: string;
    game_name: string;
    title: string;
    delay: number;
};

export const getTwitchChannelInformation = (
    streamerId: string
): Promise<ChannelInformation> => {
    return new Promise((resolve, reject) => {
        let url = `https://api.twitch.tv/helix/channels?broadcaster_id=${streamerId}`;
        axios
            .get(url, TwitchHelper.getDefaultConfig())
            .then((value) => resolve(value.data.data[0]))
            .catch((error) => {
                console.error(error);
                reject();
            });
    });
};

export type UserInformation = {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
};

export const getTwitchUserInformation = (
    streamerId: string
): Promise<UserInformation> => {
    return new Promise((resolve, reject) => {
        let url = `https://api.twitch.tv/helix/users?id=${streamerId}`;
        axios
            .get(url, TwitchHelper.getDefaultConfig())
            .then((value) => resolve(value.data.data[0]))
            .catch((error) => {
                console.error(error);
                reject();
            });
    });
};

export type Subscription = {
    id: string;
};

export const getCurrentSubscriptions = (): Promise<Subscription[]> => {
    return new Promise((resolve, reject) => {
        let url = `https://api.twitch.tv/helix/eventsub/subscriptions`;
        axios
            .get(url, TwitchHelper.getDefaultConfig())
            .then((value) => resolve(value.data.data))
            .catch((error) => {
                console.error(error);
                reject();
            });
    });
};
