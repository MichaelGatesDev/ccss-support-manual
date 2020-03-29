import { ConfigBase } from "cardboard-config";

export class TroubleshootingKeywords extends ConfigBase {
  public roomKeywords: string[] = [
    // lock type
    "lock",
    "locktype",
    "key",
    // capacity
    "capacity",
    "occupancy",
  ];
  public classroomKeywords: string[] = [
    // phone
    "phone",
    "telephone",
    "extension",
    "display",
    "speaker",
  ];
  public smartClassroomKeywords: string[] = [
    // teaching station
    "teachingstation",
    "teaching station",
    "ts",
    "teachingstationcomputer",
    "teaching station computer",
    "computer",
    "desktop",
    "machine",
    "operating system",
    "os",
    "webcam",
    // audio
    "audio",
    "dependent",
    "speakers",
    "sound",
    "speakertype",
    "speaker type",
    // video
    "output",
    "output type",
    "television",
    "tv",
    "projector",
    "overhead",
    "smartboard",
    "smart board",
    "monitor",
    "screen",
    "dvd",
    "bluray",
    "blu ray",
    "dvd player",
    "vcr",
    "vhs",
  ];
  public computerClassroomKeywords: string[] = [
    "computer",
    // printer
    "printer",
    "printing",
    "print",
  ];
}
