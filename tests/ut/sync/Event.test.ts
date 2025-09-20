import { describe, it, beforeEach, before, after } from 'mocha';
import { expect } from 'chai';
import { sinon } from '../../setup.js';
import { Event } from '../../../src/sync/Event.js';
import { createAtomicsSpy } from '../helpers/helpers.js';

describe('Event', () => {
    let eventObj: Event;

    before(() => {
        createAtomicsSpy();
    });

    after(() => {
        sinon.restore();
    });

    beforeEach(() => {
        sinon.reset();
        eventObj = new Event(1, undefined);
    });

    describe('constructor', () => {
        it('Should create an event with given identifier.', () => {
            expect(eventObj).to.be.instanceOf(Event);
        });

        it('Should have a token of type Int32Array.', () => {
            expect(eventObj.token).to.be.instanceOf(Int32Array);
        });

        it('Should have token with correct length.', () => {
            // Based on SyncObject implementation, should have length >= 2
            expect(eventObj.token.length).to.be.at.least(2);
        });

        it("Should have identifier in token's position 1.", () => {
            expect(Atomics.load(eventObj.token, 1)).to.equal(1);
        });

        it("Should have 0 in token's position 0 (not signaled).", () => {
            expect(Atomics.load(eventObj.token, 0)).to.equal(0);
        });
    });

    describe('signal', () => {
        it('Should store 1 in token position 0 when signaled.', () => {
            sinon.reset();
            eventObj.signal();

            expect(Atomics.load(eventObj.token, 0)).to.equal(1);
        });

        it('Should notify threads when signaled.', () => {
            eventObj.signal();

            expect(Atomics.notify).to.have.been.calledOnce;
            expect(Atomics.notify).to.have.been.calledWith(eventObj.token, 0, undefined);
        });

        it('Should notify specific number of threads when configured.', () => {
            const eventWithThreads = new Event(3, 5);
            eventWithThreads.signal();

            expect(Atomics.notify).to.have.been.calledWith(eventWithThreads.token, 0, 5);
        });
    });
});
