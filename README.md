# Setup
You will need to create a .env file with the following:
``` BOT_LOGIN_TOKEN=Token goes here ```

This bot also utilizes Firebase to store data, you will need to create your own Firebase project, and download the credentials for the project to your workspace (it should be presented to you as `firebase-auth.json`).

# Requirements
You will need Node v12.12.0 or higher

Either have Node v12.12.0 installed globally, or utilize nodeenv

## Nodeenv
Create a new environment

`nodeenv env`

Install Node v12.12.0
`nodeenv --node=12.12.0`

Activate the environment
`$ . env/bin/activate`

Exit environment
`(env) $ deactivate_node`

After you have Node v12.12.0 installed (either globally or via something like nodeenv), install everything from `package.json`
`npm install`


# Commands
&register \<id> - Registers your Steam ID with Fireteam Quartermaster

&deleteme - Removes your registration with Fireteam Quartermaster

&list_voice - Lists everyone's join codes in the current [voice] channel you are in, as long as they are registered with Fireteam Quartermaster

&lookup \<Nickname or Discord Username> - Looks up a player with Fireteam Quartermaster, if they are registered it will return their Steam ID. 
   - Example: &lookup @russjr08

&help - Prints a list of commands and what they do