import { ICommand } from '../interfaces';
import { RoleType } from '../types';
import { Message } from 'discord.js';
import { Bot } from '../bot';

export default class CommandPing implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {
        message.reply("Pong!")
    }

    public name(): string {
        return "ping"
    }

    getHelpText(): string {
        return `Test command... Nothing to see here!`
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }

}