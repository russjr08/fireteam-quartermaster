import { Message, Guild, GuildMember, MessageEmbed } from "discord.js";
import { Bot } from "../bot";
import { ICommand } from "../interfaces";
import { RoleType } from "../types";
import { Utilities } from "../Utilities";

export default class CommandRaidVote implements ICommand {

    bot: Bot
    voteChoiceEmotes = new Array<string>();

    constructor(bot: Bot) {
        this.bot = bot
        this.voteChoiceEmotes.push("1️⃣")
        this.voteChoiceEmotes.push("2️⃣")
        this.voteChoiceEmotes.push("3️⃣")
        this.voteChoiceEmotes.push("4️⃣")
        this.voteChoiceEmotes.push("5️⃣")
        this.voteChoiceEmotes.push("6️⃣")
        this.voteChoiceEmotes.push("7️⃣")
        this.voteChoiceEmotes.push("8️⃣")
        this.voteChoiceEmotes.push("9️⃣")
    }

    run(message: Message, args: string[]): void {
        const raids = this.bot.getAvailableRaids()
        const text = `<@${message.author.id}> has started a Raid Vote! Vote on a Raid that you'd like to do!`;
        Utilities.sendRaidVote(message.channel, raids, this.bot.DEFAULT_EMBED_COLOR, text)
    }

    name(): string {
        return "raidvote"
    }

    getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        return Promise.resolve("Initiates a vote selection on a Raid for Guardians to run!")
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }
    
}