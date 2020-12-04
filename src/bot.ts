import * as dotenv from 'dotenv'
import * as Discord from 'discord.js'
import * as Firestore from '@google-cloud/firestore'

import { ICommand } from './interfaces';
import CommandPing  from './commands/CommandPing'
import CommandRegister from './commands/CommandRegister';
import CommandLookup from './commands/CommandLookup';
import CommandListVoice from './commands/CommandListVoice';
import CommandHelp from './commands/CommandHelp';
import { Utilities } from './Utilities';

export class Bot {

    private client = new Discord.Client()

    private commands = new Array<ICommand>()
    
    private db: Firestore.Firestore

    public COMMAND_PREFIX = "&"
    public DEFAULT_EMBED_COLOR = "#00c0ff"

    constructor() {
        // Import variables
        dotenv.config()

        // Initialise Firebase
        this.db = new Firestore.Firestore({
            projectId: process.env.FIREBASE_PROJECT_ID,
            keyFilename: 'firebase-auth.json'
        })
    }

    private updateStatus() {
        this.client.user?.setPresence({
            status: "online",
            activity: {
                name: "And Guiding Guardians Together!",
                type: "WATCHING"
            }
        }).then(() => {
            console.log("Sent status update to Discord")
        })
    }

    public initialize() {
        this.client.on('ready', () => {
            console.log(`Bot is up and running as ${this.client?.user?.tag}`)
            
            this.updateStatus() // Initial status update

            // Updates status to Discord after every fifteen minutes (as it gets cleared eventually on its own)
            setInterval(() => {
                this.updateStatus()
            }, 900000)
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
                            if(Utilities.getUserPermissionLevel(message.member!, this.db) >= command.getRequiredPermissionLevel()) {
                                var args = slicedInput[1].split(" ").slice(1)
                                command.run(message, args)
                            } else {
                                message.reply("Error: You are not authorized to run this command! (**Access Denied**)")
                                this.reactNegativeToMessage(message)
                            }
                        }
                    })
                }
            }
            if(message.mentions.members?.has(this.client.user!.id)) {
                if(message.content.toLowerCase().includes("ily")) {
                    message.react("❤")
                }
            }
        })
    
        this.commands.push(new CommandPing(this))
        this.commands.push(new CommandRegister(this))
        this.commands.push(new CommandLookup(this))
        this.commands.push(new CommandListVoice(this))
        this.commands.push(new CommandHelp(this))
    
        this.client.login(process.env['BOT_LOGIN_TOKEN'])
    }


    public getDatabase(): Firestore.Firestore {
        return this.db
    }

    public getCommands(): Array<ICommand> {
        return this.commands
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