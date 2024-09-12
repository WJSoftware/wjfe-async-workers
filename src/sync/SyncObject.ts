import { Token } from "../workers";

/**
 * Base class for synchronization objects.
 */
export class SyncObject {
    #buffer;
    #array;
    /**
     * Initializes a new instance of this class.
     * @param identifier Token identifier value.  It is used to ensure that actions taken on the token are compatible 
     * with the synchronization object that created it.
     * @param initialValue Initial value to store in the shared array buffer's first slot.
     */
    constructor(identifier: number, initialValue: number = 0) {
        if (globalThis.crossOriginIsolated !== undefined && !crossOriginIsolated) {
            throw new Error('Cannot operate:  Cross origin is not isolated. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements for details.');
        }
        this.#buffer = new SharedArrayBuffer(8);
        this.#array = new Int32Array(this.#buffer);
        Atomics.store(this.#array, 1, identifier);
        Atomics.store(this.#array, 0, initialValue);
    }
    /**
     * Gets the synchronization object's token.
     */
    get token(): Token {
        return this.#array;
    }
};
