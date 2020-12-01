import { ICommand } from '../interfaces';
import { Message } from 'discord.js';
import * as Discord from 'discord.js'
import { Bot } from '../bot';

export default class CommandLookup implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {
        if(!args[0].startsWith("<")) {
            message.reply("That doesn't look like a valid Discord name from this server to me.")
            this.bot.reactNegativeToMessage(message)
            return
        }

        this.bot.reactWaitingToMessage(message)

        // Strips the argument to only have the Discord ID in it, and stores it under targetID
        var targetID = args[0].replace("\<", "")
        targetID = targetID.replace("\>", "")
        targetID = targetID.replace("\!", "")
        targetID = targetID.replace("@", "")

        var usersInGuild = await message.guild?.members.fetch()

        if(usersInGuild !== undefined) {
            var targetUser = usersInGuild.find(user => user.id === targetID)
            if(targetUser !== undefined) {
                var collection = this.bot.getDatabase().collection("players")
                var snapshot = await collection.doc(targetID).get()

                const embed = new Discord.MessageEmbed()
                    .setColor(this.bot.DEFAULT_EMBED_COLOR)
                    .setTitle("Registration")
                    .setAuthor(targetUser.user.tag)
        
                if(snapshot.exists) {
                    var data = snapshot.data()
                    if(data !== undefined) {
                        embed.addField("Steam ID", data.steam_id, true)
                    } else {
                        embed.addField("Steam ID", "Data Not Found :(", true)
                        await message.reactions.removeAll()
                        this.bot.reactNegativeToMessage(message)
                        message.channel.send(embed)
                        return
                    }
                    await message.reactions.removeAll()
                    this.bot.reactPositiveToMessage(message)
                } else {
                    embed.setDescription(`Registration not found for ${targetUser.user.tag}`)
                    await message.reactions.removeAll()
                    this.bot.reactNegativeToMessage(message)
                }

                message.channel.send(embed)
            }
        }
        
    }
    name(): string {
        return "lookup"
    }

    getHelpText(): string {
        return `<${this.bot.COMMAND_PREFIX}lookup @Username> Attempts to lookup a user's Steam ID, and returns it if found.`
    }

}