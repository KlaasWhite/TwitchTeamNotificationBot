import express, { response } from "express";
import DiscordHelper from "./DiscordHelper";
import webhooksCallback from "./requests/webhooksCallback";
import TwitchHelper from "./TwitchHelper";
import EnvironmentVariables from "./utils/EnvironmentVariables";
import verifyTwitchSignature from "./veriftyTwitchSignature";
require("dotenv").config();

export const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json({ verify: verifyTwitchSignature }));

let started = EnvironmentVariables.loadAndCheckVariables();

if (!started) {
    console.log(
        "One or more of the environment variables were not valid or empty strings"
    );
    process.exit();
}

console.log(EnvironmentVariables.TWITCH_SIGNING_SECRET);

app.post("/test/remove", (req, res) => {
    if (req.header("api-key") !== EnvironmentVariables.API_KEY) {
        res.statusCode = 401;
        res.send(
            "Not authorised, provide api-key header set as api key set in environtment variables"
        );
    } else {
        TwitchHelper.removeOldSubscriptions();
        res.send();
    }
});

app.post("/webhooks/callback", (req, res) => {
    webhooksCallback(req, res);
});

const initalise = async () => {
    await DiscordHelper.initialiseDiscord();
    await TwitchHelper.getOAuthToken();
    if (TwitchHelper.twitchOAuthToken) {
        await TwitchHelper.removeOldSubscriptions();
        await TwitchHelper.loadStreamersInTeam();
        await TwitchHelper.startSubscriptions();
    }
};

initalise();

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});
