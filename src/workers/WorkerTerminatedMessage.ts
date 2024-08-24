/**
 * Special message used to reject promises of workers that are terminated.
 */
export class WorkerTerminatedMessage {
    #id;
    constructor(id: number) {
        this.#id = id;
    }
    /**
     * Gets the work item's identifier the message was created for.
     */
    get id() {
        return this.#id;
    }
};
