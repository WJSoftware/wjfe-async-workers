import { describe, it, beforeEach, afterAll, expect, vi } from 'vitest';
import { ManualResetEvent } from '../../../src/sync/ManualResetEvent.js';
import { delay, testManualResetEventWaitInWorker, tokenTypeTest } from '../helpers/helpers.js';
import { manualResetEventIdentityData } from '../../../src/sync/identifiers.js';
import { AutoResetEvent } from '../../../src/sync/AutoResetEvent.js';

describe('ManualResetEvent', () => {
    let eventObj: ManualResetEvent;

    beforeEach(() => {
        vi.restoreAllMocks();
        eventObj = new ManualResetEvent();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('Should create a ManualResetEvent instance.', () => {
            expect(eventObj).toBeInstanceOf(ManualResetEvent);
        });

        it('Should have a token property.', () => {
            expect(eventObj.token).toBeInstanceOf(Int32Array);
        });
        it('Should provide a non-signaled token.', () => {
            expect(Atomics.load(eventObj.token, 1)).toBe(manualResetEventIdentityData[0]);
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });
    });

    describe('signal', () => {
        it('Should store 1 in token position 0 when signaled.', () => {
            eventObj.signal();
            
            expect(Atomics.load(eventObj.token, 0)).toBe(1);
        });
    });

    describe('reset', () => {
        it('Should store 0 in token position 0 when reset.', () => {
            eventObj.reset();

            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });
    });

    describe('static isSignaled', () => {
        [false, true].forEach((signal) => {
            it(`Should return ${signal} when token is ${signal ? '' : 'not '}signaled.`, () => {
                if (signal) {
                    eventObj.signal();
                }
                const result = ManualResetEvent.isSignaled(eventObj.token);
            
                expect(result).toBe(signal);
            });
        });
        tokenTypeTest(AutoResetEvent, ManualResetEvent.isSignaled, ManualResetEvent);
    });

    describe('static waitSync', () => {
        tokenTypeTest(AutoResetEvent, ManualResetEvent.waitSync, ManualResetEvent);

        it('Should handle timeout.', () => {
            const result = ManualResetEvent.waitSync(eventObj.token, 10);
            
            expect(result).toBe('timed-out');
        });

        it('Should handle immediate success when already signaled.', () => {
            eventObj.signal();
            const result = ManualResetEvent.waitSync(eventObj.token);
            expect(result).toBe('not-equal');
        });

        it('Should wait and succeed when signal becomes available.', async () => {
            const waitComplete = (await testManualResetEventWaitInWorker(eventObj.token, 1000)).wait;
            
            await delay(50); // Ensure the worker is waiting
            eventObj.signal();

            const result = await waitComplete;
            expect(result).toBe('ok');
        });

        it('Should timeout when waiting and no signal occurs.', async () => {
            const waitComplete = (await testManualResetEventWaitInWorker(eventObj.token, 100)).wait;

            const result = await waitComplete;

            expect(result).toBe('timed-out');
        });
    });

    describe('static wait', () => {
        tokenTypeTest(AutoResetEvent, ManualResetEvent.wait, ManualResetEvent);
        it('Should handle async wait result.', async () => {
            // Signal the event after a short delay to test async wait
            setTimeout(() => {
                eventObj.signal();
            }, 0);
            
            const result = await ManualResetEvent.wait(eventObj.token, 10);
            
            expect(result).toBe('ok');
        });

        it('Should handle sync wait result.', async () => {
            // Pre-signal the event so waitAsync returns immediately
            eventObj.signal();
            
            const result = await ManualResetEvent.wait(eventObj.token);
            
            expect(result).toBe('not-equal');
        });

        it('Should handle timeout in async wait.', async () => {
            const result = await ManualResetEvent.wait(eventObj.token, 10);
            
            expect(result).toBe('timed-out');
        });
    });
});