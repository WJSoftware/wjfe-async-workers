/**
 * Error class used by `CancellationSource.throwIfSignaled` to abort a worker thread's current work.
 */
export class TaskCancelledError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
};
