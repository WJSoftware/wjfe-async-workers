/**
 * Special message that is used to reject work item promises whenever the work item is cancelled.
 */
export class CancelledMessage {
    #cancelledBeforeStarted;
    constructor(cancelledBeforeStarted: boolean) {
        this.#cancelledBeforeStarted = cancelledBeforeStarted;
    }
    /**
     * Returns `true` if cancellation happened before the work item started, or `false` otherwise.
     */
    get cancelledBeforeStarted() {
        return this.#cancelledBeforeStarted;
    }
};
