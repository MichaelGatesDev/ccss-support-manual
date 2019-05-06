import { Building } from '../src/Building';

let building: Building;
let buildingOfficialName = "My Cool Building";
let buildingNicknames: string[] = ['my', 'cool', 'building', 'mcb'];

test('creates a building', () => {
    building = new Building(
        buildingOfficialName,
        buildingNicknames
    );
    expect(building);
});

test('sets internal name', () => {
    // expect internal name
    expect(building.getInternalName() === buildingOfficialName.toLocaleLowerCase().replace(/\s/, '-'));
});

test('checks nicknames', () => {
    // expect amount of nicknames
    expect(building.getNicknames().length === buildingNicknames.length);
});

test('checks all names', () => {
    // expect [nick]name exists
    expect(building.hasName('mcb'));
});