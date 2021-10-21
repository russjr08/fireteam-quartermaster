import { DiscordAPIError, Guild, GuildMember, GuildChannel, Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
import { ICommand } from "../interfaces";
import { RoleType } from "../types";
import { Utilities } from "../Utilities";

export default class CommandInstruct implements ICommand {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot
    }

    async run(message: Message, args: string[]): Promise<void> {
        message.channel.startTyping()

        var toggle = true

        if(args.length > 0) {
            if(args[0] == "on") {
                toggle = true
            } else {
                toggle = false
            }
        }

        var authorActiveVoiceChannel = message.guild?.channels.cache.filter((channel: GuildChannel) => { 
            return (channel.type === 'voice' && channel.members.findKey(user => user.id === message.author.id) !== undefined )
        }).first()

        if(authorActiveVoiceChannel == undefined) {
            message.channel.stopTyping()
            this.bot.reactNegativeToMessage(message)
            message.reply("You are not currently in a voice channel (or I cannot see it for some reason)!")
        } else {

            const embed = new MessageEmbed()
                            .setColor("#ff0000")
                            .setTitle(`⚠ Instruction mode enabled!`)
                            .setDescription(`Instruction mode has been enabled by <@${message.author.id}> for <#${authorActiveVoiceChannel.id}> - please be sure to listen to their (or anyone from <@&${await Utilities.getRoleFromType(message.guild!, RoleType.MODERATOR)}>) instructions carefully! You'll have an opportunity to ask any questions afterwards.`)
            
            if(!toggle) {
                embed.setTitle(`✅ Instruction mode disabled!`)
                     .setDescription(`Instruction mode has been disabled by <@${message.author.id}> for <#${authorActiveVoiceChannel.id}> - feel free to ask any questions you may have now!`)
                     .setColor("#00ff00")
            }
            
            var pingMessageContents = ""

            var toggleStatus = toggle ? "Muted" : "Unmuted"

            for(let [id, member] of authorActiveVoiceChannel.members) {
                pingMessageContents += ` <@${id}>`
                const highestRole = await Utilities.getUsersHighestRoleType(message.guild!, member)
                if(highestRole == RoleType.MODERATOR || highestRole == RoleType.ADMIN || highestRole == RoleType.DEVELOPER) {
                    embed.addField(`${member.displayName}`, "Exempt", true)
                } else {
                    embed.addField(`${member.displayName}`, toggleStatus, true)
                    member.voice.setMute(toggle)
                }
            }

            message.channel.send(embed)
            message.channel.send(pingMessageContents).then((message) => message.delete()).then(() => message.channel.stopTyping())

            this.bot.reactPositiveToMessage(message)

        }
    }

    name(): string {
        return "instruct"
    }

    async getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        console.log("Help called")
        return `<${this.bot.COMMAND_PREFIX}instruct on/off> Toggles voice mute of everyone in your voice channel who is not <@&${await Utilities.getRoleFromType(guild, RoleType.MODERATOR)}> or higher.`
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.MODERATOR
    }

    isCommandHidden(): boolean {
        return false
    }

    

}