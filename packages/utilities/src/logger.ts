import colors from "colors";

export enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Critical
}

export class Logger {

    public static log(level: LogLevel, message: string): void {
        let prefix = "[{level}]";
        let color: colors.Color | undefined;

        prefix = prefix.replace("{level}", LogLevel[level].toString());
        switch (level) {
            default:
                color = colors.reset;
                break;
            case LogLevel.Debug:
                color = colors.cyan;
                break;
            case LogLevel.Info:
                color = colors.white;
                break;
            case LogLevel.Warning:
                color = colors.yellow;
                break;
            case LogLevel.Error:
                color = colors.red;
                break;
            case LogLevel.Critical:
                color = colors.red.bold;
                break;
        }

        console.log(`${color(prefix)} ${message}`);
    }
}