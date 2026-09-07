import type { Token } from "../types.js";
import { checkToken, semaphoreIdentityData, type IdentifierData } from "./identifiers.js";
import { SyncObject } from "./SyncObject.js";

/**
 * Function used to release an acquired synchronization object.
 */
export type Releaser = () => void;

export class SemaphoreInternal extends SyncObject {
    #capacity;
    #disabled;
    #identifierData;
    constructor(identifierData: IdentifierData, capacity: number, createDisabled: boolean) {
        if (capacity <= 0 || !Number.isInteger(capacity)) {
            throw new Error("A semaphore's capacity can only be a positive integer.");
        }
        super(identifierData[0], createDisabled ? 0 : capacity);
        this.#capacity = capacity;
        this.#disabled = createDisabled;
        this.#identifierData = identifierData;
    }

    /**
     * Enables the synchronization object if it was created in a disabled state and hasn't been enabled yet.
     * @returns `true` if the synchronization object was disabled and got enabled, or `false` otherwise.
     */
    enable() {
        if (!this.#disabled) {
            return false;
        }
        this.#disabled = false;
        Atomics.store(this.token, 0, this.#capacity);
        Atomics.notify(this.token, 0);
        return true;
    }
    /**
     * Acquires exclusivity over the mutex or a slot in the semaphore.
     * 
     * **IMPORTANT**:  Acquiring a mutex or a semaphore slot halts other work.  Releasing the mutex or semaphore slot 
     * by invoking the releaser function that this method returns is *imperative*.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = myMutexOrSemaphore.acquireSync();
     * try {
     *     ...
     * }
     * finally {
     *     releaser();
     * }
     * ```
     * @returns A releaser function that can and should be used for releasing the mutex or semaphore slot.
     */
    acquireSync(): Releaser;
    /**
     * Acquires exclusivity over the mutex or a slot in the semaphore.
     * 
     * **IMPORTANT**:  Acquiring a mutex or a semaphore slot halts other work.  Releasing the mutex or semaphore slot 
     * by invoking the releaser function that this method returns is *imperative*.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = myMutexOrSemaphore.acquireSync(500);
     * if (releaser !== "timed-out") {
     *   try {
     *     ...
     *   }
     *   finally {
     *     releaser();
     *   }
     * }
     * ```
     * @param timeout Timeout value in milliseconds to wait for acquisition.
     * @returns A releaser function that can and should be used for releasing the mutex or semaphore slot, or the value
     * `'timed-out'` if the mutex or semaphore slot could not be acquired before the specified timeout time elapsed.
     */
    acquireSync(timeout: number): Releaser | "timed-out";
    acquireSync(timeout?: number) {
        return acquireSync(this.#identifierData, this.token, timeout);
    }
    /**
     * Asynchronously acquires exclusivity over the mutex or a slot in the semaphore.
     * 
     * **IMPORTANT**:  Acquiring a mutex or a semaphore slot halts other work.  Releasing the mutex or semaphore slot 
     * by invoking the releaser function that this method returns is *imperative*.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = await myMutexOrSemaphore.acquire();
     * try {
     *     ...
     * }
     * finally {
     *     releaser();
     * }
     * ```
     * @returns A releaser function that can and should be used for releasing the mutex or semaphore slot.
     */
    acquire(): Promise<Releaser>;
    /**
     * Asynchronously acquires exclusivity over the mutex or a slot in the semaphore.
     * 
     * **IMPORTANT**:  Acquiring a mutex or a semaphore slot halts other work.  Releasing the mutex or semaphore slot
     * by invoking the releaser function that this method returns is *imperative*.  Use a `try..finally` construct to
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = await myMutexOrSemaphore.acquire(500);
     * if (releaser !== "timed-out") {
     *   try {
     *     ...
     *   }
     *   finally {
     *     releaser();
     *   }
     * }
     * ```
     * @param timeout Timeout value in milliseconds to wait for acquisition.
     * A releaser function that can and should be used for releasing the mutex or semaphore slot, or the value 
     * `'timed-out'` if the mutex or semaphore slot could not be acquired before the specified timeout time elapsed.
     */
    acquire(timeout: number): Promise<"timed-out" | Releaser>;
    acquire(timeout?: number) {
        return acquire(this.#identifierData, this.token, timeout);
    }
};

function buildReleaser(token: Token) {
    let released = false;
    return (() => {
        if (released) {
            throw new Error('The semaphore has already been released and cannot be released again.');
        }
        Atomics.add(token, 0, 1);
        Atomics.notify(token, 0, 1);
        released = true;
    }) as Releaser;
}

export function acquireSync(identifierData: IdentifierData, token: Token, timeout?: number) {
    checkToken(token, ...identifierData);
    while (true) {
        const available = Atomics.load(token, 0);
        if (available === 0) {
            const waitResult = Atomics.wait(token, 0, 0, timeout);
            if (waitResult === 'timed-out') {
                return waitResult;
            }
        }
        else {
            if (Atomics.compareExchange(token, 0, available, available - 1) === available) {
                return buildReleaser(token);
            }
        }
    }
}

export async function acquire(identifierData: IdentifierData, token: Token, timeout?: number) {
    checkToken(token, ...identifierData);
    while (true) {
        const available = Atomics.load(token, 0);
        if (available === 0) {
            const waitResult = Atomics.waitAsync(token, 0, 0, timeout);
            let finalResult = waitResult.async ? await waitResult.value : waitResult.value;
            if (finalResult === 'timed-out') {
                return finalResult;
            }
        }
        else {
            if (Atomics.compareExchange(token, 0, available, available - 1) === available) {
                return buildReleaser(token);
            }
        }
    }
}

/**
 * Synchronization object that defines a maximum concurrency value (capacity).
 * 
 * Useful to throttle operations or similar work, such as limiting the number of simultaneous HTTP requests.
 */
export class Semaphore extends SemaphoreInternal {
    constructor(capacity: number, createDisabled: boolean = false) {
        super(semaphoreIdentityData, capacity, createDisabled);
    }
    /**
     * Acquires a slot from the specified semaphore's token.
     * 
     * **IMPORTANT**:  Acquiring reduces the semaphore's capacity.  It is *imperative* that the capacity is returned to 
     * the semaphore by invoking the releaser function that this method returns.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = Semaphore.acquireSync(mySemaphoreToken);
     * try {
     *   ...
     * }
     * finally {
     *   releaser();
     * }
     * ```
     * @param token Semaphore token to be acquired.
     * @returns A releaser object that can and should be used for releasing the semaphore.
     */
    static acquireSync(token: Token): Releaser;
    /**
     * Acquires a slot from the specified semaphore's token.
     * 
     * **IMPORTANT**:  Acquiring reduces the semaphore's capacity.  It is *imperative* that the capacity is returned to 
     * the semaphore by invoking the releaser function that this method returns.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = Semaphore.acquireSync(mySemaphoreToken);
     * if (releaser !== "timed-out") {
     *   try {
     *     ...
     *   }
     *   finally {
     *     releaser();
     *   }
     * }
     * ```
     * @param token Semaphore token to be acquired.
     * @param timeout Optional timeout value in milliseconds to wait for acquisition.
     * @returns A releaser object that can and should be used for releasing the semaphore, or the value `'timed-out'` 
     * if the semaphore could not be acquired before the specified timeout time elapsed.
     */
    static acquireSync(token: Token, timeout: number): 'timed-out' | Releaser;
    static acquireSync(token: Token, timeout?: number) {
        return acquireSync(semaphoreIdentityData, token, timeout);
    }

    /**
     * Asynchronously acquires a slot from the specified semaphore's token.
     * 
     * **IMPORTANT**:  Acquiring reduces the semaphore's capacity.  It is *imperative* that the capacity is returned to 
     * the semaphore by invoking the releaser function that this method returns.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = await Semaphore.acquire(mySemaphoreToken);
     * try {
     *   ...
     * }
     * finally {
     *   releaser();
     * }
     * ```
     * @param token Semaphore token to be acquired.
     * @returns A releaser object that can and should be used for releasing the semaphore.
     */
    static acquire(token: Token): Promise<Releaser>;
    /**
     * Asynchronously acquires a slot from the specified semaphore's token.
     * 
     * **IMPORTANT**:  Acquiring reduces the semaphore's capacity.  It is *imperative* that the capacity is returned to 
     * the semaphore by invoking the releaser function that this method returns.  Use a `try..finally` construct to 
     * make sure that the releaser function is always executed, even in the event of an error.
     * 
     * @example
     * ```typescript
     * const releaser = await Semaphore.acquire(mySemaphoreToken);
     * if (releaser !== "timed-out") {
     *   try {
     *     ...
     *   }
     *   finally {
     *     releaser();
     *   }
     * }
     * ```
     * @param token Semaphore token to be acquired.
     * @param timeout Timeout value in milliseconds to wait for acquisition.
     * @returns A releaser object that can and should be used for releasing the semaphore, or the value `'timed-out'` 
     * if the semaphore could not be acquired before the specified timeout time elapsed.
     */
    static acquire(token: Token, timeout: number): Promise<"timed-out" | Releaser>;
    static acquire(token: Token, timeout?: number) {
        return acquire(semaphoreIdentityData, token, timeout);
    }
}
