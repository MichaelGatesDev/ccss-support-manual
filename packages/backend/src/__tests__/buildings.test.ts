import { Building } from "@ccss-support-manual/models";
import { BuildingUtils } from "@ccss-support-manual/utilities";

import { app } from "../app";

let building = BuildingUtils.exampleBuilding;

test("should add the building to the building manager", () => {
  expect(app.buildingManager.getBuildingByName(building.name)).toBeUndefined();
  expect(app.buildingManager.addBuilding(building)).toBe(true);
  expect(app.buildingManager.getBuildingByName(building.name)).toBeDefined();
});

test("should not add duplicate buildings", () => {
  const clone = Object.assign<{}, Building>({}, building);
  expect(building).toEqual(clone);
  expect(app.buildingManager.addBuilding(clone)).toBe(false);
});

test("should remove building", () => {
  expect(app.buildingManager.removeBuilding(building)).toBe(true);
  expect(app.buildingManager.buildings.length).toBe(0);
});

test("should clear all buildings", () => {
  app.buildingManager.clear();
  expect(app.buildingManager.buildings.length).toBe(0);
});

test("should add multiple buildings", () => {
  const a = { name: "building a" } as Building;
  const b = { name: "building b" } as Building;
  const c = { name: "building c" } as Building;
  app.buildingManager.addBuildings([a, b, c]);
  expect(app.buildingManager.buildings.length).toBe(3);
});
