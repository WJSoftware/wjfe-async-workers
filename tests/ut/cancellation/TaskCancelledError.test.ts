import { describe, it } from 'mocha';
import { expect } from 'chai';
import { TaskCancelledError } from '../../../src/cancellation/TaskCancelledError.js';

describe('TaskCancelledError', () => {
    describe('constructor', () => {
        it('should create an error instance', () => {
            const error = new TaskCancelledError();
            expect(error).to.be.instanceOf(Error);
            expect(error).to.be.instanceOf(TaskCancelledError);
        });

        it('should accept a custom message', () => {
            const message = 'Operation was cancelled';
            const error = new TaskCancelledError(message);
            expect(error.message).to.equal(message);
        });

        it('should accept error options', () => {
            const cause = new Error('Root cause');
            const error = new TaskCancelledError('Cancelled', { cause });
            expect(error.cause).to.equal(cause);
        });

        it('should have default empty message when none provided', () => {
            const error = new TaskCancelledError();
            expect(error.message).to.equal('');
        });
    });

    describe('inheritance', () => {
        it('should be throwable', () => {
            expect(() => {
                throw new TaskCancelledError('Test error');
            }).to.throw(TaskCancelledError);
        });

        it('should be catchable as Error', () => {
            try {
                throw new TaskCancelledError('Test error');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error).to.be.instanceOf(TaskCancelledError);
            }
        });
    });
});