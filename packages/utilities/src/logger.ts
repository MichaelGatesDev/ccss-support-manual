import colors from "colors";

export enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Critical
}

const DEFAULT_COLOR: colors.Color = colors.reset;
const DEBUG_COLOR: colors.Color = colors.cyan;
const INFO_COLOR: colors.Color = colors.white;
const WARNING_COLOR: colors.Color = colors.yellow;
const ERROR_COLOR: colors.Color = colors.red;
const CRITICAL_COLOR: colors.Color = colors.red.bold;

export class Logger {


    private static doLog(color: colors.Color, level: LogLevel, message: string): void {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        console.log(`${color(`[${time}][${LogLevel[level].toString().toUpperCase()}]`)}: ${message}`);
    }

    public static log(level: LogLevel, message: string): void {
        switch (level) {
            default:
                Logger.default(message);
                break;
            case LogLevel.Debug:
                Logger.debug(message);
                break;
            case LogLevel.Info:
                Logger.info(message);
                break;
            case LogLevel.Warning:
                Logger.warning(message);
                break;
            case LogLevel.Error:
                Logger.error(message);
                break;
            case LogLevel.Critical:
                Logger.critical(message);
                break;
        }
    }

    public static default(message: string): void {
        this.doLog(DEFAULT_COLOR, LogLevel.Info, message);
    }

    public static debug(message: string): void {
        this.doLog(DEBUG_COLOR, LogLevel.Debug, message);
    }

    public static info(message: string): void {
        this.doLog(INFO_COLOR, LogLevel.Info, message);
    }

    public static warning(message: string): void {
        this.doLog(WARNING_COLOR, LogLevel.Warning, message);
    }

    public static error(message: string): void {
        this.doLog(ERROR_COLOR, LogLevel.Error, message);
    }

    public static critical(message: string): void {
        this.doLog(CRITICAL_COLOR, LogLevel.Critical, message);
    }
}