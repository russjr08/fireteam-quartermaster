import { ICommand } from '../interfaces';
import { RoleType } from '../types';
import { Guild, GuildMember, Message } from 'discord.js';
import { Bot } from '../bot';
import { Utilities } from '../Utilities';

export default class CommandConfig implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {
        if(args.length > 2 || args.length == 0) {
            message.reply(`Invalid number of parameters! (Found ${args.length} instead of 1 or 2)`)
            this.bot.reactNegativeToMessage(message)
            return
        }

        if(args.length == 1) {
            message.channel.startTyping()
            var option = args[0]
            var data = await Utilities.getRemoteConfigValue(option, message.guild!!)

            message.reply(`This config option is set to: ${data}`)
            message.channel.stopTyping()
            this.bot.reactPositiveToMessage(message)
            return
        }

        if(args.length == 2) {
            message.channel.startTyping()
            var option = args[0]
            var value = args[1]

            Utilities.setRemoteConfigValue(option, value, message.guild!!)

            if(option == "raid-poll-channel") {
                message.reply(`Got it! I'll post the Weekly Raid poll over in <#${value}> moving forward!`)
            } else {
                message.reply(`Updated config option ${option} to ${value}!`)
            }

            message.channel.stopTyping()
            this.bot.reactPositiveToMessage(message)
            return
        }

        
    }

    public name(): string {
        return "config"
    }

    getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        return Promise.resolve(`Sets a config option for this guild - ${this.bot.COMMAND_PREFIX}config <name> <value>`)
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.ADMIN
    }

    isCommandHidden(): boolean {
        return false
    }

}