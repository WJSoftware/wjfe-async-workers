import { describe, it, afterAll, expect, vi } from 'vitest';
import { Event } from '../../../src/sync/Event.js';

describe('Event', () => {
    let eventObj: Event;

    afterAll(() => {
        vi.restoreAllMocks();
    });

    beforeEach(() => {
        vi.restoreAllMocks();
        eventObj = new Event(1, undefined);
    });

    describe('constructor', () => {
        it('Should create an event with given identifier.', () => {
            expect(eventObj).toBeInstanceOf(Event);
        });

        it('Should have a token of type Int32Array.', () => {
            expect(eventObj.token).toBeInstanceOf(Int32Array);
        });

        it('Should have token with correct length.', () => {
            // Based on SyncObject implementation, should have length >= 2
            expect(eventObj.token.length).toBeGreaterThanOrEqual(2);
        });

        it("Should have identifier in token's position 1.", () => {
            expect(Atomics.load(eventObj.token, 1)).toBe(1);
        });

        it("Should have 0 in token's position 0 (not signaled).", () => {
            expect(Atomics.load(eventObj.token, 0)).toBe(0);
        });
    });

    describe('signal', () => {
        it('Should store 1 in token position 0 when signaled.', () => {
            eventObj.signal();

            expect(Atomics.load(eventObj.token, 0)).toBe(1);
        });

        it('Should notify threads when signaled.', () => {
            const spy = vi.spyOn(Atomics, 'notify');
            eventObj.signal();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(eventObj.token, 0, undefined);
        });

        it('Should notify specific number of threads when configured.', () => {
            const spy = vi.spyOn(Atomics, 'notify');
            const eventWithThreads = new Event(3, 5);
            eventWithThreads.signal();

            expect(spy).toHaveBeenCalledWith(eventWithThreads.token, 0, 5);
        });
    });
});
