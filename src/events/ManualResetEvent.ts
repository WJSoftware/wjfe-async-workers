import type { Token } from "../workers.js";
import { checkToken, Event } from "./Event.js";

const identifier = 0x01;
const checkData = [
    identifier,
    'manually-reset event',
    'a'
] as const;

/**
 * Synchronization event object that can be signalled on-demand whenever it is appropriate.
 * 
 * It is useful in cases where external control is the priority, such as pausing work.
 */
export class ManualResetEvent extends Event {
    constructor() {
        super(identifier);
    }
    /**
     * Signals the event, unblocking all threads that are waiting on it.  Use `reset()` to revert the signalled state.
     */
    signal(): void {
        super.signal();
        Atomics.notify(super.token, 0);
    }
    /**
     * Resets the token.
     */
    reset() {
        Atomics.store(super.token, 0, 0);
    }
    /**
     * Checks whether or not a manually-resettable event's token is in its signalled state.
     * 
     * This method may be used by worker threads in polling mode.
     * @param token Manually-resettable token to check.
     * @returns `true` if the token is signalled, or `false` otherwise.
     */
    static isSignalled(token: Token) {
        checkToken(token, ...checkData);
        return Atomics.load(token, 0) === 1;
    }
    /**
     * Waits on the specified manually-resettable token to be signalled.
     * 
     * Use this method to block a worker's thread for whatever reason.
     * @param token Manually-resettable token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signalled, `timed-out` when the specified timeout 
     * elapsed and the token did not signal, or `not-equal` if no wait took place.
     */
    static wait(token: Token, timeout?: number) {
        checkToken(token, ...checkData);
        return Atomics.wait(token, 0, 0, timeout);
    }
    /**
     * Asynchronously waits on the specified manually-resettable token to be signalled.
     * 
     * Use this method to stop the current work and release the worker thread (to pick up on new messages, perhaps).
     * @param token Manually-resettable token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signalled, `timed-out` when the specified timeout 
     * elapsed and the token did not signal, or `not-equal` if no wait took place.
     */
    static async waitAsync(token: Token, timeout?: number) {
        checkToken(token, ...checkData);
        const result = Atomics.waitAsync(token, 0, 0, timeout);
        return result.async ? await result.value : result.value;
    }
};
