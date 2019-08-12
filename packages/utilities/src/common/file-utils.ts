import fs from "fs";

export class FileUtils {

    public static async createDirectory(path: string, recursive?: boolean): Promise<boolean> {
        const exists: boolean = await this.checkExists(path);
        if (exists) return false;
        try {
            await fs.promises.mkdir(path, { recursive: recursive });
            return true;
        } catch (error) {
            return false;
        }
    }

    public static async checkExists(path: string): Promise<boolean> {
        try {
            await fs.promises.access(path, fs.constants.R_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    public static async isDirectory(path: string): Promise<boolean> {
        try {
            const stat = await fs.promises.stat(path);
            return stat.isDirectory();
        } catch (error) {
            return false;
        }
    }

    public static async isFile(path: string): Promise<boolean> {
        try {
            const stat = await fs.promises.stat(path);
            return stat.isFile();
        } catch (error) {
            return false;
        }
    }

}