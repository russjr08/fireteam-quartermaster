import { ICommand } from '../interfaces';
import { PermissionLevel } from '../types';
import { Message } from 'discord.js';
import * as Discord from 'discord.js'
import { Bot } from '../bot';

export default class CommandLookup implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {

        if(message.mentions.users.size <= 0) {
            message.reply("You need to mention at least one Discord user!")
            this.bot.reactNegativeToMessage(message)
            return
        }

        if(message.mentions.users.size > 10) {
            message.reply("You can only lookup a maximum of 10 Guardians at a time!")
            this.bot.reactNegativeToMessage(message)
            return
        }

        this.bot.reactWaitingToMessage(message)

        const embed = new Discord.MessageEmbed()
                    .setColor(this.bot.DEFAULT_EMBED_COLOR)
                    .setTitle("Registration Results")
                    .setDescription("Here are the Steam IDs for the Guardians you mentioned!")

        var collection = this.bot.getDatabase().collection("players")
        for(let [id, user] of message.mentions.users) {
            var snapshot = await collection.doc(id).get()
            if(snapshot.exists) {
                var data = snapshot.data()
                if(data !== undefined) {
                    embed.addField(user.username, data.steam_id, false)
                } else {
                    embed.addField(user.username, "<Not Registered>", false)
                }
            } else {
                embed.addField(user.username, "<Not Registered>", false)
            }
        }

        message.channel.send(embed).then(() => message.reactions.removeAll()).then(() => this.bot.reactPositiveToMessage(message))
        
    }
    name(): string {
        return "lookup"
    }

    getHelpText(): string {
        return `<${this.bot.COMMAND_PREFIX}lookup @Username> Attempts to lookup a Guardian's Steam ID, and returns it if found. _Hint, you can lookup multiple Guardians at once!_`
    }

    getRequiredPermissionLevel(): PermissionLevel {
        return PermissionLevel.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }

}