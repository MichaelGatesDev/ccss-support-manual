import fs from "fs";
import { ConfigBase } from "./configuration";


interface ConfigResult {
    wasCreated: boolean;
    loaded: ConfigBase;
}


export class ConfigUtils {

    public static async createIfNotExists<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<boolean> {
        try {
            await fs.promises.access(path, fs.constants.W_OK);
            return false;
        } catch (error) {
            try {
                await new base(...baseArgs).save();
                return true;
            } catch (error) {
                throw error;
            }
        }
    }

    public static async load<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<ConfigBase> {
        try {
            await fs.promises.access(path, fs.constants.R_OK);
            const rawData = await fs.promises.readFile(path, {
                encoding: "utf8"
            });
            const data = JSON.parse(rawData);
            const deserialized: ConfigBase = new base(...baseArgs).deserialize(data);
            return deserialized;
        } catch (error) {
            throw error;
        }
    }

    public static async createIfNotExistsAndLoad<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<ConfigResult> {
        const wasCreated = await ConfigUtils.createIfNotExists(path, base, baseArgs);
        const loadedConfigBase = await ConfigUtils.load(path, base, baseArgs);
        return { wasCreated: wasCreated, loaded: loadedConfigBase };
    }
}