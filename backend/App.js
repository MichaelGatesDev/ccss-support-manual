"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_errors_1 = __importDefault(require("http-errors"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var DataManager_1 = require("./DataManager");
// import config = require('./config');
// import gdriveDownloader = require('./gdrive-downloader');
var index_1 = __importDefault(require("./routes/index"));
var App = /** @class */ (function () {
    function App() {
        // ------------------------------------------------------ \\
        //              Configure express backend
        // ------------------------------------------------------ \\
        this.expressApp = express_1.default();
        this.dataManager = new DataManager_1.DataManager();
    }
    App.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Setup express stuff
                        console.debug("Setting up express server...");
                        this.setupExpress();
                        console.debug("Finished setting up express server.");
                        // Setup data
                        return [4 /*yield*/, this.dataManager.initialize()
                                .then(function () {
                                console.log("Finished initializing data");
                            }).catch(function (err) {
                                console.error("Failed to initialize data");
                                console.error(err);
                            })];
                    case 1:
                        // Setup data
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.setupExpress = function () {
        console.debug("Setting up views");
        this.setupViews();
        console.debug("Using dev logger");
        this.expressApp.use(morgan_1.default('dev'));
        console.debug("Setting up middleware");
        this.setupMiddleware();
        console.debug("Setting up static directories");
        this.expressApp.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.expressApp.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
        console.debug("Setting up routes");
        this.expressApp.use('/', index_1.default);
        console.debug("Setting up static files to serve");
        this.expressApp.use('*', function (req, res) { return res.sendFile(path_1.default.join(__dirname, 'build', 'index.html')); });
        console.debug("Setting up error handling");
        this.setupErrorHandling();
    };
    App.prototype.setupViews = function () {
        // view engine setup
        this.expressApp.set('views', path_1.default.join(__dirname, 'views'));
        this.expressApp.set('view engine', 'ejs');
    };
    App.prototype.setupMiddleware = function () {
        this.expressApp.use(express_1.default.json());
        this.expressApp.use(express_1.default.urlencoded({
            extended: false
        }));
        this.expressApp.use(cookie_parser_1.default());
    };
    App.prototype.setupErrorHandling = function () {
        //catch 404 and forward to error handler
        this.expressApp.use(function (req, res, next) {
            next(http_errors_1.default(404));
        });
        // development error handler
        // will print stacktrace
        if (this.expressApp.get('env') === 'development') {
            this.expressApp.use(function (err, req, res, next) {
                res.status(err['status'] || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        this.expressApp.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    };
    App.prototype.getDataManager = function () {
        return this.dataManager;
    };
    return App;
}());
var app = new App();
exports.app = app;
app.initialize();
exports.default = app.expressApp;
/*    // load primary(troubleshooting) spreadsheet
    console.log("Loading data from primary spreadsheet...");
    return dataHelper.loadPrimarySpreadsheet(appConfig.primarySpreadsheet);
  })
  // after we load data from the primary spreadsheet
  .then(function () {
    console.log("Finished loading data from primary spreadsheet");

    // load secondary(troubleshooting) spreadsheet
    console.log("Loading data from secondary spreadsheet...");
    return dataHelper.loadSecondarySpreadsheet(appConfig.secondarySpreadsheet);
  })
  // after we load data from the secondary (troubleshooting) spreadsheet
  .then(function () {
    console.log("Finished loading datafrom secondary spreadsheet");

    // load images
    console.log("Loading images...");
    return dataHelper.loadImages(appConfig.images_directory);
  })
  // load all images
  .then(function () {
    console.log("Loaded application images");
  })
  // catch any errors
  .catch(function (err) {
    console.log(err);
    process.exit();
    return;
  });
*/
// ------------------------------------------------------ \\
