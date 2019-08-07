import { DVDPlayer, DVDPlayerFactory } from "./dvd-player";
import { DeviceFactory, DeviceType } from "./device";

export interface Video {
    // videoDevices: Map<DeviceType, Device[]>;
    outputType?: VideoOutputType;
    dvdPlayer?: DVDPlayer;
}

export enum VideoOutputType {
    Television,
    Projector,
    Smartboard,
    Monitor,
    Other
}

export class VideoFactory {

    private _outputType: VideoOutputType = VideoOutputType.Other;
    private _dvdPlayer: DVDPlayer = new DVDPlayerFactory(new DeviceFactory().ofType(DeviceType.DVDPlayer).build()).build();

    public withOutputType(type: VideoOutputType): VideoFactory {
        this._outputType = type;
        return this;
    }

    public withDVDPlayer(player: DVDPlayer): VideoFactory {
        this._dvdPlayer = player;
        return this;
    }

    public build(): Video {
        return {
            outputType: this._outputType,
            dvdPlayer: this._dvdPlayer
        };
    }

}