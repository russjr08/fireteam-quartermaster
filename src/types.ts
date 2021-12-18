export enum RoleType {
    EVERYONE = "EVERYONE",
    SOFT_TRUSTED = "SOFT_TRUSTED",
    MAX_TRUSTED = "MAX_TRUSTED",
    MODERATOR = "MODERATOR",
    ADMIN = "ADMIN",
    DEVELOPER = "DEVELOPER",
    /**
     * Used if a command needs to perform its own permissions check,
     *  such as to bootstrap permissions for the rest of the bot!
     */
    CUSTOM = "CUSTOM"
}