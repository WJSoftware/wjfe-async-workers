import Worker from "web-worker";
import type { Token } from "../../../src/types.js";
import { SyncObject } from "../../../src/sync/SyncObject.js";
import { expect, vi } from "vitest";

/**
 * Creates a worker to test blocking Atomics.wait operations.
 * This allows testing the actual ManualResetEvent.wait and AutoResetEvent.wait methods.
 */
export function createWorkerForWaitTesting(
    sharedBuffer: Token,
    waitFunction: "ManualResetEvent.wait" | "AutoResetEvent.wait",
    timeout?: number,
) {
    const { promise, resolve, reject } = createPromise<{
        wait: Promise<"ok" | "timed-out" | "not-equal">;
    }>();
    const {
        promise: waitPromise,
        resolve: waitResolve,
        reject: waitReject,
    } = createPromise<"ok" | "timed-out" | "not-equal">();
    const workerURL = new URL("./test-wait-worker.ts", import.meta.url);
    const worker = new Worker(workerURL, { type: "module" });

    const cleanup = () => {
        try {
            worker.terminate();
        } catch (e) {
            // Ignore cleanup errors
        }
    };

    worker.onmessage = (event) => {
        if (event.data === "running") {
            resolve({ wait: waitPromise });
            return;
        }
        cleanup();
        const { success, result, error } = event.data;
        if (success) {
            waitResolve(result);
        } else {
            waitReject(new Error(error));
        }
    };

    worker.onerror = (error) => {
        cleanup();
        waitReject(error);
    };

    // Send the shared buffer and parameters to the worker
    worker.postMessage({ sharedBuffer, waitFunction, timeout });
    return promise;
}

/**
 * Helper to test ManualResetEvent.wait in a worker thread
 */
export function testManualResetEventWaitInWorker(
    token: Token,
    timeout?: number,
) {
    return createWorkerForWaitTesting(token, "ManualResetEvent.wait", timeout);
}

/**
 * Helper to test AutoResetEvent.wait in a worker thread
 */
export function testAutoResetEventWaitInWorker(token: Token, timeout?: number) {
    return createWorkerForWaitTesting(token, "AutoResetEvent.wait", timeout);
}

export function createWorkerForAcquireTesting(
    source: "Mutex" | "Semaphore",
    token: Token,
    timeout?: number,
) {
    const { promise, resolve, reject } = createPromise<{
        wait: Promise<{ success: boolean }>;
    }>();
    const {
        promise: waitPromise,
        resolve: waitResolve,
        reject: waitReject,
    } = createPromise<{ success: boolean }>();
    const workerURL = new URL("./test-acquire-worker.ts", import.meta.url);
    const worker = new Worker(workerURL, { type: "module" });

    const cleanup = () => {
        try {
            worker.terminate();
        } catch (e) {
            // Ignore cleanup errors
        }
    };

    worker.onmessage = (event) => {
        if (event.data === "running") {
            resolve({ wait: waitPromise });
            return;
        }
        cleanup();
        const { success, error } = event.data;
        if (error === undefined) {
            waitResolve({ success });
        } else {
            waitReject(new Error(error));
        }
    };

    worker.onerror = (error) => {
        cleanup();
        waitReject(error);
    };

    worker.postMessage({ source, token, timeout });
    return promise;
}

export function testMutexAcquireInWorker(token: Token, timeout?: number) {
    return createWorkerForAcquireTesting("Mutex", token, timeout);
}

export function testSemaphoreAcquireInWorker(token: Token, timeout?: number) {
    return createWorkerForAcquireTesting("Semaphore", token, timeout);
}

export function delay(time: number = 0) {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}

export function createPromise<T = void>() {
    let resolve: (value: T) => void;
    let reject: (reason?: any) => void;
    const p = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise: p, resolve: resolve!, reject: reject! };
}

export function tokenTypeTest(
    foreignClass: new (...args: any[]) => SyncObject,
    fn: (token: Token) => any,
    expectedClass: new (...args: any[]) => SyncObject,
) {
    it(`Should throw when the given token is not the token of the ${expectedClass.name} object.`, async () => {
        const foreignEvent = new foreignClass();

        // First try calling the function to see what it returns
        let result: any;
        let threwSynchronously = false;

        try {
            result = fn(foreignEvent.token);
        } catch (error) {
            // Function threw synchronously
            threwSynchronously = true;
            expect(error).toBeInstanceOf(Error);
        }

        if (!threwSynchronously) {
            // Check if the function returns a Promise (async function)
            if (result instanceof Promise) {
                // For async functions, expect the Promise to be rejected
                try {
                    await result;
                    // If we get here, the promise resolved instead of rejecting
                    expect.fail(
                        "Expected promise to be rejected, but it resolved.",
                    );
                } catch (error) {
                    // This is expected - the promise should reject
                    expect(error).toBeInstanceOf(Error);
                }
            } else {
                // Function returned a value instead of throwing - this is unexpected
                expect.fail(
                    "Expected function to throw or return a rejected promise.",
                );
            }
        }
    });
}
