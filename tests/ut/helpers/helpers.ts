import { sinon } from "../../setup.js";
import Worker from 'web-worker';
import type { Token } from "../../../src/workers.js";
import { SyncObject } from "../../../src/sync/SyncObject.js";

export type StubbedAtomics = {
    [K in keyof Omit<Atomics, symbol>]: sinon.SinonStub;
}

/**
 * Creates a worker to test blocking Atomics.wait operations.
 * This allows testing the actual ManualResetEvent.wait and AutoResetEvent.wait methods.
 */
export function createWorkerForWaitTesting(
    sharedBuffer: Token,
    waitFunction: 'ManualResetEvent.wait' | 'AutoResetEvent.wait',
    timeout?: number
) {
    const { promise, resolve, reject } = createPromise<{ wait: Promise<'ok' | 'timed-out' | 'not-equal'> }>();
    const { promise: waitPromise, resolve: waitResolve, reject: waitReject } = createPromise<'ok' | 'timed-out' | 'not-equal'>();
    const workerURL = new URL('./test-wait-worker.ts', import.meta.url);
    const worker = new Worker(workerURL, { type: 'module' });

    const cleanup = () => {
        try {
            worker.terminate();
        } catch (e) {
            // Ignore cleanup errors
        }
    };

    worker.onmessage = (event) => {
        if (event.data === 'running') {
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
    timeout?: number
) {
    return createWorkerForWaitTesting(token, 'ManualResetEvent.wait', timeout);
}

/**
 * Helper to test AutoResetEvent.wait in a worker thread
 */
export function testAutoResetEventWaitInWorker(
    token: Token,
    timeout?: number
) {
    return createWorkerForWaitTesting(token, 'AutoResetEvent.wait', timeout);
}

export function createWorkerForAcquireTesting(
    source: 'Mutex' | 'Semaphore',
    token: Token,
    timeout?: number
) {
    const { promise, resolve, reject } = createPromise<{ wait: Promise<{ success: boolean; }>}>();
    const { promise: waitPromise, resolve: waitResolve, reject: waitReject } = createPromise<{ success: boolean; }>();
    const workerURL = new URL('./test-acquire-worker.ts', import.meta.url);
    const worker = new Worker(workerURL, { type: 'module' });

    const cleanup = () => {
        try {
            worker.terminate();
        } catch (e) {
            // Ignore cleanup errors
        }
    };

    worker.onmessage = (event) => {
        if (event.data === 'running') {
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

export function testMutexAcquireInWorker(
    token: Token,
    timeout?: number
) {
    return createWorkerForAcquireTesting('Mutex', token, timeout);
}

export function testSemaphoreAcquireInWorker(
    token: Token,
    timeout?: number
) {
    return createWorkerForAcquireTesting('Semaphore', token, timeout);
}

export function createStubbedAtomics(): StubbedAtomics {
    const mockAtomics = {
        add: sinon.stub(Atomics, 'add'),
        and: sinon.stub(Atomics, 'and'),
        compareExchange: sinon.stub(Atomics, 'compareExchange'),
        exchange: sinon.stub(Atomics, 'exchange'),
        load: sinon.stub(Atomics, 'load'),
        or: sinon.stub(Atomics, 'or'),
        store: sinon.stub(Atomics, 'store'),
        sub: sinon.stub(Atomics, 'sub'),
        notify: sinon.stub(Atomics, 'notify'),
        wait: sinon.stub(Atomics, 'wait'),
        waitAsync: sinon.stub(Atomics, 'waitAsync'),
        isLockFree: sinon.stub(Atomics, 'isLockFree'),
        xor: sinon.stub(Atomics, 'xor'),
    };
    return mockAtomics;
}

export function createAtomicsSpy() {
    return {
        add: sinon.spy(Atomics, 'add'),
        and: sinon.spy(Atomics, 'and'),
        compareExchange: sinon.spy(Atomics, 'compareExchange'),
        exchange: sinon.spy(Atomics, 'exchange'),
        load: sinon.spy(Atomics, 'load'),
        or: sinon.spy(Atomics, 'or'),
        store: sinon.spy(Atomics, 'store'),
        sub: sinon.spy(Atomics, 'sub'),
        notify: sinon.spy(Atomics, 'notify'),
        wait: sinon.spy(Atomics, 'wait'),
        waitAsync: sinon.spy(Atomics, 'waitAsync'),
        isLockFree: sinon.spy(Atomics, 'isLockFree'),
        xor: sinon.spy(Atomics, 'xor'),
    };
}

export function delay(time: number = 0) {
    return new Promise<void>(resolve => setTimeout(resolve, time));
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

export function tokenTypeTest(foreignClass: new (...args: any[]) => SyncObject, fn: (token: Token) => any, expectedClass: new (...args: any[]) => SyncObject) {
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
            expect(error).to.be.an('error');
        }

        if (!threwSynchronously) {
            // Check if the function returns a Promise (async function)
            if (result instanceof Promise) {
                // For async functions, expect the Promise to be rejected
                try {
                    await result;
                    // If we get here, the promise resolved instead of rejecting
                    expect.fail('Expected promise to be rejected, but it resolved.');
                } catch (error) {
                    // This is expected - the promise should reject
                    expect(error).to.be.an('error');
                }
            } else {
                // Function returned a value instead of throwing - this is unexpected
                expect.fail('Expected function to throw or return a rejected promise.');
            }
        }
    });
}