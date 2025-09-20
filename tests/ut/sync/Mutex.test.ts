import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { sinon } from '../../setup.js';
import { Mutex } from '../../../src/sync/Mutex.js';
import { testMutexAcquireInWorker } from '../helpers/helpers.js';
import type { Releaser } from '../../../src/sync/Semaphore.js';

describe('Mutex', () => {
    let mutex: Mutex;

    beforeEach(() => {
        sinon.restore();
    });

    describe('constructor', () => {
        it('Should create a mutex with capacity 1.', () => {
            mutex = new Mutex();
            expect(mutex).to.be.instanceOf(Mutex);
            expect(mutex.token[0]).to.equal(1);
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

            expect(result).to.be.true;
            expect(mutex.token[0]).to.equal(1);
        });

        it('Should return false when enabling an already enabled mutex.', () => {
            mutex.enable(); // Enable once

            const result = mutex.enable(); // Try to enable again

            expect(result).to.be.false;
            expect(mutex.token[0]).to.equal(1);
        });
    });

    describe('static acquire', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should acquire immediately when mutex is available.', () => {
            const releaser = Mutex.acquire(mutex.token);

            expect(typeof releaser).to.equal('function');
        });

        it('Should wait when mutex is not available.', async () => {
            const releaser = Mutex.acquire(mutex.token);
            const waitAcquire = (await testMutexAcquireInWorker(mutex.token)).wait;
            let mainThreadReleased = false;
            setTimeout(() => {
                mainThreadReleased = true;
                releaser();
            }, 0);
            const result = await waitAcquire;

            expect(mainThreadReleased).to.be.true;
            expect(result.success).to.be.true;
        });
    });

    describe('static acquireAsync', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should acquire immediately when mutex is available.', async () => {
            const releaser = await Mutex.acquireAsync(mutex.token);

            expect(typeof releaser).to.equal('function');
        });

        it('Should wait asynchronously when mutex is not available.', async () => {
            const releaser = Mutex.acquire(mutex.token);
            let mainThreadReleased = false;
            setTimeout(() => {
                mainThreadReleased = true;
                releaser();
            }, 0);
            await Mutex.acquireAsync(mutex.token);

            expect(mainThreadReleased).to.be.true;
        });
    });

    describe('releaser function', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should release the mutex when called.', () => {
            const releaser = Mutex.acquire(mutex.token);

            expect(typeof releaser).to.equal('function');

            releaser();

            expect(mutex.token[0]).to.equal(1);
        });

        it('Should throw error when called twice.', () => {
            const releaser = Mutex.acquire(mutex.token);

            releaser(); // First release

            expect(() => releaser()).to.throw();
        });
    });

    describe('mutual exclusion behavior', () => {
        beforeEach(() => {
            mutex = new Mutex();
        });

        it('Should ensure the mutex cannot be acquired again asynchronously.', async () => {
            const releaser1 = Mutex.acquire(mutex.token);
            expect(typeof releaser1).to.equal('function');
            let releaser2 = await Mutex.acquireAsync(mutex.token, 0);
            expect(releaser2).to.equal('timed-out');
            let mainThreadReleased = false;
            setTimeout(() => {
                mainThreadReleased = true;
                releaser1();
            }, 0);
            releaser2 = await Mutex.acquireAsync(mutex.token);
            expect(mainThreadReleased).to.be.true;
            expect(typeof releaser2).to.equal('function');
        });

        it("Should ensure the mutex cannot be acquired from a different thread while it's held.", async () => {
            const releaser1 = Mutex.acquire(mutex.token);
            expect(typeof releaser1).to.equal('function');
            const waitAcquire = (await testMutexAcquireInWorker(mutex.token, 0)).wait;
            const result = await waitAcquire;
            expect(result.success).to.be.false;
        });
    });
});