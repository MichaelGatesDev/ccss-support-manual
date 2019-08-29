import { Building, BuildingFactory } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { StringUtils } from "@michaelgatesdev/common";

let building: Building;
const buildingOfficialName = "My Cool Building";
const buildingNicknames: string[] = ["my", "cool", "building", "mcb"];

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
