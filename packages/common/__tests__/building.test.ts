import { Building, BuildingFactory } from "../src/models/building";
import { StringUtils, BuildingUtils } from "../src/utils";

let building: Building;
let buildingOfficialName = "My Cool Building";
let buildingNicknames: string[] = ["my", "cool", "building", "mcb"];

test("creates a building", (): void => {

    building = new BuildingFactory()
        .withOfficialName(buildingOfficialName)
        .withInternalName(StringUtils.internalize(buildingOfficialName))
        .withNicknames(buildingNicknames)
        .build();

    expect(building);
});

test("sets internal name", (): void => {
    // expect internal name
    expect(building.internalName === StringUtils.internalize(building.officialName));
});

test("checks nicknames", (): void => {
    // expect amount of nicknames
    expect(building.nicknames.length === buildingNicknames.length);
});

test("checks all names", (): void => {
    // expect [nick]name exists
    expect(BuildingUtils.hasName(building, "mcb"));
});