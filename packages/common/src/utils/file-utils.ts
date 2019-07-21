import fs from "fs";

export class FileUtils {

    public static async createDirectory(path: string, recursive?: boolean): Promise<boolean> {

        const exists: boolean = await this.checkExists(path);
        if (exists) return false;

        try {
            fs.promises.mkdir(path, { recursive: recursive });
            return true;
        } catch (error) {
            console.error("There was an error creating the directory: " + path);
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

}