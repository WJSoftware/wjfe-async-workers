import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { sinon } from '../../setup.js';
import { ManualResetEvent } from '../../../src/sync/ManualResetEvent.js';
import { delay, testManualResetEventWaitInWorker, tokenTypeTest } from '../helpers/helpers.js';
import { manualResetEventIdentityData } from '../../../src/sync/identifiers.js';
import { AutoResetEvent } from '../../../src/sync/AutoResetEvent.js';

describe('ManualResetEvent', () => {
    let eventObj: ManualResetEvent;

    beforeEach(() => {
        sinon.reset();
        eventObj = new ManualResetEvent();
    });

    after(() => {
        sinon.restore();
    });

    describe('constructor', () => {
        it('Should create a ManualResetEvent instance.', () => {
            expect(eventObj).to.be.instanceOf(ManualResetEvent);
        });

        it('Should have a token property.', () => {
            expect(eventObj.token).to.be.instanceOf(Int32Array);
        });
        it('Should provide a non-signaled token.', () => {
            expect(Atomics.load(eventObj.token, 1)).to.equal(manualResetEventIdentityData[0]);
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });
    });

    describe('signal', () => {
        it('Should store 1 in token position 0 when signaled.', () => {
            eventObj.signal();
            
            expect(Atomics.load(eventObj.token, 0)).to.equal(1);
        });
    });

    describe('reset', () => {
        it('Should store 0 in token position 0 when reset.', () => {
            eventObj.reset();

            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });
    });

    describe('static isSignaled', () => {
        [false, true].forEach((signal) => {
            it(`Should return ${signal} when token is ${signal ? '' : 'not '}signaled.`, () => {
                if (signal) {
                    eventObj.signal();
                }
                const result = ManualResetEvent.isSignaled(eventObj.token);
            
                expect(result).to.equal(signal);
            });
        });
        tokenTypeTest(AutoResetEvent, ManualResetEvent.isSignaled, ManualResetEvent);
    });

    describe('static wait', () => {
        tokenTypeTest(AutoResetEvent, ManualResetEvent.wait, ManualResetEvent);

        it('Should handle timeout.', () => {
            const result = ManualResetEvent.wait(eventObj.token, 10);
            
            expect(result).to.equal('timed-out');
        });

        it('Should handle immediate success when already signaled.', () => {
            eventObj.signal();
            const result = ManualResetEvent.wait(eventObj.token);
            expect(result).to.equal('not-equal');
        });

        it('Should wait and succeed when signal becomes available.', async () => {
            const waitComplete = (await testManualResetEventWaitInWorker(eventObj.token, 1000)).wait;
            
            await delay(50); // Ensure the worker is waiting
            eventObj.signal();

            const result = await waitComplete;
            expect(result).to.equal('ok');
        });

        it('Should timeout when waiting and no signal occurs.', async () => {
            const waitComplete = (await testManualResetEventWaitInWorker(eventObj.token, 100)).wait;

            const result = await waitComplete;

            expect(result).to.equal('timed-out');
        });
    });

    describe('static waitAsync', () => {
        tokenTypeTest(AutoResetEvent, ManualResetEvent.waitAsync, ManualResetEvent);
        it('Should handle async wait result.', async () => {
            // Signal the event after a short delay to test async wait
            setTimeout(() => {
                eventObj.signal();
            }, 0);
            
            const result = await ManualResetEvent.waitAsync(eventObj.token, 10);
            
            expect(result).to.equal('ok');
        });

        it('Should handle sync wait result.', async () => {
            // Pre-signal the event so waitAsync returns immediately
            eventObj.signal();
            
            const result = await ManualResetEvent.waitAsync(eventObj.token);
            
            expect(result).to.equal('not-equal');
        });

        it('Should handle timeout in async wait.', async () => {
            const result = await ManualResetEvent.waitAsync(eventObj.token, 10);
            
            expect(result).to.equal('timed-out');
        });
    });
});