import { DiscordAPIError, Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
import { ICommand } from "../interfaces";
import { RoleType } from "../types";
import { Utilities } from "../Utilities";

export default class CommandSetRoleType implements ICommand {


    bot: Bot
    constructor(bot: Bot) {
        this.bot = bot;
    }

    async run(message: Message, args: string[]): Promise<void> {
        if(args.length < 2) {
            this.bot.reactNegativeToMessage(message)
            message.reply("Not enough arguments provided: I need the type and Role ID that you'd like to set!")
            return
        }

        if(!await Utilities.doesUserHaveRoleType(message.guild!, RoleType.ADMIN, message.member!) 
            && !message.member?.hasPermission("ADMINISTRATOR")) {
                message.reply("Error: You are not authorized to run this command! (**Access Denied**)")
                this.bot.reactNegativeToMessage(message)
                return
        }

        message.channel.startTyping()

        var roleType: RoleType = RoleType[args[0] as unknown as keyof typeof RoleType]

        var role = message.guild?.roles.cache.find(r => r.id === args[1])

        if(role == undefined) {
            this.bot.reactNegativeToMessage(message)
            message.reply("I couldn't locate that role here in this server.")
            return
        }

        if(roleType == undefined) {
            this.bot.reactNegativeToMessage(message)
            message.reply("You did not provide a correct RoleType!")
            return
        }

        try {
            Utilities.setRoleAsType(message.guild!.id, roleType, args[1])
            var embed = new MessageEmbed()
                        .setColor(this.bot.DEFAULT_EMBED_COLOR)
                        .setTitle("Role association updated!")
                        .setDescription(`The following role associations have been made: <@&${role.id}> => ${roleType}`)

            message.channel.send(embed)
            this.bot.reactPositiveToMessage(message)
        } catch (error) {
            this.bot.reactNegativeToMessage(message)
            message.reply(error)
        }

        message.channel.stopTyping()

    }

    name(): string {
        return "set_role_type"
    }

    getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        return Promise.resolve(`Allows you to connect a Discord Role to a Role Type within my system!`)
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.CUSTOM
    }

    isCommandHidden(): boolean {
        return false
    }
    
}