export class EnumUtils {

    public static normalizeString<TEnum>(enumObj: TEnum, str: string): string | undefined {
        str = str.toLowerCase().replace(/[\s\-\_]/g, "");
        const keys = (Object.keys(enumObj) as (keyof TEnum)[]).filter((k): boolean => typeof enumObj[k] !== "string");
        for (const key of keys) {
            const tempKey = key.toString().toLowerCase();
            if (str === tempKey) return key.toString();
        }
        return undefined;
    }

    public static parse<T>(type: T, str: string): T[keyof T] | undefined {
        const normalized = EnumUtils.normalizeString(type, str);
        if (normalized !== undefined) {
            const casted = str as keyof T;
            return type[casted];
        }
        return undefined;
    }

    public static isValidEnum<T>(type: T, str: string): boolean {
        const normalized = EnumUtils.normalizeString(type, str);
        return normalized !== undefined;
    }
}