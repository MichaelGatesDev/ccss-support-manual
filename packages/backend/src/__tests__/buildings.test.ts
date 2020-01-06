import { StringUtils } from "@michaelgatesdev/common";
import _ from "lodash";

import { Building, BuildingFactory } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { BuildingManager } from "../building-manager";

const buildingManager = new BuildingManager();
let building: Building;
const buildingOfficialName = "My Cool Building";
const buildingNicknames: string[] = ["my", "cool", "building", "mcb"];

test("shouuld create a building", (): void => {
    building = new BuildingFactory()
        .withOfficialName(buildingOfficialName)
        .withInternalName(StringUtils.internalize(buildingOfficialName))
        .withNicknames(buildingNicknames)
        .build();
    expect(building).toBeDefined();
});

test("should set the building's internal name", (): void => {
    expect(building.internalName === StringUtils.internalize(building.officialName));
});

test("should validate the building's nicknames", (): void => {
    // expect amount of nicknames
    expect(building.nicknames.length === buildingNicknames.length);

    // expect random [nick]name exists
    const randomNick: string | undefined = _.sample(buildingNicknames);
    expect(randomNick).toBeDefined();
    expect(BuildingUtils.hasName(building, randomNick!));
});

test("should add the building to the building manager", () => {
    expect(buildingManager.getBuildingByName(building.internalName)).toBeUndefined();
    expect(buildingManager.addBuilding(building)).toBe(true);
    expect(buildingManager.getBuildingByName(building.internalName)).toBeDefined();
});

test("should not add duplicate buildings", () => {
    const clone = Object.assign<{}, Building>({}, building);
    expect(building).toEqual(clone);
    expect(buildingManager.addBuilding(clone)).toBe(false);
});

test("should remove building", () => {
    expect(buildingManager.removeBuilding(building)).toBe(true);
    expect(buildingManager.buildings.length).toBe(0);
});

test("should clear all buildings", () => {
    buildingManager.clear();
    expect(buildingManager.buildings.length).toBe(0);
});


test("should add multiple buildings", () => {
    const a = new BuildingFactory().withOfficialName("building a").build();
    const b = new BuildingFactory().withOfficialName("building b").build();
    const c = new BuildingFactory().withOfficialName("building c").build();
    buildingManager.addBuildings([a, b, c]);
    expect(buildingManager.buildings.length).toBe(3);
});
