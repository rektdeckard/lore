"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var Discord = __importStar(require("discord.js"));
var api_1 = __importDefault(require("./api"));
var parser_1 = require("./parser");
dotenv.config();
var TOKEN = process.env.TOKEN;
var bot = new Discord.Client();
bot.login(TOKEN);
bot.on("ready", function () {
    console.info("Logged in as " + bot.user.tag + "!");
});
bot.on("message", function (m) {
    // Bail early if no command
    if (!m.content.startsWith("!"))
        return;
    try {
        var _a = parser_1.parseArgs(m.content), action = _a.action, args = _a.args;
        switch (action) {
            case parser_1.Action.RECAP:
                m.reply(api_1.default.lastSession());
                break;
            case parser_1.Action.SESSION:
                m.reply(api_1.default.sessions(args[0]));
                break;
            case parser_1.Action.SESSION_LIST:
                m.reply(api_1.default.sessions());
                break;
            case parser_1.Action.PERSON:
                m.reply(api_1.default.people(args[0]));
                break;
            case parser_1.Action.PERSON_LIST:
                m.reply(api_1.default.people());
                break;
            case parser_1.Action.LORE:
                m.reply(api_1.default.lore(args[0]));
                break;
            case parser_1.Action.LORE_LIST:
                m.reply(api_1.default.lore());
                break;
            case parser_1.Action.PLACE:
                m.reply(api_1.default.places(args[0]));
                break;
            case parser_1.Action.PLACE_LIST:
                m.reply(api_1.default.places());
                break;
            case parser_1.Action.ADD:
                break;
            case parser_1.Action.CONTINUE:
                m.reply(api_1.default.more());
                break;
            case parser_1.Action.NONE:
            default:
                break;
        }
    }
    catch (e) {
        m.reply(api_1.default.help());
    }
});
//# sourceMappingURL=index.js.map