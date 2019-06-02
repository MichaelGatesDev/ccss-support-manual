import { Building } from '../src/building';
import { BuildingUtils } from '../src/building-utils';
import { Room, SimpleRoom } from '../src/room';
import { RoomUtils } from '../src/room-utils';
import { StringUtils } from '../src/string-utils';

let building: Building = <Building>{
    officialName: "My Cool Building",
    internalName: StringUtils.internalize("My Cool Building"),
    nicknames: ['my', 'cool', 'building', 'mcb'],
    rooms: []
};

let exampleRoom = {
    buildingName: building.internalName,
    number: "200",
    type: "example"
} as Room;

test('creates a room', () => {
    let createdRoom = {
        buildingName: building.internalName,
        number: "200",
        type: "example"
    } as Room;
    expect(createdRoom);
});

test('adds room to building', () => {
    // should add room
    expect(BuildingUtils.addRoom(building, exampleRoom));
});

test('does not add duplicate rooms', () => {
    // should not add duplicate room
    expect(BuildingUtils.addRoom(building, exampleRoom));
});

test('gets room via number', () => {
    // should have room with example room number
    expect(RoomUtils.getRoomByNumber(building, exampleRoom.number));
});

test('gets simplified version of room', () => {
    let simplified: SimpleRoom = new SimpleRoom(exampleRoom.buildingName, exampleRoom.number);
    // should have same building name
    expect(simplified.buildingName === exampleRoom.buildingName);
    // should have same number
    expect(simplified.roomNumber === exampleRoom.number);
});

test('removes from from building', () => {
    // should remove the example room
    expect(BuildingUtils.removeRoom(building, exampleRoom));
    // should not remove a room that it does not contain
    expect(!BuildingUtils.removeRoom(building, exampleRoom));
});