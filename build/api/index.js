"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocType = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var SESSIONS_PATH = path_1.default.join(__dirname, "../../src/content/sessions");
var PEOPLE_PATH = path_1.default.join(__dirname, "../../src/content/people");
var PLACES_PATH = path_1.default.join(__dirname, "../../src/content/places");
var LORE_PATH = path_1.default.join(__dirname, "../../src/content/lore");
var DocType;
(function (DocType) {
    DocType[DocType["SESSION"] = 0] = "SESSION";
    DocType[DocType["PERSON"] = 1] = "PERSON";
    DocType[DocType["PLACE"] = 2] = "PLACE";
    DocType[DocType["LORE"] = 3] = "LORE";
})(DocType = exports.DocType || (exports.DocType = {}));
var bookmark;
var markdown = function (data) { return "```md\n" + data + "\n```"; };
var help = function () { return "\n`!recap`: Show notes for the last game session.\n`!who [NAME]`: List people in the world. With `[NAME]`, show info for them.\n`!what [NAME]`: List elements of lore in the world. With `[NAME]`, show info for a specific one.\n`!where [NAME]`: List places in the world. With `[NAME]`, show info for a specific place.\n`!when [NUMBER]`: List game sessions by date. With `[NUMBER]`, show info for that session.\n"; };
var read = function (path, page) {
    if (page === void 0) { page = 0; }
    var file = fs_1.default.readFileSync(path).toString("utf-8");
    var thisPage = page * 1000;
    var nextPage = thisPage + 1000;
    var hasNextPage = file.length >= nextPage;
    if (hasNextPage) {
        bookmark = { path: path, page: page + 1 };
        return markdown(file.slice(thisPage, nextPage) + "...");
    }
    else {
        bookmark = null;
        return markdown(file.slice(thisPage));
    }
};
var more = function () {
    if (bookmark) {
        return read(bookmark.path, bookmark.page);
    }
    else {
        return markdown("Nothing left to read.");
    }
};
var list = function (docPath, sorter) {
    try {
        var documents = fs_1.default
            .readdirSync(docPath)
            .sort(sorter)
            .map(function (docName, i) { return i + 1 + ". " + docName; });
        return markdown(documents.toString().replace(/\.md/g, "").replace(/,/g, "\n"));
    }
    catch (e) {
        return markdown(e.message);
    }
};
var show = function (name, docPath) {
    try {
        var documents = fs_1.default.readdirSync(docPath);
        var match = documents.filter(function (docName) {
            return docName.toLowerCase().includes(name);
        });
        if (!match.length)
            return markdown("Could not find **" + name + "**");
        return read(path_1.default.join(docPath, match[0]));
    }
    catch (e) {
        return markdown(e.message);
    }
};
var sessions = function (numOrDate) {
    var _a;
    var sorter = function (a, b) {
        return new Date(a.split(".")[0]).getTime() - new Date(b.split(".")[0]).getTime();
    };
    if (!numOrDate)
        return list(SESSIONS_PATH, sorter);
    try {
        var num = numOrDate ? parseInt(numOrDate) - 1 : 0;
        var sessions_1 = fs_1.default.readdirSync(SESSIONS_PATH).sort(sorter);
        var session = (_a = sessions_1[num !== null && num !== void 0 ? num : sessions_1.length - 1]) !== null && _a !== void 0 ? _a : "";
        return read(path_1.default.join(SESSIONS_PATH, session));
    }
    catch (e) {
        return markdown(e.message);
    }
};
var lastSession = function () {
    try {
        var last = fs_1.default
            .readdirSync(SESSIONS_PATH)
            .sort(function (a, b) {
            return new Date(b.split(".")[0]).getTime() -
                new Date(a.split(".")[0]).getTime();
        })[0];
        return read(path_1.default.join(SESSIONS_PATH, last));
    }
    catch (e) {
        return markdown(e.message);
    }
};
var people = function (name) {
    if (name)
        return show(name, PEOPLE_PATH);
    var sorter = function (a, b) { return a.localeCompare(b); };
    return list(PEOPLE_PATH, sorter);
};
var places = function (name) {
    if (name)
        return show(name, PLACES_PATH);
    var sorter = function (a, b) { return a.localeCompare(b); };
    return list(PLACES_PATH, sorter);
};
var lore = function (name) {
    if (name)
        return show(name, LORE_PATH);
    var sorter = function (a, b) { return a.localeCompare(b); };
    return list(LORE_PATH, sorter);
};
exports.default = { help: help, more: more, sessions: sessions, lastSession: lastSession, people: people, places: places, lore: lore };
//# sourceMappingURL=index.js.map