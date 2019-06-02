import { Building } from '../src/building';
import { BuildingUtils } from '../src/building-utils';
import { StringUtils } from '../src/string-utils';

let building: Building;
let buildingOfficialName = "My Cool Building";
let buildingNicknames: string[] = ['my', 'cool', 'building', 'mcb'];

test('creates a building', () => {
    building = {
        officialName: buildingOfficialName,
        internalName: StringUtils.internalize(buildingOfficialName),
        nicknames: buildingNicknames
    } as Building;
    expect(building);
});

test('sets internal name', () => {
    // expect internal name
    expect(building.internalName === StringUtils.internalize(building.officialName));
});

test('checks nicknames', () => {
    // expect amount of nicknames
    expect(building.nicknames.length === buildingNicknames.length);
});

test('checks all names', () => {
    // expect [nick]name exists
    expect(BuildingUtils.hasName(building, 'mcb'));
});