import * as Discord from 'discord.js'
import { PermissionLevel } from './types';
import * as Firestore from '@google-cloud/firestore';

export class Utilities {
    static getUserPermissionLevel(user: Discord.GuildMember, db: Firestore.Firestore): PermissionLevel {
        if(user.hasPermission("ADMINISTRATOR")) {
            return PermissionLevel.ADMIN
        }
        return PermissionLevel.EVERYONE
    }
}
