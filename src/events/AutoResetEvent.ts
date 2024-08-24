import type { Token } from "../workers.js";
import { checkToken, Event } from "./Event.js";

const identifier = 0x02;
const checkData = [
    identifier,
    'automatically-reset event',
    'an'
] as const;

/**
 * Synchronization event object that automatically resets whenever a worker thread is unlocked by it.
 * 
 * It is useful to ensure that only one thread at a time runs at any given time.
 */
export class AutoResetEvent extends Event {
    constructor() {
        super(identifier);
    }

    /**
     * Signals the event, unblocking at most one blocked thread.
     */
    signal(): void {
        super.signal();
        Atomics.notify(super.token, 0, 1);
    }
    /**
     * Checks whether or not an auto-resettable event's token is in its signalled state.
     * 
     * Auto-reset events automatically reset when a thread is freed by it, so expect this function to only return 
     * `true` if the token has been signalled and there were no threads blocked by it.
     * @param token Auto-resettable token to check.
     * @returns `true` if the token is signalled, or `false` otherwise.
     */
    static isSignalled(token: Token) {
        checkToken(token, ...checkData);
        return Atomics.load(token, 0) === 1;
    }
    /**
     * Waits on the specified auto-resettable token to be signalled.
     * 
     * Use this method to block a worker's thread for whatever reason.
     * @param token Auto-reset token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signalled, `timed-out` when the specified timeout 
     * elapsed and the token did not signal, or `not-equal` if no wait took place (which should not happen for 
     * auto-reset events).
     */
    static wait(token: Token, timeout?: number) {
        checkToken(token, ...checkData);
        const result = Atomics.wait(token, 0, 0, timeout);
        if (result === 'ok') {
            Atomics.store(token, 0, 0);
        }
        return result;
    }
    /**
     * Asynchronously waits on the specified auto-reset token to be signalled.
     * 
     * Use this method to stop the current work and release the worker thread (to pick up on new messages, perhaps).
     * @param token Auto-reset token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signalled, `timed-out` when the specified timeout 
     * elapsed and the token did not signal, or `not-equal` if no wait took place (which should not happen for 
     * auto-reset events).
     */
    static async waitAsync(token: Token, timeout?: number) {
        checkToken(token, ...checkData);
        const result = Atomics.waitAsync(token, 0, 0, timeout);
        const finalResult = result.async ? await result.value : result.value;
        if (finalResult !== 'timed-out') {
            Atomics.store(token, 0, 0);
        }
        return finalResult;
    }
};
