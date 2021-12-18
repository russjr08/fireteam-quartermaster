import * as Discord from 'discord.js'
import { RoleType } from './types';
import * as Firestore from '@google-cloud/firestore';
import { firestore } from 'firebase';

export class Utilities {

    private static db = new Firestore.Firestore({
        projectId: process.env.FIREBASE_PROJECT_ID,
        keyFilename: 'firebase-auth.json'
    })

    static async setRoleAsType(guild: Discord.Snowflake, type: RoleType, roleID: String){
        var guildConfigRef = Utilities.db.doc(`guilds/${guild}`)

        if(!(await guildConfigRef.get()).exists) {
            await guildConfigRef.create({})
        }

        switch(type) {
            default:
                console.error(`Could not resolve role type from ${type}`)
                throw new Error(`Could not resolve role type from ${type}`)
            case RoleType.EVERYONE:
                await guildConfigRef.set({ "EVERYONE": roleID }, { merge: true })
                break
            case RoleType.SOFT_TRUSTED:
                await guildConfigRef.set({ "SOFT_TRUSTED": roleID }, { merge: true })
                break
            case RoleType.MAX_TRUSTED:
                await guildConfigRef.set({ "MAX_TRUSTED": roleID }, { merge: true })
                break
            case RoleType.MODERATOR:
                await guildConfigRef.set({ "MODERATOR": roleID }, { merge: true })
                break
            case RoleType.ADMIN:
                await guildConfigRef.set({ "ADMIN": roleID }, { merge: true })
                break
            case RoleType.DEVELOPER:
                await guildConfigRef.set({ "DEVELOPER": roleID }, { merge: true })
                break
        }        
        
    }

    static async getRoleFromType(guild: Discord.Guild, type: RoleType): Promise<String> {
        var guildConfigRef = Utilities.db.doc(`guilds/${guild.id}`)

        if(!(await guildConfigRef.get()).exists) {
            return "NONE"
        }

        var roleData = (await guildConfigRef.get()).data() as unknown as RoleTypeStructure

        var everyoneRoleId = guild.roles.everyone.id

        switch(type) {
            case RoleType.EVERYONE:
                return (roleData.EVERYONE == undefined ? everyoneRoleId : roleData.EVERYONE)
            case RoleType.SOFT_TRUSTED:
                return roleData.SOFT_TRUSTED
            case RoleType.MAX_TRUSTED:
                return roleData.MAX_TRUSTED
            case RoleType.MODERATOR:
                return roleData.MODERATOR
            case RoleType.ADMIN:
                return roleData.ADMIN
            case RoleType.DEVELOPER:
                return roleData.DEVELOPER
            case RoleType.CUSTOM:
                return "CUSTOM"
        }
    }

    static async doesUserHaveRoleType(guild: Discord.Guild, type: RoleType, user: Discord.GuildMember): Promise<boolean> {
        var minRoleId = await this.getRoleFromType(guild, type)
        var role = guild.roles.cache.find(r => r.id == minRoleId)

        if(role == undefined) {
            return false
        }

        return user.roles.highest.comparePositionTo(role) >= 0
    }

    static async getUsersHighestRoleType(guild: Discord.Guild, user: Discord.GuildMember): Promise<RoleType> {
        if(await this.doesUserHaveRoleType(guild, RoleType.DEVELOPER, user)) {
            return RoleType.DEVELOPER
        } else if(await this.doesUserHaveRoleType(guild, RoleType.ADMIN, user)) {
            return RoleType.ADMIN
        } else if(await this.doesUserHaveRoleType(guild, RoleType.MODERATOR, user)) {
            return RoleType.MODERATOR
        } else if(await this.doesUserHaveRoleType(guild, RoleType.MAX_TRUSTED, user)) {
            return RoleType.MAX_TRUSTED
        } else if(await this.doesUserHaveRoleType(guild, RoleType.SOFT_TRUSTED, user)) {
            return RoleType.SOFT_TRUSTED
        } else if(await this.doesUserHaveRoleType(guild, RoleType.EVERYONE, user)) {
            return RoleType.EVERYONE
        } else {
            return RoleType.EVERYONE
        }
    }
    
}

interface RoleTypeStructure {
    EVERYONE: String
    SOFT_TRUSTED: String
    MAX_TRUSTED: String
    MODERATOR: String
    ADMIN: String
    DEVELOPER: String
}