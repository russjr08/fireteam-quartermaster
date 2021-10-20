import * as Discord from 'discord.js'
import { RoleType } from './types';

export interface ICommand {
    run(message: Discord.Message, args: string[]): void
    name(): string
    getHelpText(guild: Discord.Guild, user: Discord.GuildMember): Promise<string>
    getRequiredPermissionLevel(): RoleType
    isCommandHidden(): boolean
}

