import fs from "fs";
import { ConfigBase } from "./configuration";
import { FileUtils } from "../common";


export interface ConfigIOResult {
    wasCreated: boolean;
    loaded: ConfigBase;
}


export class ConfigUtils {

    public static async createIfNotExists<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<boolean> {
        if (FileUtils.checkExists(path)) return false;
        await new base(...baseArgs).save();
        return true;
    }

    public static async load<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<ConfigBase> {
        if (FileUtils.checkExists(path)) throw new Error(`Can not load configuration because it does not exist: ${path}`);
        const rawData = await fs.promises.readFile(path, {
            encoding: "utf8"
        });
        const data = JSON.parse(rawData);
        const deserialized: ConfigBase = new base(...baseArgs).deserialize(data);
        return deserialized;
    }

    public static async createIfNotExistsAndLoad<T extends ConfigBase>(path: string, base: { new(...args: any[]): T }, baseArgs: any[]): Promise<ConfigIOResult> {
        const wasCreated = await ConfigUtils.createIfNotExists(path, base, baseArgs);
        const loadedConfigBase = await ConfigUtils.load(path, base, baseArgs);
        return { wasCreated: wasCreated, loaded: loadedConfigBase };
    }
}