import type { Token } from "../types.js";
import { mutexIdentityData } from "./identifiers.js";
import { acquireSync, acquire, SemaphoreInternal, type Releaser } from "./Semaphore.js";

/**
 * Synchronization object that can be used to grant a single thread exclusive access to a resource or critical section.
 */
export class Mutex extends SemaphoreInternal {
    constructor(createDisabled: boolean = false) {
        super(mutexIdentityData[0], 1, createDisabled);
    }

    /**
     * Acquires exclusivity from the specified mutex's token.
     * 
     * **IMPORTANT**:  Acquiring a mutex halts other work.  Releasing the mutex by invoking the releaser function that 
     * this method returns is *imperative*.  Use a `try..finally` construct to make sure that the releaser function is 
     * always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = await Mutex.acquire(myMutexToken);
     * try {
     *     ...
     * }
     * finally {
     *     releaser();
     * }
     * ```
     * @param token Mutex token to be acquired.
     * @returns A releaser object that can and should be used for releasing the mutex.
     */
    static acquireSync(token: Token): Releaser;
    /**
     * Acquires exclusivity from the specified mutex's token.
     * 
     * **IMPORTANT**:  Acquiring a mutex halts other work.  Releasing the mutex by invoking the releaser function that 
     * this method returns is *imperative*.  Use a `try..finally` construct to make sure that the releaser function is 
     * always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = await Mutex.acquire(myMutexToken);
     * try {
     *     ...
     * }
     * finally {
     *     releaser();
     * }
     * ```
     * @param token Mutex token to be acquired.
     * @param timeout Timeout value in milliseconds to wait for acquisition.
     * @returns A releaser object that can and should be used for releasing the mutex, or the value `'timed-out'` if 
     * the mutex could not be acquired before the specified timeout time elapsed.
     */
    static acquireSync(token: Token, timeout: number): Releaser | "timed-out";
    static acquireSync(token: Token, timeout?: number) {
        return acquireSync(mutexIdentityData, token, timeout);
    }
    static acquire(token: Token, timeout?: number) {
        return acquire(mutexIdentityData, token, timeout);
    }
};
