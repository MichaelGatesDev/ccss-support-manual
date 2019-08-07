import fs from "fs";

export class FileUtils {

    public static async createDirectory(path: string, recursive?: boolean): Promise<boolean> {
        const exists: boolean = await this.checkExists(path);
        if (exists) return false;
        try {
            await fs.promises.mkdir(path, { recursive: recursive });
            return true;
        } catch (error) {
            console.error(`There was an error checking the creating the directory: ${path}`);
            return false;
        }
    }

    public static async checkExists(path: string): Promise<boolean> {
        try {
            await fs.promises.access(path, fs.constants.R_OK);
            return true;
        } catch (error) {
            console.error(`There was an error checking the existence of a file/directory: ${path}`);
            return false;
        }
    }

    public static async isDirectory(path: string): Promise<boolean> {
        try {
            const stat = await fs.promises.stat(path);
            return stat.isDirectory();
        } catch (error) {
            console.error(`There was an error checking if path is to a directory: ${path}`);
            return false;
        }
    }

    public static async isFile(path: string): Promise<boolean> {
        try {
            const stat = await fs.promises.stat(path);
            return stat.isFile();
        } catch (error) {
            console.error(`There was an error checking if path is to a file: ${path}`);
            return false;
        }
    }

}