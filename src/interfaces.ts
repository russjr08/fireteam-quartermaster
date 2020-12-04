import * as Discord from 'discord.js'
import { PermissionLevel } from './types';

export interface ICommand {
    run(message: Discord.Message, args: string[]): void
    name(): string
    getHelpText(): string
    getRequiredPermissionLevel(): PermissionLevel
    isCommandHidden(): boolean
}

