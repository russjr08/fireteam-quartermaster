import { ICommand } from '../interfaces';
import { Message } from 'discord.js';
import * as Discord from 'discord.js';
import { Bot } from '../bot';
export default class CommandRegister implements ICommand {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot
    }

    public async run(message: Message, args: string[]) {
        
        if(args.length == 0) {
            message.reply("You need to give me your Steam ID!")
            this.bot.reactNegativeToMessage(message)
            return
        } else if (!this.isNumber(args[0])) {
            message.reply("Hey, that's not a Steam ID! Try that again.")
            this.bot.reactNegativeToMessage(message)
            return
        } else {
            this.bot.reactPositiveToMessage(message)
        }

        var userData = {
            steam_id: args[0]
        }
        var collection = this.bot.getDatabase().collection("players")
        var snapshot = await collection.doc(message.author.id).get()

        const embed = new Discord.MessageEmbed()
            .setColor("#00c0ff")
            .setTitle("Registration")
            .setAuthor(message.author.tag)
            .setDescription("Registration Details")
            .addField(`Steam ID for ${message.member?.user.tag}`, userData.steam_id, true)

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
        
    }

    public name(): string {
        return "register"
    }

    
    // https://stackoverflow.com/a/50376498/1391553
    private isNumber(value: string | number): boolean {
        return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
    }



}