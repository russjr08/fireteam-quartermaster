import * as dotenv from 'dotenv'
import * as Discord from 'discord.js'
import * as Firestore from '@google-cloud/firestore'

import { ICommand } from './interfaces';
import CommandPing  from './commands/CommandPing'
import CommandRegister from './commands/CommandRegister';
import CommandLookup from './commands/CommandLookup';
import CommandListVoice from './commands/CommandListVoice';

export class Bot {

    private client = new Discord.Client()

    private commands = new Array<ICommand>()

    public COMMAND_PREFIX = "&"

    private db: Firestore.Firestore

    constructor() {
        // Import variables
        dotenv.config()

        // Initialise Firebase
        this.db = new Firestore.Firestore({
            projectId: process.env.FIREBASE_PROJECT_ID,
            keyFilename: 'firebase-auth.json'
        })
    }

    public initialize() {
        this.client.on('ready', () => {
            console.log(`Bot is up and running as ${this.client?.user?.tag}`)
            this.client.user?.setPresence({
                status: "online",
                activity: {
                    name: "And Guiding Guardians Together!",
                    type: "WATCHING"
                }
            })
        })
    
        this.client.on('guildCreate', (server: Discord.Guild) => {
            server.systemChannel?.send('Hello World!')
        })
    
        this.client.on('message', (message: Discord.Message) => {
            if(message.content.startsWith(this.COMMAND_PREFIX)) {
                var slicedInput = message.content.split(this.COMMAND_PREFIX)
                if(slicedInput.length > 1) {
                    var commandName = slicedInput[1].split(" ")[0]
                    this.commands.forEach((command: ICommand) => {
                        if(command.name() === commandName) {
                            var args = slicedInput[1].split(" ").slice(1)
                            command.run(message, args)
                        }
                    })
                }
            }
        })
    
        this.commands.push(new CommandPing(this))
        this.commands.push(new CommandRegister(this))
        this.commands.push(new CommandLookup(this))
        this.commands.push(new CommandListVoice(this))
    
        this.client.login(process.env['BOT_LOGIN_TOKEN'])
    }


    public getDatabase(): Firestore.Firestore {
        return this.db
    }

    public reactPositiveToMessage(message: Discord.Message) {
        message.react("✅")
    }

    public reactNegativeToMessage(message: Discord.Message) {
        message.react("❌")
    }

    public reactWaitingToMessage(message: Discord.Message) {
        message.react("🤔")
    }

}

const bot = new Bot()

bot.initialize()