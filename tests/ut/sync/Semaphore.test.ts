import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Semaphore } from '../../../src/sync/Semaphore.js';
import { testSemaphoreAcquireInWorker } from '../helpers/helpers.js';

describe('Semaphore', () => {
    let semaphore: Semaphore;

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('Should create a semaphore with given capacity.', () => {
            semaphore = new Semaphore(3);
            expect(semaphore).toBeInstanceOf(Semaphore);
        });

        [0, -1, 3.5].forEach(invalidCapacity => {
            it(`Should throw error for invalid capacity ${invalidCapacity}.`, () => {
                expect(() => new Semaphore(invalidCapacity)).to.throw();
            });
        });

        it('Should create disabled semaphore when requested.', () => {
            semaphore = new Semaphore(3, true);
            expect(Semaphore.acquire(semaphore.token, 0)).toBe('timed-out');
        });
    });

    describe('enable', () => {
        const initialCapacity = 3;
        beforeEach(() => {
            semaphore = new Semaphore(initialCapacity, true); // Create disabled semaphore
        });

        it('Should enable a disabled semaphore.', () => {
            const result = semaphore.enable();

            expect(result).toBe(true);
            expect(semaphore.token[0]).toBe(initialCapacity);
        });

        it('Should return false when enabling an already enabled semaphore.', () => {
            semaphore.enable(); // Enable once

            const result = semaphore.enable(); // Try to enable again

            expect(result).toBe(false);
            expect(semaphore.token[0]).toBe(initialCapacity);
        });
    });

    describe('static acquire', () => {
        const initialCapacity = 2;
        beforeEach(() => {
            semaphore = new Semaphore(initialCapacity);
        });

        it('Should acquire immediately when capacity is available.', () => {
            const result = Semaphore.acquire(semaphore.token);

            expect(result).not.toBe('timed-out');
            expect(typeof result).toBe('function');
        });

        it('Should return "timed-out" when timeout occurs.', () => {
            for (let i = 0; i < initialCapacity; i++) {
                Semaphore.acquire(semaphore.token);
            }
            const result = Semaphore.acquire(semaphore.token, 0);

            expect(result).toBe('timed-out');
        });

        it('Should wait and acquire when capacity becomes available.', async () => {
            let releaser: Function;
            for (let i = 0; i < initialCapacity; i++) {
                releaser = Semaphore.acquire(semaphore.token);
            }
            const waitAcquire = (await testSemaphoreAcquireInWorker(semaphore.token)).wait;
            releaser!();
            const result = await waitAcquire;

            expect(result.success).toBe(true);
        });
    });

    describe('static acquireAsync', () => {
        const initialCapacity = 2;
        beforeEach(() => {
            semaphore = new Semaphore(initialCapacity);
        });

        it('Should acquire immediately when capacity is available.', async () => {
            const result = await Semaphore.acquireAsync(semaphore.token);

            expect(typeof result).toBe('function');
        });

        it('Should return "timed-out" when timeout occurs.', async () => {
            for (let i = 0; i < initialCapacity; i++) {
                Semaphore.acquire(semaphore.token);
            }
            const result = await Semaphore.acquireAsync(semaphore.token, 0);

            expect(result).toBe('timed-out');
        });
    });

    describe('releaser function', () => {
        beforeEach(() => {
            semaphore = new Semaphore(1);
        });

        it('Should release the semaphore when called.', () => {
            const releaser = Semaphore.acquire(semaphore.token);

            expect(typeof releaser).toBe('function');
            if (typeof releaser === 'function') {
                releaser();
                expect(Atomics.load(semaphore.token, 0)).toBe(1);
            }
        });

        it('Should throw error when called twice.', () => {
            const releaser = Semaphore.acquire(semaphore.token);

            if (typeof releaser === 'function') {
                releaser(); // First release

                expect(() => releaser()).toThrow();
            }
        });
    });
});