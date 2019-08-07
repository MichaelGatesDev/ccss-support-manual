import { Classroom } from "./classroom";
import { TeachingStation } from "../equipment/teaching-station";
import { Audio } from "../equipment/audio";
import { Video } from "../equipment/video";

export interface SmartClassroom extends Classroom {

    teachingStation?: TeachingStation;

    audio?: Audio;

    video?: Video;
}


export class SmartClassroomFactory {

    private _room: Classroom;

    private _teachingStation?: TeachingStation;
    private _audio?: Audio;
    private _video?: Video;

    public constructor(room: Classroom) {
        this._room = room;
    }

    public withTeachingStation(station: TeachingStation): SmartClassroomFactory {
        this._teachingStation = station;
        return this;
    }

    public withAudio(audio: Audio): SmartClassroomFactory {
        this._audio = audio;
        return this;
    }

    public withVideo(video: Video): SmartClassroomFactory {
        this._video = video;
        return this;
    }

    public build(): SmartClassroom {
        return {
            ...this._room,
            teachingStation: this._teachingStation,
            audio: this._audio,
            video: this._video
        };
    }
}