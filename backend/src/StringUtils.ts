class StringUtils {

    public static RoomNumberPattern: RegExp = /[\d]{3}[A-Za-z]{0,1}/; //TODO make this configurable

    static isValidRoomNumber(number: string) {
        return StringUtils.RoomNumberPattern.test(number);
    }

    /**
     * Checks if a string is blank, null, or undefined
     * @param str The string to test
     */
    static isBlank(str: string) {
        return (!str || /^\s*$/.test(str));
    }

    /**
     * Capitalizes the first letter of each word
     * @param str The string to capitalize
     */
    static capitalizeFirstLetter(str: string) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }


    static parseBoolean(text: string): boolean {
        text = text.toLowerCase().trim()
        return text === "true" || text === "on" || text === "yes";
    }

}

export {
    StringUtils
}