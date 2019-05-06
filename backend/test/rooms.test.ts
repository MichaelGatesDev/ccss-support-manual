import { Building } from '../src/Building';
import { Room } from '../src/Room';

let building: Building = new Building(
    "My Cool Building",
    ['my', 'cool', 'building', 'mcb']
);

let exampleRoom: Room;
test('creates a room', () => {
    exampleRoom = new Room(
        building.getInternalName(), // building name
        "200", // number
        "example" // type
    );
    expect(exampleRoom);
});

test('adds room to building', () => {
    // should have no rooms
    expect(building.getRooms().length === 0);

    building.addRoom(exampleRoom);

    // should have 1 room
    expect(building.getRooms().length === 1);

    // should have room with example room number
    expect(building.getRoom(exampleRoom.getNumber()));
});

test('does not add duplicate rooms', () => {
    // should not add duplicate room
    expect(!building.addRoom(exampleRoom));
});


// test('gets simplified version', () => {
//     let room = new Room(
//         building.getInternalName(), // building name
//         "200", // number
//         "example" // type
//     );
// });
