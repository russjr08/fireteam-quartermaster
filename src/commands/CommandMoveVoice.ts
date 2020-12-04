import { Message } from 'discord.js';
import { ICommand } from '../interfaces';
import { PermissionLevel } from '../types';
import { Bot } from '../bot';

export default class CommandMoveVoice implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }
    
    run(message: Message, args: string[]): void {
        if(args.length < 2) {
            message.reply("You did not specify enough information to process this for you!")
            this.bot.reactNegativeToMessage(message)
            return
        }

        if(message.guild?.channels.cache.has(args[0]) && message.guild?.channels.cache.has(args[1])) {
            let voiceFrom = message.guild?.channels.cache.get(args[0])
            let voiceDestination = message.guild?.channels.cache.get(args[1])

            if(voiceFrom && voiceDestination) {
                for(let [id, user] of voiceFrom?.members) {
                    user.voice.setChannel(voiceDestination)
                }
                this.bot.reactPositiveToMessage(message)
            } else {
                message.reply("I either do not have access to one of those channels, or it could not be found!")
                this.bot.reactNegativeToMessage(message)
            }
            
        } else {
            message.reply("I either do not have access to one of those channels, or it could not be found!")
            this.bot.reactNegativeToMessage(message)
        }
    }

    name(): string {
        return "move_voice"
    }

    getHelpText(): string {
        return `<${this.bot.COMMAND_PREFIX}move_voice VC_FROM_ID VC_TO_ID> Moves all users from the given voice channel to the other given voice channel.`
    }

    getRequiredPermissionLevel(): PermissionLevel {
        return PermissionLevel.ADMIN
    }

    isCommandHidden(): boolean {
        return false
    }

}