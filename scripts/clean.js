"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rimraf_1 = __importDefault(require("rimraf"));
console.log("==== PERFORMING CLEANUP ====");
rimraf_1.default.sync("tsconfig.tsbuildinfo");
rimraf_1.default.sync("packages/*/{tsconfig.tsbuildinfo,lib,dist,build,application-*}");
console.log("==== CLEANUP COMPLETE ====");
console.log("");
