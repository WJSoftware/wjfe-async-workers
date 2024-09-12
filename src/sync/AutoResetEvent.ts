import type { Token } from "../workers.js";
import { Event } from "./Event.js";
import { autoResetEventIdentityData, checkToken } from "./identifiers.js";

/**
 * Synchronization event object that automatically resets whenever a worker thread is unlocked by it.
 * 
 * It is useful to ensure that only one thread at a time runs at any given time.
 */
export class AutoResetEvent extends Event {
    constructor() {
        super(autoResetEventIdentityData[0], 1);
    }
    /**
     * Checks whether or not an auto-resettable event's token is in its signaled state.
     * 
     * Auto-reset events automatically reset when a thread is freed by it, so expect this function to only return 
     * `true` if the token has been signaled and there were no threads blocked by it.
     * @param token Token to check.
     * @returns `true` if the token is signaled, or `false` otherwise.
     */
    static isSignaled(token: Token) {
        checkToken(token, ...autoResetEventIdentityData);
        return Atomics.load(token, 0) === 1;
    }
    /**
     * Waits on the specified auto-resettable event's token to be signaled.
     * 
     * Use this method to block a worker's thread for whatever reason.
     * @param token Token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signaled while waiting on it, `'timed-out'` when the 
     * specified timeout elapsed and the token did not signal, or `'not-equal'` if no wait took place.
     */
    static wait(token: Token, timeout?: number) {
        checkToken(token, ...autoResetEventIdentityData);
        // Performance optimization:  Blind attempt.
        if (Atomics.compareExchange(token, 0, 1, 0) === 1) {
            return 'not-equal';
        }
        while (true) {
            const result = Atomics.wait(token, 0, 0, timeout);
            if (result === 'timed-out') {
                return result;
            }
            if (Atomics.compareExchange(token, 0, 1, 0) === 1) {
                return result;
            }
        }
    }
    /**
     * Asynchronously waits on the specified auto-reset token to be signaled.
     * 
     * Use this method to stop the current work and release the worker thread (to pick up on new messages, perhaps).
     * @param token Token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signaled while waiting on it, `'timed-out'` when the 
     * specified timeout elapsed and the token did not signal, or `'not-equal'` if no wait took place.
     */
    static async waitAsync(token: Token, timeout?: number) {
        checkToken(token, ...autoResetEventIdentityData);
        // Performance optimization:  Blind attempt.
        if (Atomics.compareExchange(token, 0, 1, 0) === 1) {
            return 'not-equal';
        }
        while (true) {
            const result = Atomics.waitAsync(token, 0, 0, timeout);
            const finalResult = result.async ? await result.value : result.value;
            if (finalResult === 'timed-out') {
                return finalResult;
            }
            if (Atomics.compareExchange(token, 0, 1, 0) === 1) {
                return finalResult;
            }
        }
    }
};
