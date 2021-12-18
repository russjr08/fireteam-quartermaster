import { Message, Guild, GuildMember, TextChannel, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
import { ICommand } from "../interfaces";
import { RoleType } from "../types";

export default class CommandPurge implements ICommand {

    private bot: Bot

    constructor(bot: Bot) {
        this.bot = bot;
    }

    run(message: Message, args: string[]): void {
        if(args.length == 0) {
            message.reply("Please tell me how many messages you'd like to remove!");
            return;
        }

        message.channel.startTyping();
        var amountOfMessages = Number.parseInt(args[0]);
        (message.channel as TextChannel).bulkDelete(amountOfMessages).then((messages) => {
            var embed = new MessageEmbed();
            embed.setTitle("Request completed");
            embed.setDescription(`The Nine have granted your request, <@${message.author.id}>.\n**${messages.size} messages** have been removed from Time and Space!`)
            embed.setColor(this.bot.DEFAULT_EMBED_COLOR);
            message.channel.send(embed).then(message => this.bot.reactPositiveToMessage(message));
            message.channel.stopTyping();
        })
        
    }

    name(): string {
        return "purge";
    }

    async getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        return `Removes the last \`x\` amount of messages in the channel, such as ${this.bot.COMMAND_PREFIX}purge 5`
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.MAX_TRUSTED;
    }

    isCommandHidden(): boolean {
        return false
    }
    
}