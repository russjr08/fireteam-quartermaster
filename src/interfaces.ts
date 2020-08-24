import * as Discord from 'discord.js'

export interface ICommand {
    run(message: Discord.Message, args: string[]): void
    name(): string
}

