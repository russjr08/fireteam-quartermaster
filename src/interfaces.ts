import * as Discord from 'discord.js'
import { RoleType } from './types';

export interface ICommand {
    run(message: Discord.Message, args: string[]): void
    name(): string
    getHelpText(): string
    getRequiredPermissionLevel(): RoleType
    isCommandHidden(): boolean
}

