interface Raid {

    /**
     * The name of the Raid.
     */
    getName(): String

    /**
     * "Advanced" mode in this case is whether the Raid has a corresponding Master/Prestige mode.
     */
    hasAdvancedMode(): Boolean

    /**
     * The newest Raid has a pinnacle drop for **all** encounters, any Raid that
     * is not the newest only has a pinnacle drop for the last encounter, if it's
     * the weekly rotator Raid.
     */
    isNewest(): Boolean

    /**
     * The recommended Power level of this Raid.
     */
    getRecommendedPower(): Number

}

class VaultOfGlass implements Raid {

    getName(): String {
        return "Vault of Glass"
    }

    hasAdvancedMode(): Boolean {
        return true
    }

    isNewest(): Boolean {
        return false
    }

    getRecommendedPower(): Number {
        return 1350
    }

}

class LastWish implements Raid {

    getName(): String {
        return "Last Wish"
    }

    hasAdvancedMode(): Boolean {
        return false
    }

    isNewest(): Boolean {
        return false
    }

    getRecommendedPower(): Number {
        return 1350
    }

}

class GardenOfSalvation implements Raid {

    getName(): String {
        return "Garden of Salvation"
    }

    hasAdvancedMode(): Boolean {
        return false
    }

    isNewest(): Boolean {
        return false
    }

    getRecommendedPower(): Number {
        return 1350
    }

}

class DeepStoneCrypt implements Raid {

    getName(): String {
        return "Deep Stone Crypt"
    }

    hasAdvancedMode(): Boolean {
        return false
    }

    isNewest(): Boolean {
        return false
    }

    getRecommendedPower(): Number {
        return 1350
    }

}

class VowOfTheDisciple implements Raid {

    getName(): String {
        return "Vow of the Disciple"
    }

    hasAdvancedMode(): Boolean {
        return true
    }

    isNewest(): Boolean {
        return false
    }

    getRecommendedPower(): Number {
        return 1520
    }

}

class KingsFall implements Raid {

    getName(): String {
        return "King's Fall"
    }

    hasAdvancedMode(): Boolean {
        return false
    }

    isNewest(): Boolean {
        return true
    }

    getRecommendedPower(): Number {
        return 1550
    }

}

export { Raid, VaultOfGlass, LastWish, GardenOfSalvation, DeepStoneCrypt, VowOfTheDisciple, KingsFall }