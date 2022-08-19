# TwitchTeamNotificationBot

Bot to send automatic go live notifications of members of a Twitch stream team to a specific discord server and channel

# Setup

This bot requires a discord bot token and a twitch developer application, I won't go into detail in how to make those

These need to be provided in environment variables when this application is deployed with these fields:

PORT (does not need to be given, is provided by host)
SERVER_URL (url of the server, needed for callbacks and webhooks)
API_KEY (a api key chosen by you, used to interact with the application)

DISCORD_BOT_TOKEN 

DISCORD_NOTIFICATION_SERVER (id of the discord server)

DISCORD_NOTIFICATION_CHANNEL (id of the discord channel)


TWITCH_APPLICATION_CLIENT_ID

TWITCH_APPLICATION_CLIENT_SECRET

TWITCH_TEAM_NAME (name of the targetted stream team, see url of page to aquire the correct name)

TWITCH_EXCLUDED_STREAMERS (comma seperate list of exclused streamers, use full lower case or use url again to find correct name)

# Admin interaction

Currently there is not much ways to interact with the application, all settings are in environment variables and discord slash commands are a bitch to set up

The only thing that can be done is sending a delete request to /stopsubscription to stop all subscription, this is good practive when you want to shut down the app
For this, the api key given above must be provided as header in field `api-key`
