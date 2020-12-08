export declare enum Action {
    RECAP = 0,
    SESSION = 1,
    SESSION_LIST = 2,
    PERSON = 3,
    PERSON_LIST = 4,
    PLACE = 5,
    PLACE_LIST = 6,
    CONTINUE = 7,
    ADD = 8,
    NONE = 9
}
export interface Command {
    action: Action;
    args: string[];
}
export declare const parseArgs: (input: string) => Command;
