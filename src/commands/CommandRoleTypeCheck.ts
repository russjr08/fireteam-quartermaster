import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
import { ICommand } from "../interfaces";
import { RoleType } from "../types";
import { Utilities } from "../Utilities";

export default class CommandRoleTypeCheck implements ICommand {

    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot
    }

    async run(message: Message, args: string[]): Promise<void> {
        message.channel.startTyping()

        if(args.length == 0) {
            message.reply("Not enough arguments were provided!")
            this.bot.reactNegativeToMessage(message)
            message.channel.stopTyping()
            return
        }

        const roleType: RoleType = RoleType[args[0] as unknown as keyof typeof RoleType]

        const roleId = await Utilities.getRoleFromType(message.guild!, roleType)

        if(args.length == 1) {
            if(roleId == undefined || roleId == "NONE") {
                this.bot.reactNegativeToMessage(message)
                message.reply("The requested data was not found!")
                message.channel.stopTyping()
                return
            }
    
            var embed = new MessageEmbed()
                        .setTitle("Role association")
                        .setColor(this.bot.DEFAULT_EMBED_COLOR)
                        .setDescription(`${roleType} is associated with <@&${roleId}>`)
            
            this.bot.reactPositiveToMessage(message)
            message.channel.send(embed)
        } else if(args.length == 2) {
            var userId: String = args[1]
            await message.guild?.members.fetch()
            var member = await message.guild?.members.cache.find(u => u.id == userId)

            if(member == undefined) {
                message.reply("I could not find that user in this server!")
                this.bot.reactNegativeToMessage(message)
                message.channel.stopTyping()
                return
            }
            
            var userHasType = await Utilities.doesUserHaveRoleType(message.guild!, roleType, member)

            const embed = new MessageEmbed().setTitle("Role Type Results")

            if(userHasType) {
                embed.setDescription(`<@${member.id}> has access to RoleType ${roleType}`).setColor("#7cfc00")
            } else {
                embed.setDescription(`<@${member.id}> does **NOT** have access to RoleType ${roleType}`).setColor("#ff0000")

            }

            message.channel.send(embed)

        }

        this.bot.reactPositiveToMessage(message)
        message.channel.stopTyping()

    }

    name(): string {
        return "check_role_type"
    }

    getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        return Promise.resolve("Used to check what role a RoleType requires")
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.ADMIN
    }

    isCommandHidden(): boolean {
        return true
    }
    
}