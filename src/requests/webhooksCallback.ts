import { Request, Response } from "express";
import DiscordHelper from "../DiscordHelper";

export interface TwitchRedemptionReward {
    cost: number;
    id: string;
    prompt: string;
    title: string;
}

const webhooksCallback = (req: Request, res: Response) => {
    const messageType = req.header("Twitch-Eventsub-Message-Type");
    if (messageType === "webhook_callback_verification") {
        try {
        } catch (error) {
            console.error(error);
        }

        return res.status(200).send(req.body.challenge);
    } else if (messageType === "notification") {
        try {
            let broadcasterUserId = req.body.event.broadcaster_user_id;
            DiscordHelper.triggerStreamUp(broadcasterUserId);
        } catch (e) {
            console.error(e);
        }
    } else if (messageType === "revocation") {
        const { event } = req.body;
        console.log("Revocation");
        console.log(event);
    }

    res.status(200).end();
};

export default webhooksCallback;
