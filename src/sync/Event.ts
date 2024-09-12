import { SyncObject } from "./SyncObject.js";

/**
 * Base class for event synchronization objects.
 */
export class Event extends SyncObject {
    #threadsToNofity;
    constructor(identifier: number, threadsToNotify: number | undefined) {
        super(identifier);
        this.#threadsToNofity = threadsToNotify;
    }
    /**
     * Signals the event.
     */
    signal() {
        Atomics.store(this.token, 0, 1);
        Atomics.notify(this.token, 0, this.#threadsToNofity);
    }
}
