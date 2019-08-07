import fs from "fs";

interface Serializable<T> {
    deserialize(input: any): T;
}

export abstract class ConfigBase implements Serializable<ConfigBase> {

    public configPath: string;

    public constructor(configPath: string) {
        this.configPath = configPath;
    }

    public deserialize(input: any): ConfigBase {
        Object.keys(input).forEach((key): void => {
            this[key as keyof this] = input[key as keyof any];
        });
        return this;
    }

    public async save(): Promise<void> {
        // writes the file asynchronously with 4-spaced tabbing
        await fs.promises.writeFile(this.configPath, JSON.stringify(this, null, 4), null);
    }
}
