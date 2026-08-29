import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CancellationSource } from '../../../src/cancellation/CancellationSource.js';
import { TaskCancelledError } from '../../../src/cancellation/TaskCancelledError.js';

describe('CancellationSource', () => {
    let cancellationSource: CancellationSource;

    beforeEach(() => {
        // Restore all vitest mocks before each test
        vi.restoreAllMocks();
        cancellationSource = new CancellationSource();
    });

    describe('constructor', () => {
        it('should create a new CancellationSource instance', () => {
            expect(cancellationSource).toBeInstanceOf(CancellationSource);
        });

        it('should extend Event class', () => {
            expect(cancellationSource.constructor.name).toBe('CancellationSource');
        });
    });

    describe('static isSignaled', () => {
        it('should return false for a new cancellation token', () => {
            const token = cancellationSource.token;
            const result = CancellationSource.isSignaled(token);
            expect(result).toBe(false);
        });

        it('should return true when cancellation source is signaled', () => {
            const token = cancellationSource.token;
            cancellationSource.signal();
            const result = CancellationSource.isSignaled(token);
            expect(result).toBe(true);
        });
    });

    describe('static throwIfSignaled', () => {
        it('should not throw when token is undefined', () => {
            expect(() => CancellationSource.throwIfSignaled(undefined)).not.toThrow();
        });

        it('should not throw when token is not signaled', () => {
            const token = cancellationSource.token;
            expect(() => CancellationSource.throwIfSignaled(token)).not.toThrow();
        });

        it('should throw TaskCancelledError when token is signaled', () => {
            const token = cancellationSource.token;
            cancellationSource.signal();
            expect(() => CancellationSource.throwIfSignaled(token)).toThrow(TaskCancelledError);
        });
    });
});