import { Message } from 'discord.js';
import { ICommand } from '../interfaces';
import { Bot } from '../bot';
import * as Discord from 'discord.js';


export default class CommandHelp implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    run(message: Message, args: string[]): void {

        const embed = new Discord.MessageEmbed()
                            .setTitle("My List of Commands")
                            .setColor(this.bot.DEFAULT_EMBED_COLOR)
                            .setDescription("See the following list for commands that you can run, and what they do!")

        for(let command of this.bot.getCommands()) {
            embed.addField(command.name(), command.getHelpText(), false)
        }

        message.channel.send(embed).then(() => this.bot.reactPositiveToMessage(message))

    }

    name(): string {
        return "help"
    }

    getHelpText(): string {
        return `<${this.bot.COMMAND_PREFIX}help> Lists all available commands, and their help text.`
    }

}