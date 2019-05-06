import { Building } from '../src/Building';
import { Room, SimpleRoom } from '../src/Room';

let building: Building = new Building(
    "My Cool Building",
    ['my', 'cool', 'building', 'mcb']
);

let exampleRoom = new Room(
    building.getInternalName(), // building name
    "200", // number
    "example" // type
);

test('creates a room', () => {
    let createdRoom = new Room(
        building.getInternalName(), // building name
        "200", // number
        "example" // type
    );
    expect(createdRoom);
});

test('adds room to building', () => {
    // should add room
    expect(building.addRoom(exampleRoom));
});

test('does not add duplicate rooms', () => {
    // should not add duplicate room
    expect(!building.addRoom(exampleRoom));
});

test('gets room via number', () => {
    // should have room with example room number
    expect(building.getRoom(exampleRoom.getNumber()));
});

test('gets simplified version of room', () => {
    let simplified: SimpleRoom = exampleRoom.getSimplified();
    // should have same building name
    expect(simplified.getBuildingName() === exampleRoom.getBuildingName());
    // should have same number
    expect(simplified.getRoomNumber() === exampleRoom.getNumber());
});

test('removes from from building', () => {
    // should remove the example room
    expect(building.removeRoom(exampleRoom));
    // should not remove a room that it does not contain
    expect(!building.removeRoom(exampleRoom));
});