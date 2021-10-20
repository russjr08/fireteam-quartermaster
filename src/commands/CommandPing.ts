import { ICommand } from '../interfaces';
import { RoleType } from '../types';
import { Guild, GuildMember, Message } from 'discord.js';
import { Bot } from '../bot';

export default class CommandPing implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {
        message.channel.startTyping()
        message.reply("Pong!")
        message.channel.stopTyping()
    }

    public name(): string {
        return "ping"
    }

    getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        return Promise.resolve(`Test command... Nothing to see here!`)
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }

}