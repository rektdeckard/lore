"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var SESSIONS_PATH = path_1.default.join(__dirname, "../../src/content/sessions");
var PEOPLE_PATH = path_1.default.join(__dirname, "../../src/content/people");
var PLACES_PATH = path_1.default.join(__dirname, "../../src/content/places");
var bookmark;
var backtickify = function (data) { return "```md\n" + data + "\n```"; };
var help = function () {
    return backtickify("\nUSAGE: !sb [CATEGORY] QUERY\n");
};
var read = function (path, page) {
    if (page === void 0) { page = 0; }
    var file = fs_1.default.readFileSync(path).toString("utf-8");
    var thisPage = page * 1000;
    var nextPage = thisPage + 1000;
    var hasNextPage = file.length >= nextPage;
    if (hasNextPage) {
        bookmark = { path: path, page: page + 1 };
        return backtickify(file.slice(thisPage, nextPage) + "...");
    }
    else {
        bookmark = null;
        return backtickify(file.slice(thisPage));
    }
};
var more = function () {
    if (bookmark) {
        return read(bookmark.path, bookmark.page);
    }
    else {
        return backtickify("Nothing left to continue.");
    }
};
// const list = (path: pathLike): string => {
// }
var session = function (numOrDate) {
    var _a;
    try {
        var num = numOrDate ? parseInt(numOrDate) - 1 : 0;
        var sessions_1 = fs_1.default
            .readdirSync(SESSIONS_PATH)
            .sort(function (a, b) {
            return new Date(a.split(".")[0]).getTime() -
                new Date(b.split(".")[0]).getTime();
        });
        var session_1 = (_a = sessions_1[num || sessions_1.length - 1]) !== null && _a !== void 0 ? _a : "";
        console.log(sessions_1, num, session_1);
        return read(path_1.default.join(SESSIONS_PATH, session_1));
    }
    catch (e) {
        return backtickify(e.message);
    }
};
var sessions = function () {
    try {
        var sessions_2 = fs_1.default.readdirSync(SESSIONS_PATH);
        var sorted = sessions_2
            .sort(function (a, b) {
            return new Date(a.split(".")[0]).getTime() -
                new Date(b.split(".")[0]).getTime();
        })
            .map(function (s, i) { return i + 1 + ". " + s; });
        return backtickify(sorted.toString().replace(/,/g, "\n"));
    }
    catch (e) {
        return backtickify(e.message);
    }
};
var person = function (name) {
    try {
        var people_1 = fs_1.default.readdirSync(PEOPLE_PATH);
        var match = people_1.filter(function (person) {
            return person.toLowerCase().includes(name);
        });
        if (!match.length) {
            return backtickify("Could not find **" + name + "**");
        }
        return read(path_1.default.join(PEOPLE_PATH, match[0]));
    }
    catch (e) {
        return backtickify(e.message);
    }
};
var people = function () {
    try {
        var sessions_3 = fs_1.default.readdirSync(PEOPLE_PATH);
        var sorted = sessions_3
            .sort(function (a, b) { return a.localeCompare(b); })
            .map(function (s, i) { return i + 1 + ". " + s; });
        return backtickify(sorted.toString().replace(",", "\n"));
    }
    catch (e) {
        return backtickify(e.message);
    }
};
var place = function (name) {
    try {
        var places_1 = fs_1.default.readdirSync(PLACES_PATH);
        var match = places_1.filter(function (place) { return place.toLowerCase().includes(name); });
        if (!match.length) {
            return backtickify("Could not find **" + name + "**");
        }
        return read(path_1.default.join(PLACES_PATH, match[0]));
    }
    catch (e) {
        return backtickify(e.message);
    }
};
var places = function () {
    try {
        var places_2 = fs_1.default.readdirSync(PLACES_PATH);
        var sorted = places_2
            .sort(function (a, b) { return a.localeCompare(b); })
            .map(function (s, i) { return i + 1 + ". " + s; });
        return backtickify(sorted.toString().replace(",", "\n"));
    }
    catch (e) {
        return backtickify(e.message);
    }
};
exports.default = { help: help, more: more, session: session, sessions: sessions, person: person, people: people, place: place, places: places };
//# sourceMappingURL=index.js.map