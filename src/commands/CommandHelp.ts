import { Message } from 'discord.js';
import { ICommand } from '../interfaces';
import { RoleType } from '../types';
import { Bot } from '../bot';
import * as Discord from 'discord.js';
import { Utilities } from '../Utilities';


export default class CommandHelp implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    async run(message: Message, args: string[]): Promise<void> {

        message.channel.startTyping()

        const embed = new Discord.MessageEmbed()
                            .setTitle("My List of Commands")
                            .setColor(this.bot.DEFAULT_EMBED_COLOR)
                            .setDescription("See the following list for commands that you can run, and what they do!")

        for(let command of this.bot.getCommands()) {
            if(!command.isCommandHidden()) {
                if(await Utilities.doesUserHaveRoleType(message.guild!, command.getRequiredPermissionLevel(), message.member!)) {
                    embed.addField(command.name(), command.getHelpText(), false)
                }
            }
        }

        message.channel.send(embed).then(() => this.bot.reactPositiveToMessage(message)).then(() => message.channel.stopTyping())

    }

    name(): string {
        return "help"
    }

    getHelpText(): string {
        return `<${this.bot.COMMAND_PREFIX}help> Lists all available commands, and their help text.`
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }

}