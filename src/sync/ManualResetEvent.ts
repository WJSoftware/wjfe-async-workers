import type { Token } from "../types.js";
import { Event } from './Event.js';
import { checkToken, manualResetEventIdentityData, type IdentifierData } from "./identifiers.js";

export function isSignaled(identifierData: IdentifierData, token: Token) {
    checkToken(token, ...identifierData);
    return Atomics.load(token, 0) === 1;
}

export function waitSync(identifierData: IdentifierData, token: Token, timeout?: number) {
    checkToken(token, ...identifierData);
    return Atomics.wait(token, 0, 0, timeout);
}

export async function wait(identifierData: IdentifierData, token: Token, timeout?: number) {
    checkToken(token, ...identifierData);
    const result = Atomics.waitAsync(token, 0, 0, timeout);
    return result.async ? await result.value : result.value;
}

/**
 * Synchronization event object that can be signaled on-demand whenever it is appropriate.
 * 
 * It is useful in cases where external control is the priority, such as pausing work.
 */
export class ManualResetEvent extends Event {
    constructor() {
        super(manualResetEventIdentityData[0], undefined);
    }
    /**
     * Resets the token.
     */
    reset() {
        Atomics.store(super.token, 0, 0);
    }
    /**
     * Checks whether or not this manually-resettable event is in its signaled state.
     * @returns `true` if the event is signaled, or `false` otherwise.
     */
    isSignaled() {
        return ManualResetEvent.isSignaled(this.token);
    }
        /**
     * Waits on the specified manually-resettable event to be signaled.
     * @param timeout Maximum time to wait.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signaled while waiting on it, `'timed-out'` when the 
     * specified timeout elapsed and the token did not signal, or `'not-equal'` if no wait took place.
     */
    waitSync(timeout?: number) {
        return ManualResetEvent.waitSync(this.token, timeout);
    }
    /**
     * Asynchronously waits on the specified manually-resettable event to be signaled.
     * 
     * Use this method to stop the current work and release the thread.
     * @param timeout Maximum time to wait.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signaled while waiting on it, `'timed-out'` when the 
     * specified timeout elapsed and the token did not signal, or `'not-equal'` if no wait took place.
     */
    wait(timeout?: number) {
        return ManualResetEvent.wait(this.token, timeout);
    }
    /**
     * Checks whether or not a manually-resettable event's token is in its signaled state.
     * 
     * This method may be used by worker threads in polling mode.
     * @param token Token to check.
     * @returns `true` if the token is signaled, or `false` otherwise.
     */
    static isSignaled(token: Token) {
        return isSignaled(manualResetEventIdentityData, token);
    }
    /**
     * Waits on the specified manually-resettable token to be signaled.
     * 
     * Use this method to block a worker's thread for whatever reason.
     * @param token Token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signaled while waiting on it, `'timed-out'` when the 
     * specified timeout elapsed and the token did not signal, or `'not-equal'` if no wait took place.
     */
    static waitSync(token: Token, timeout?: number) {
        return waitSync(manualResetEventIdentityData, token, timeout);
    }
    /**
     * Asynchronously waits on the specified manually-resettable token to be signaled.
     * 
     * Use this method to stop the current work and release the worker thread (to pick up on new messages, perhaps).
     * @param token Token to wait on.
     * @param timeout Maximum time to wait on the token.  Don't specify a value to wait indefinitely.
     * @returns `'ok'` when the waiting is over because the token signaled while waiting on it, `'timed-out'` when the 
     * specified timeout elapsed and the token did not signal, or `'not-equal'` if no wait took place.
     */
    static wait(token: Token, timeout?: number) {
        return wait(manualResetEventIdentityData, token, timeout);
    }
};
