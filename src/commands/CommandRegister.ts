import { ICommand } from '../interfaces';
import { RoleType } from '../types';
import { Message } from 'discord.js';
import * as Discord from 'discord.js';
import { Bot } from '../bot';
export default class CommandRegister implements ICommand {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {

        var name = "";

        for(var i = 0; i < args.length; i++) {
            if(i != args.length) {
                name += `${args[i]} `;
            } else {
                name += args[i];
            }
        }
        
        if(args.length == 0) {
            message.reply("You need to give me your Bungie Name!")
            this.bot.reactNegativeToMessage(message)
            return
        } else if (!this.isValidBungieName(name)) {
            message.reply("Hey, that's not a valid Bungie Name! Try that again, it should look something like 'Your Name#1234'")
            this.bot.reactNegativeToMessage(message)
            return
        }

        message.channel.startTyping()

        var userData = {
            bungie_name: name
        }
        var collection = this.bot.getDatabase().collection("players")
        var snapshot = await collection.doc(message.author.id).get()

        const embed = new Discord.MessageEmbed()
            .setColor("#00c0ff")
            .setTitle("Registration")
            .setAuthor(message.author.tag)
            .setDescription("Registration Details")
            .addField(`Bungie Name for ${message.member?.user.tag}`, userData.bungie_name, true)

        if(snapshot.exists) {
            // User already registered -- update registration
            await collection.doc(message.author.id).set(userData)
            message.reply("You were already registered, but I've gone ahead and updated that registration for you!")
            message.channel.send(embed)
        } else {
            await collection.doc(message.author.id).set(userData)
            message.reply("Thanks, you're all set now!")
            message.channel.send(embed)
        }

        this.bot.reactPositiveToMessage(message)
        message.channel.stopTyping()
        
    }

    public name(): string {
        return "register"
    }

    getHelpText(guild: Discord.Guild, user: Discord.GuildMember): Promise<string> {
        return Promise.resolve(`<${this.bot.COMMAND_PREFIX}register Bungie_Name#1234> Registers your Bungie Name with my database, note that Bungie_Name#1234 should be your Bungie Name, with the discriminator at the end (the #1234 part).`)
    }

    private isValidBungieName(name: string): boolean {
        var valid = false;
        var hashIndex = name.indexOf("#");

        if(hashIndex != -1) {
            var discrim = name.substring(hashIndex + 1);
            if(this.isNumber(discrim)) {
                if(this.numOfDigits(discrim) === 4) {
                    valid = true;
                }
            }
        }

        return valid
    }
    
    // https://stackoverflow.com/a/50376498/1391553
    private isNumber(value: string | number): boolean {
        return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
    }

    private numOfDigits(input: string) {
        var x = parseInt(input);
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    getRequiredPermissionLevel(): RoleType {
        return RoleType.EVERYONE
    }

    isCommandHidden(): boolean {
        return false
    }


}