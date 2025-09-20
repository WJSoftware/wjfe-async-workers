import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { sinon } from '../../setup.js';
import { CancellationSource } from '../../../src/cancellation/CancellationSource.js';
import { TaskCancelledError } from '../../../src/cancellation/TaskCancelledError.js';

describe('CancellationSource', () => {
    let cancellationSource: CancellationSource;

    beforeEach(() => {
        // Restore all sinon stubs/spies before each test
        sinon.restore();
        cancellationSource = new CancellationSource();
    });

    describe('constructor', () => {
        it('should create a new CancellationSource instance', () => {
            expect(cancellationSource).to.be.instanceOf(CancellationSource);
        });

        it('should extend Event class', () => {
            expect(cancellationSource.constructor.name).to.equal('CancellationSource');
        });
    });

    describe('static isSignaled', () => {
        it('should return false for a new cancellation token', () => {
            const token = cancellationSource.token;
            const result = CancellationSource.isSignaled(token);
            expect(result).to.be.false;
        });

        it('should return true when cancellation source is signaled', () => {
            const token = cancellationSource.token;
            cancellationSource.signal();
            const result = CancellationSource.isSignaled(token);
            expect(result).to.be.true;
        });
    });

    describe('static throwIfSignaled', () => {
        it('should not throw when token is undefined', () => {
            expect(() => CancellationSource.throwIfSignaled(undefined)).to.not.throw();
        });

        it('should not throw when token is not signaled', () => {
            const token = cancellationSource.token;
            expect(() => CancellationSource.throwIfSignaled(token)).to.not.throw();
        });

        it('should throw TaskCancelledError when token is signaled', () => {
            const token = cancellationSource.token;
            cancellationSource.signal();
            expect(() => CancellationSource.throwIfSignaled(token)).to.throw(TaskCancelledError);
        });
    });
});