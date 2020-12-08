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
    Action[Action["LORE"] = 5] = "LORE";
    Action[Action["LORE_LIST"] = 6] = "LORE_LIST";
    Action[Action["PLACE"] = 7] = "PLACE";
    Action[Action["PLACE_LIST"] = 8] = "PLACE_LIST";
    Action[Action["CONTINUE"] = 9] = "CONTINUE";
    Action[Action["HELP"] = 10] = "HELP";
    Action[Action["ADD"] = 11] = "ADD";
    Action[Action["NONE"] = 12] = "NONE";
})(Action = exports.Action || (exports.Action = {}));
var parseArgs = function (input) {
    var _a = input.split(" "), actionString = _a[0], args = _a.slice(1);
    switch (actionString) {
        case "!recap":
        case "!last":
            return { action: Action.RECAP, args: args };
        case "!when":
        case "!session":
        case "!sessions":
        case "!sl":
        case "!sn":
            return {
                action: args.length ? Action.SESSION : Action.SESSION_LIST,
                args: args,
            };
        case "!who":
        case "!person":
        case "!people":
        case "!pe":
            return { action: args.length ? Action.PERSON : Action.PERSON_LIST, args: args };
        case "!what":
        case "!lore":
        case "!lo":
            return { action: args.length ? Action.LORE : Action.LORE_LIST, args: args };
        case "!where":
        case "!places":
        case "!place":
        case "!pl":
            return { action: args.length ? Action.PLACE : Action.PLACE_LIST, args: args };
        case "!...":
        case "!more":
            return { action: Action.CONTINUE, args: args };
        case "!add":
        case "!new":
            return { action: Action.ADD, args: args };
        case "!h":
        case "!how":
            return { action: Action.HELP, args: args };
        default:
            return { action: Action.NONE, args: args };
    }
};
exports.parseArgs = parseArgs;
//# sourceMappingURL=index.js.map