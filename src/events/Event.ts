import type { Token } from "../workers";

export class Event {
    #buffer;
    #array;
    #identifier;
    constructor(identifier: number) {
        if (!crossOriginIsolated) {
            throw new Error('Cannot operate:  Cross origin is not isolated. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements for details.');
        }
        this.#buffer = new SharedArrayBuffer(8);
        this.#array = new Int32Array(this.#buffer);
        this.#identifier = identifier;
        Atomics.store(this.#array, 1, identifier);
    }
    /**
     * Gets the synchronization event's token.
     */
    get token(): Token {
        return this.#array;
    }
    /**
     * Signals the event.
     */
    signal() {
        Atomics.store(this.#array, 0, 1);
    }
};

/**
 * Ensures the given token is of the expected type by throwing an error if this is not the case.
 * @param token Token to check for.
 * @param identifier Token type identifier.
 * @param objectName Object name, used for constructing the error's message.
 * @param article Article for the object name, so the error's message is written in proper English.
 */
export function checkToken(token: Token, identifier: number, objectName: string, article: string) {
    if (Atomics.load(token, 1) !== identifier) {
        throw new Error(`The provided token is not that of ${article} ${objectName}.`);
    }
}
