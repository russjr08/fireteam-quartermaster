import * as dotenv from 'dotenv'
import * as Discord from 'discord.js'
import * as Firestore from '@google-cloud/firestore'

import { ICommand } from './interfaces';
import CommandPing  from './commands/CommandPing'
import CommandRegister from './commands/CommandRegister';
import CommandLookup from './commands/CommandLookup';
import CommandListVoice from './commands/CommandListVoice';
import CommandMoveVoice from './commands/CommandMoveVoice';
import CommandHelp from './commands/CommandHelp';
import { Utilities } from './Utilities';
import CommandSetRoleType from './commands/CommandSetRoleType';
import CommandRoleTypeCheck from './commands/CommandRoleTypeCheck';
import CommandInstruct from './commands/CommandInstruct';
import CommandPurge from './commands/CommandPurge';
import { RoleType } from './types';

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
                    this.commands.forEach(async (command: ICommand) => {
                        if(command.name() === commandName) {
                            if(await Utilities.doesUserHaveRoleType(message.guild!, command.getRequiredPermissionLevel(), message.member!)
                             || command.getRequiredPermissionLevel() == RoleType.CUSTOM) {
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
        this.commands.push(new CommandMoveVoice(this))
        this.commands.push(new CommandSetRoleType(this))
        this.commands.push(new CommandRoleTypeCheck(this))
        this.commands.push(new CommandInstruct(this))
        this.commands.push(new CommandPurge(this))
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
        message.reactions.removeAll().then(() => message.react("✅"))
    }

    public reactNegativeToMessage(message: Discord.Message) {
        message.reactions.removeAll().then(() => message.react("❌"))
    }

    public reactWaitingToMessage(message: Discord.Message) {
        message.reactions.removeAll().then(() => message.react("🤔"))
    }

}

const bot = new Bot()

bot.initialize()