import { describe, it, beforeEach, expect, vi, afterAll } from 'vitest';
import { AutoResetEvent } from '../../../src/sync/AutoResetEvent.js';
import { autoResetEventIdentityData } from '../../../src/sync/identifiers.js';
import { delay, testAutoResetEventWaitInWorker } from '../helpers/helpers.js';
import { ManualResetEvent } from '../../../src/sync/ManualResetEvent.js';

describe('AutoResetEvent', () => {
    let eventObj: AutoResetEvent;

    beforeEach(() => {
        vi.restoreAllMocks();
        eventObj = new AutoResetEvent();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('Should create an AutoResetEvent instance.', () => {
            expect(eventObj).toBeInstanceOf(AutoResetEvent);
        });

        it('Should have a token property.', () => {
            expect(eventObj.token).toBeInstanceOf(Int32Array);
        });

        it('Should initialize token with correct identifier and state.', () => {
            // Check that the type identifier is set correctly
            expect(Atomics.load(eventObj.token, 1)).toBe(autoResetEventIdentityData[0]);
            // Check that the initial state is 0 (not signaled)
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });
    });

    describe('signal', () => {
        it('Should store 1 in token position 0 when signaled.', () => {
            eventObj.signal();
            
            expect(Atomics.load(eventObj.token, 0)).toBe(1);
        });
    });

    describe('static isSignaled', () => {
        [false, true].forEach((signal) => {
            it(`Should return ${signal} when token is ${signal ? 'signaled' : 'not signaled'}.`, () => {
                if (signal) {
                    eventObj.signal();
                }
                const result = AutoResetEvent.isSignaled(eventObj.token);
            
                expect(result).toBe(signal);
            });
        });

        it('Should throw when the given token is not the token of an AutoResetEvent object.', () => {
            const foreignEvent = new ManualResetEvent();

            expect(() => AutoResetEvent.isSignaled(foreignEvent.token)).toThrow();
        });
    });

    describe('static waitSync', () => {
        it('Should throw when the given token is not the token of an AutoResetEvent object.', () => {
            const foreignEvent = new ManualResetEvent();

            expect(() => AutoResetEvent.waitSync(foreignEvent.token)).toThrow();
        });

        it('Should handle timeout.', () => {
            const result = AutoResetEvent.waitSync(eventObj.token, 10);
            
            expect(result).toBe('timed-out');
        });

        it('Should handle immediate success when already signaled.', () => {
            eventObj.signal();
            const result = AutoResetEvent.waitSync(eventObj.token);
            
            expect(result).toBe('not-equal');
            // Verify the event auto-reset (signal was consumed)
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });

        it('Should wait and succeed when signal becomes available.', async () => {
            const waitComplete = (await testAutoResetEventWaitInWorker(eventObj.token, 1000)).wait;
            
            await delay(50); // Ensure the worker is waiting
            eventObj.signal();
            
            const result = await waitComplete;
            expect(result).toBe('ok');
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });

        it('Should timeout when waiting and no signal occurs.', async () => {
            const waitComplete = (await testAutoResetEventWaitInWorker(eventObj.token, 100)).wait;

            const result = await waitComplete;

            expect(result).toBe('timed-out');
        });
    });

    describe('static wait', () => {
        it('Should throw when the given token is not the token of an AutoResetEvent object.', async () => {
            const foreignEvent = new ManualResetEvent();

            await expect(AutoResetEvent.wait(foreignEvent.token)).rejects.toThrow();
        });
        it('Should handle async wait result.', async () => {
            // Signal the event after a short delay to test async wait
            setTimeout(() => {
                eventObj.signal();
            }, 0);
            
            const result = await AutoResetEvent.wait(eventObj.token, 1000);
            
            expect(result).toBe('ok');
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });

        it('Should handle sync wait result.', async () => {
            // Pre-signal the event so wait returns immediately
            eventObj.signal();
            
            const result = await AutoResetEvent.wait(eventObj.token);
            
            expect(result).toBe('not-equal');
            // Verify the event auto-reset (signal was consumed)
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });

        it('Should handle timeout in async wait.', async () => {
            const result = await AutoResetEvent.wait(eventObj.token, 10);
            
            expect(result).toBe('timed-out');
        });
    });
});