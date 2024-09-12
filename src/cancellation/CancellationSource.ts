import { Event } from "../sync/Event.js";
import { cancellationSourceIdentityData } from "../sync/identifiers.js";
import { isSignaled } from "../sync/ManualResetEvent.js";
import type { Token } from "../workers.js";
import { TaskCancelledError } from "./TaskCancelledError.js";

/**
 * Specialized synchronization event object for the purposes of signalling cancellation intent.
 */
export class CancellationSource extends Event {
    constructor() {
        super(cancellationSourceIdentityData[0], undefined);
    }
    /**
     * Checks whether or not a cancellation source's token is in its signaled state.
     * 
     * This method may be used by worker threads in polling mode.
     * @param token Token to check.
     * @returns `true` if the token is signaled, or `false` otherwise.
     */
    static isSignaled(token: Token) {
        return isSignaled(cancellationSourceIdentityData, token);
    }
    /**
     * Checks the given cancellation token and throws an instance of `TaskCancelledError` if the token is in its 
     * signaled state.
     * @param token Cancellation token to check.
     */
    static throwIfSignaled(token: Token | undefined) {
        if (!token) {
            return;
        }
        if (this.isSignaled(token)) {
            throw new TaskCancelledError();
        }
    }
};
