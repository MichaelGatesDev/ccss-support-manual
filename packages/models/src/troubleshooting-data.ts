import { SimpleRoom } from "./room";

export interface TroubleshootingData {
  title: string;
  description: string;
  solution: string;
  types: string[];
  tags: string[];
  whitelistedRooms: SimpleRoom[];
  blacklistedRooms: SimpleRoom[];
}

export class TroubleshootingDataFactory {
  private _title = "";
  private _description = "";
  private _solution = "";
  private _types: string[] = [];
  private _tags: string[] = [];
  private _whitelistedRooms: SimpleRoom[] = [];
  private _blacklistedRooms: SimpleRoom[] = [];

  public withTitle(title: string): TroubleshootingDataFactory {
    this._title = title;
    return this;
  }

  public withDescription(description: string): TroubleshootingDataFactory {
    this._description = description;
    return this;
  }

  public withSolution(solution: string): TroubleshootingDataFactory {
    this._solution = solution;
    return this;
  }

  public withTypes(types: string[]): TroubleshootingDataFactory {
    this._types = types;
    return this;
  }

  public withTags(tags: string[]): TroubleshootingDataFactory {
    this._tags = tags;
    return this;
  }

  public withWhitelistedRooms(rooms: SimpleRoom[]): TroubleshootingDataFactory {
    this._whitelistedRooms = rooms;
    return this;
  }

  public withBlacklistedRooms(rooms: SimpleRoom[]): TroubleshootingDataFactory {
    this._blacklistedRooms = rooms;
    return this;
  }

  public build(): TroubleshootingData {
    return {
      title: this._title,
      description: this._description,
      solution: this._solution,
      types: this._types,
      tags: this._tags,
      whitelistedRooms: this._whitelistedRooms,
      blacklistedRooms: this._blacklistedRooms,
    };
  }
}
