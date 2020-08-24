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
                .setColor("#00c0ff")
                .setTitle("Join Codes For Your Party")
                .setAuthor(authorActiveVoiceChannel.name)
                .setDescription("The following folks are in your party!")

            this.bot.reactWaitingToMessage(message)
            for(let [Snowflake, GuildMember] of authorActiveVoiceChannel.members) {
                var snapshot = await this.bot.getDatabase().collection('players').doc(Snowflake).get()
                if(snapshot.exists) {
                    var data = snapshot.data()
                    if(data !== undefined) {
                        embed.addField(GuildMember.user.tag, data.steam_id, true)
                    } else {
                        embed.addField(GuildMember.user.tag, "<Invalid Data>", true)
                    }
                } else {
                    embed.addField(GuildMember.user.tag, "<Not Registered>", true)

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
    
}