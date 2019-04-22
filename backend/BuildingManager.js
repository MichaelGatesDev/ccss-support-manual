"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A utility class for managing buildings
 */
var BuildingManager = /** @class */ (function () {
    function BuildingManager() {
        this.buildings = [];
    }
    /**
     * Adds a building to the array
     * @param building Building to add
     */
    BuildingManager.prototype.addBuilding = function (building) {
        this.buildings.push(building);
    };
    /**
     * Removes a building from the array
     * @param building Building to remove
     */
    BuildingManager.prototype.removeBuilding = function (building) {
        var index = this.buildings.indexOf(building, 0);
        if (index > -1) {
            this.buildings.splice(index, 1);
        }
    };
    /**
     * Gets a building by the specified name
     * @param name The name of the building
     */
    BuildingManager.prototype.getBuildingByName = function (name) {
        for (var _i = 0, _a = this.buildings; _i < _a.length; _i++) {
            var building = _a[_i];
            if (building.hasName(name))
                return building;
        }
        return null;
    };
    /**
     * Gets all buildings
     */
    BuildingManager.prototype.getBuildings = function () {
        return this.buildings;
    };
    return BuildingManager;
}());
exports.BuildingManager = BuildingManager;
