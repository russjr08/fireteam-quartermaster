import { DiscordAPIError, Guild, GuildMember, Message } from "discord.js";
import { Bot } from "../bot";
import { ICommand } from "../interfaces";
import { RoleType } from "../types";
import { Utilities } from "../Utilities";

export default class CommandInstruct implements ICommand {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot
    }

    run(message: Message, args: string[]): void {
        throw new Error("Method not implemented.");
    }

    name(): string {
        return "instruct"
    }

    async getHelpText(guild: Guild, user: GuildMember): Promise<string> {
        console.log("Help called")
        return `Toggles voice mute of everyone in your voice channel who is not <@&${await Utilities.getRoleFromType(guild, RoleType.MAX_TRUSTED)}> or higher.`
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.MODERATOR
    }

    isCommandHidden(): boolean {
        return false
    }

    

}