import { ICommand } from '../interfaces';
import { Message } from 'discord.js';
import * as Discord from 'discord.js'
import { Bot } from '../bot';
export default class CommandListVoice implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {
        
        var authorActiveVoiceChannel = message.guild?.channels.cache.filter((channel: Discord.GuildChannel) => { 
            return (channel.type === 'voice' && channel.members.findKey(user => user.id === message.author.id) !== undefined )
        }).first()

        if(authorActiveVoiceChannel === undefined) {
            message.reply("You are not currently in a voice channel (or I cannot see it for some reason)!")
            this.bot.reactNegativeToMessage(message)
            return
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(this.bot.DEFAULT_EMBED_COLOR)
                .setTitle("Join Codes For Your Party")
                .setAuthor(authorActiveVoiceChannel.name)
                .setDescription("The following folks are in your party!")

            this.bot.reactWaitingToMessage(message)
            for(let [Snowflake, GuildMember] of authorActiveVoiceChannel.members) {
                var snapshot = await this.bot.getDatabase().collection('players').doc(Snowflake).get()
                if(snapshot.exists) {
                    var data = snapshot.data()
                    if(data !== undefined) {
                        embed.addField(GuildMember.displayName, data.steam_id, true)
                    } else {
                        embed.addField(GuildMember.displayName, "<Invalid Data>", true)
                    }
                } else {
                    embed.addField(GuildMember.displayName, "<Not Registered>", true)

                }
            }
            embed.addField('\u200b', '\u200b')
            embed.addField('Want to register?', `Type ${this.bot.COMMAND_PREFIX}register YourSteamIDHere`)
            message.channel.send(embed)
            await message.reactions.removeAll()
            this.bot.reactPositiveToMessage(message)
        }
        
    }

    public name(): string {
        return "list_voice"
    }

    getHelpText(): string {
        return `<${this.bot.COMMAND_PREFIX}list_voice> Creates a read-out of the join codes for all the members in your voice channel.`
    }
    
}