export declare enum Action {
    RECAP = 0,
    SESSION = 1,
    SESSION_LIST = 2,
    PERSON = 3,
    PERSON_LIST = 4,
    LORE = 5,
    LORE_LIST = 6,
    PLACE = 7,
    PLACE_LIST = 8,
    CONTINUE = 9,
    HELP = 10,
    ADD = 11,
    NONE = 12
}
export interface Command {
    action: Action;
    args: string[];
}
export declare const parseArgs: (input: string) => Command;
