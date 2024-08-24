import { CancelledMessage } from "../cancellation/CancelledMessage";
import { WorkItemStatus } from "./AsyncWorker";
import { WorkItemInternal } from "./WorkItemInternal";

/**
 * Defines a work item object, which is the abstract representation of a worker's task.
 */
export class WorkItem<TResult> {
    #internal;
    constructor(internal: WorkItemInternal<TResult>) {
        this.#internal = internal;
    }
    /**
     * Gets the promise object that will resolve or reject once the work item completes, the work item is cancelled or 
     * the underlying web worker is terminated.
     */
    get promise() {
        return this.#internal.data.promise;
    }
    /**
     * Gets the work item's assigned identifier.  Useful for tracing and debugging.
     */
    get id() {
        return this.#internal.data.id;
    }
    /**
     * Gets the work item's current status.
     */
    get status() {
        return this.#internal.status;
    }
    /**
     * Attempts to cancel the work item.  A work item can only be cancelled if:
     * 
     * + It was queued using the `cancellable` queueing option.
     * + Its current status is `Enqueued`, meaning the work item hasn't started.
     * @returns `true` if any form of cancellation took place, or `false` otherwise.
     */
    cancel() {
        if (this.#internal.cancellationSource) {
            this.#internal.cancellationSource.signal();
        }
        if (this.status === WorkItemStatus.Enqueued) {
            this.#internal.data.reject(new CancelledMessage(true));
        }
        return this.#internal.cancellationSource || !this.#internal.disconnect;
    }
}
