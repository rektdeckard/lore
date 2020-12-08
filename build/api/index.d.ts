export declare enum DocType {
    SESSION = 0,
    PERSON = 1,
    PLACE = 2,
    LORE = 3
}
declare const _default: {
    help: () => string;
    more: () => string;
    sessions: (numOrDate?: string | undefined) => string;
    lastSession: () => string;
    people: (name?: string | undefined) => string;
    places: (name?: string | undefined) => string;
    lore: (name?: string | undefined) => string;
};
export default _default;
