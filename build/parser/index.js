"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = exports.Action = void 0;
var Action;
(function (Action) {
    Action[Action["RECAP"] = 0] = "RECAP";
    Action[Action["SESSION"] = 1] = "SESSION";
    Action[Action["SESSION_LIST"] = 2] = "SESSION_LIST";
    Action[Action["PERSON"] = 3] = "PERSON";
    Action[Action["PERSON_LIST"] = 4] = "PERSON_LIST";
    Action[Action["PLACE"] = 5] = "PLACE";
    Action[Action["PLACE_LIST"] = 6] = "PLACE_LIST";
    Action[Action["CONTINUE"] = 7] = "CONTINUE";
    Action[Action["ADD"] = 8] = "ADD";
    Action[Action["NONE"] = 9] = "NONE";
})(Action = exports.Action || (exports.Action = {}));
var parseArgs = function (input) {
    var _a = input.split(" "), actionString = _a[0], args = _a.slice(1);
    switch (actionString) {
        case "!recap":
        case "!last":
            return { action: Action.RECAP, args: args };
        case "!session":
        case "!sn":
            return { action: Action.SESSION, args: args };
        case "!when":
        case "!sessions":
        case "!sl":
            return { action: Action.SESSION_LIST, args: args };
        case "!person":
        case "!people":
        case "!who":
            return { action: args.length ? Action.PERSON : Action.PERSON_LIST, args: args };
        case "!pe":
            return { action: Action.PERSON_LIST, args: args };
        case "!place":
        case "!pn":
            return { action: Action.PLACE, args: args };
        case "!where":
        case "!places":
        case "!pl":
            return { action: Action.PLACE_LIST, args: args };
        case "!...":
        case "!more":
        case "!continue":
            return { action: Action.CONTINUE, args: args };
        case "!add":
        case "!new":
            return { action: Action.ADD, args: args };
        default:
            return { action: Action.NONE, args: args };
    }
};
exports.parseArgs = parseArgs;
//# sourceMappingURL=index.js.map