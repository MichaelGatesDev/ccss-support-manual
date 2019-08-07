export class StringUtils {

    public static RoomNumberPattern: RegExp = /[\d]{3}[A-Za-z]{0,1}/; //TODO make this configurable

    public static isValidRoomNumber(number: string): boolean {
        return StringUtils.RoomNumberPattern.test(number);
    }

    /**
     * Checks if a string is blank, null, or undefined
     * @param str The string to test
     */
    public static isBlank(str: string): boolean {
        return (!str || /^\s*$/.test(str));
    }

    /**
     * Capitalizes the first letter of each word
     * @param str The string to capitalize
     */
    public static capitalizeFirstLetter(str: string): string {
        return str
            .toLowerCase()
            .split(" ")
            .map((word): string => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }


    public static parseBoolean(text: string): boolean {
        text = text.toLowerCase().trim();
        return text === "true" ||
            text === "on" ||
            text === "yes" ||
            text === "enabled" ||
            text === "active";
    }

    public static internalize(str: string): string {
        return str.toLowerCase().replace(/\s/g, "-");
    }

}