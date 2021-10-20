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

        const userHighestRole = await Utilities.getRoleFromType(message.guild!, await Utilities.getUsersHighestRoleType(message.guild!, message.member!))

        const embed = new Discord.MessageEmbed()
                            .setTitle(`My List of Commands`)
                            .setColor(this.bot.DEFAULT_EMBED_COLOR)
                            .setDescription(`See the following list for commands that you can run, and what they do! (Role Type: <@&${userHighestRole}>)`)

        for(let command of this.bot.getCommands()) {
            if(!command.isCommandHidden()) {
                if(await Utilities.doesUserHaveRoleType(message.guild!, command.getRequiredPermissionLevel(), message.member!)) {
                    embed.addField(command.name(), await command.getHelpText(message.guild!, message.member!), false)
                }
            }
        }

        message.channel.send(embed).then(() => this.bot.reactPositiveToMessage(message)).then(() => message.channel.stopTyping())

    }

    name(): string {
        return "help"
    }

    async getHelpText(guild: Discord.Guild, user: Discord.GuildMember): Promise<string> {
        const userHighestRole = await Utilities.getRoleFromType(guild, await Utilities.getUsersHighestRoleType(guild, user))
        return Promise.resolve(`<${this.bot.COMMAND_PREFIX}help> Lists all available commands, and their help text, that your role (<@&${userHighestRole}>) can access!`)
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }

}