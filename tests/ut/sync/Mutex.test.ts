import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Mutex } from '../../../src/sync/Mutex.js';
import { testMutexAcquireInWorker } from '../helpers/helpers.js';
import type { Releaser } from '../../../src/sync/Semaphore.js';

describe('Mutex', () => {
    let mutex: Mutex;

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('Should create a mutex with capacity 1.', () => {
            mutex = new Mutex();
            expect(mutex).toBeInstanceOf(Mutex);
            expect(mutex.token[0]).toBe(1);
        });

        it('Should create disabled mutex when requested.', () => {
            mutex = new Mutex(true);
            expect(mutex.token[0]).to.equal(0);
        });
    });

    describe('enable', () => {
        beforeEach(() => {
            mutex = new Mutex(true); // Create disabled mutex
        });

        it('Should enable a disabled mutex.', () => {
            const result = mutex.enable();

            expect(result).toBe(true);
            expect(mutex.token[0]).toBe(1);
        });

        it('Should return false when enabling an already enabled mutex.', () => {
            mutex.enable(); // Enable once

            const result = mutex.enable(); // Try to enable again

            expect(result).toBe(false);
            expect(mutex.token[0]).toBe(1);
        });
    });

    describe('static acquireSync', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should acquire immediately when mutex is available.', () => {
            const releaser = Mutex.acquireSync(mutex.token);

            expect(typeof releaser).toBe('function');
        });

        it('Should wait when mutex is not available.', async () => {
            const releaser = Mutex.acquireSync(mutex.token);
            const waitAcquire = (await testMutexAcquireInWorker(mutex.token)).wait;
            let mainThreadReleased = false;
            setTimeout(() => {
                mainThreadReleased = true;
                releaser();
            }, 0);
            const result = await waitAcquire;

            expect(mainThreadReleased).toBe(true);
            expect(result.success).toBe(true);
        });
    });

    describe('static acquire', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should acquire immediately when mutex is available.', async () => {
            const releaser = await Mutex.acquire(mutex.token);

            expect(typeof releaser).toBe('function');
        });

        it('Should wait asynchronously when mutex is not available.', async () => {
            const releaser = Mutex.acquireSync(mutex.token);
            let mainThreadReleased = false;
            setTimeout(() => {
                mainThreadReleased = true;
                releaser();
            }, 0);
            await Mutex.acquire(mutex.token);

            expect(mainThreadReleased).toBe(true);
        });
    });

    describe('releaser function', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should release the mutex when called.', () => {
            const releaser = Mutex.acquireSync(mutex.token);

            expect(typeof releaser).toBe('function');

            releaser();

            expect(mutex.token[0]).toBe(1);
        });

        it('Should throw error when called twice.', () => {
            const releaser = Mutex.acquireSync(mutex.token);

            releaser(); // First release

            expect(() => releaser()).toThrow();
        });
    });

    describe('mutual exclusion behavior', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should ensure the mutex cannot be acquired again asynchronously.', async () => {
            const releaser1 = Mutex.acquireSync(mutex.token);
            expect(typeof releaser1).toBe('function');
            let releaser2 = await Mutex.acquire(mutex.token, 0);
            expect(releaser2).toBe('timed-out');
            let mainThreadReleased = false;
            setTimeout(() => {
                mainThreadReleased = true;
                releaser1();
            }, 0);
            releaser2 = await Mutex.acquire(mutex.token);
            expect(mainThreadReleased).toBe(true);
            expect(typeof releaser2).toBe('function');
        });

        it("Should ensure the mutex cannot be acquired from a different thread while it's held.", async () => {
            const releaser1 = Mutex.acquireSync(mutex.token);
            expect(typeof releaser1).toBe('function');
            const waitAcquire = (await testMutexAcquireInWorker(mutex.token, 0)).wait;
            const result = await waitAcquire;
            expect(result.success).toBe(false);
        });
    });
});