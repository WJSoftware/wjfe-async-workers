import { describe, it, beforeEach, after } from 'mocha';
import { expect } from 'chai';
import { sinon } from '../../setup.js';
import { AutoResetEvent } from '../../../src/sync/AutoResetEvent.js';
import { autoResetEventIdentityData } from '../../../src/sync/identifiers.js';
import { testAutoResetEventWaitInWorker } from '../helpers/helpers.js';
import { ManualResetEvent } from '../../../src/sync/ManualResetEvent.js';

describe('AutoResetEvent', () => {
    let eventObj: AutoResetEvent;

    beforeEach(() => {
        sinon.reset();
        eventObj = new AutoResetEvent();
    });

    after(() => {
        sinon.restore();
    });

    describe('constructor', () => {
        it('Should create an AutoResetEvent instance.', () => {
            expect(eventObj).to.be.instanceOf(AutoResetEvent);
        });

        it('Should have a token property.', () => {
            expect(eventObj.token).to.be.instanceOf(Int32Array);
        });

        it('Should initialize token with correct identifier and state.', () => {
            // Check that the type identifier is set correctly
            expect(Atomics.load(eventObj.token, 1)).to.equal(autoResetEventIdentityData[0]);
            // Check that the initial state is 0 (not signaled)
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });
    });

    describe('signal', () => {
        it('Should store 1 in token position 0 when signaled.', () => {
            eventObj.signal();
            
            expect(Atomics.load(eventObj.token, 0)).to.equal(1);
        });
    });

    describe('static isSignaled', () => {
        [false, true].forEach((signal) => {
            it(`Should return ${signal} when token is ${signal ? 'signaled' : 'not signaled'}.`, () => {
                if (signal) {
                    eventObj.signal();
                }
                const result = AutoResetEvent.isSignaled(eventObj.token);
            
                expect(result).to.equal(signal);
            });
        });

        it('Should throw when the given token is not the token of an AutoResetEvent object.', () => {
            const foreignEvent = new ManualResetEvent();

            expect(() => AutoResetEvent.isSignaled(foreignEvent.token)).to.throw();
        });
    });

    describe('static wait', () => {
        it('Should throw when the given token is not the token of an AutoResetEvent object.', () => {
            const foreignEvent = new ManualResetEvent();

            expect(() => AutoResetEvent.wait(foreignEvent.token)).to.throw();
        });

        it('Should handle timeout.', () => {
            const result = AutoResetEvent.wait(eventObj.token, 10);
            
            expect(result).to.equal('timed-out');
        });

        it('Should handle immediate success when already signaled.', () => {
            eventObj.signal();
            const result = AutoResetEvent.wait(eventObj.token);
            
            expect(result).to.equal('not-equal');
            // Verify the event auto-reset (signal was consumed)
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });

        it('Should wait and succeed when signal becomes available.', async () => {
            const waitComplete = (await testAutoResetEventWaitInWorker(eventObj.token, 1000)).wait;
            
            eventObj.signal();
            
            const result = await waitComplete;
            expect(result).to.equal('ok');
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });

        it('Should timeout when waiting and no signal occurs.', async () => {
            const waitComplete = (await testAutoResetEventWaitInWorker(eventObj.token, 100)).wait;

            const result = await waitComplete;

            expect(result).to.equal('timed-out');
        });
    });

    describe('static waitAsync', () => {
        it('Should throw when the given token is not the token of an AutoResetEvent object.', () => {
            const foreignEvent = new ManualResetEvent();

            expect(() => AutoResetEvent.wait(foreignEvent.token)).to.throw();
        });
        it('Should handle async wait result.', async () => {
            // Signal the event after a short delay to test async wait
            setTimeout(() => {
                eventObj.signal();
            }, 0);
            
            const result = await AutoResetEvent.waitAsync(eventObj.token, 1000);
            
            expect(result).to.equal('ok');
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });

        it('Should handle sync wait result.', async () => {
            // Pre-signal the event so waitAsync returns immediately
            eventObj.signal();
            
            const result = await AutoResetEvent.waitAsync(eventObj.token);
            
            expect(result).to.equal('not-equal');
            // Verify the event auto-reset (signal was consumed)
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });

        it('Should handle timeout in async wait.', async () => {
            const result = await AutoResetEvent.waitAsync(eventObj.token, 10);
            
            expect(result).to.equal('timed-out');
        });
    });
});