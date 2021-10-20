import { ICommand } from '../interfaces';
import { RoleType } from '../types';
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
        message.channel.startTyping()

        const embed = new Discord.MessageEmbed()
                    .setColor(this.bot.DEFAULT_EMBED_COLOR)
                    .setTitle("Registration Results")
                    .setDescription("Here are the Bungie Names for the Guardians you mentioned!")

        var collection = this.bot.getDatabase().collection("players")
        var hasLegacySteam = false;

        for(let [id, user] of message.mentions.users) {
            var snapshot = await collection.doc(id).get()
            if(snapshot.exists) {
                var data = snapshot.data()
                if(data !== undefined) {
                    if(data.steam_id !== undefined) {
                        embed.addField(user.username, "<Legacy Data>", false)
                        hasLegacySteam = true;
                    } else {
                        embed.addField(user.username, data.bungie_name, false)
                    }
                } else {
                    embed.addField(user.username, "<Not Registered>", false)
                }
            } else {
                embed.addField(user.username, "<Not Registered>", false)
            }
        }

        if(hasLegacySteam) {
            embed.setFooter("Note, some Guardians you requested still have a Steam ID attached instead of a Bungie Name, you'll see <Legacy Data> for these cases!");
        }

        message.channel.send(embed).then(() => message.reactions.removeAll()).then(() => this.bot.reactPositiveToMessage(message)).then(() => message.channel.stopTyping())
        
    }
    name(): string {
        return "lookup"
    }

    getHelpText(guild: Discord.Guild, user: Discord.GuildMember): Promise<string> {
        return Promise.resolve(`<${this.bot.COMMAND_PREFIX}lookup @Username> Attempts to lookup a Guardian's Bungie Name, and returns it if found. _Hint, you can lookup multiple Guardians at once!_`)
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }

}