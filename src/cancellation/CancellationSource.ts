import { ManualResetEvent } from "../events/ManualResetEvent.js";
import type { Token } from "../workers.js";
import { TaskCancelledError } from "./TaskCancelledError.js";

/**
 * Specialized synchronization event object for the purposes of signalling cancellation intent.
 */
export class CancellationSource extends ManualResetEvent {
    /**
     * Do not call.  Cancellation tokens cannot be reset.
     */
    reset(): void {
        throw new Error("Cancellation tokens cannot be reset.");
    }
    /**
     * Checks the given cancellation token and throws an instance of `TaskCancelledError` if the token is in its 
     * signalled state.
     * @param token Cancellation token to check.
     */
    static throwIfSignalled(token: Token | undefined) {
        if (!token) {
            return;
        }
        if (this.isSignalled(token)) {
            throw new TaskCancelledError();
        }
    }
};
