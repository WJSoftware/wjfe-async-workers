import { describe, it, expect } from 'vitest';
import { TaskCancelledError } from '../../../src/cancellation/TaskCancelledError.js';

describe('TaskCancelledError', () => {
    describe('constructor', () => {
        it('should create an error instance', () => {
            const error = new TaskCancelledError();
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(TaskCancelledError);
        });

        it('should accept a custom message', () => {
            const message = 'Operation was cancelled';
            const error = new TaskCancelledError(message);
            expect(error.message).toBe(message);
        });

        it('should accept error options', () => {
            const cause = new Error('Root cause');
            const error = new TaskCancelledError('Cancelled', { cause });
            expect(error.cause).toBe(cause);
        });

        it('should have default empty message when none provided', () => {
            const error = new TaskCancelledError();
            expect(error.message).toBe('');
        });
    });

    describe('inheritance', () => {
        it('should be throwable', () => {
            expect(() => {
                throw new TaskCancelledError('Test error');
            }).toThrow(TaskCancelledError);
        });

        it('should be catchable as Error', () => {
            try {
                throw new TaskCancelledError('Test error');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(TaskCancelledError);
            }
        });
    });
});