import { describe, it, beforeEach, expect, vi } from 'vitest';
import { WorkItem } from '../../../src/workers/WorkItem.js';
import { WorkItemInternal } from '../../../src/workers/WorkItemInternal.js';
import { WorkItemStatus } from '../../../src/workers/AsyncWorker.js';
import { CancelledMessage } from '../../../src/cancellation/CancelledMessage.js';
import { CancellationSource } from '../../../src/cancellation/CancellationSource.js';
import type { WorkItemData, IWorker } from '../../../src/types.js';

describe('WorkItem', () => {
    let workItem: WorkItem<string>;
    let mockInternal: WorkItemInternal<string>;
    let mockPromise: Promise<string>;
    let mockResolve: (value: string) => void;
    let mockReject: (reason: any) => void;

    beforeEach(() => {
        vi.restoreAllMocks();
        
        // Create a real promise for testing
        mockPromise = new Promise<string>((resolve, reject) => {
            mockResolve = resolve;
            mockReject = reject;
        });

        // Create mock internal work item
        const wiData: WorkItemData<any> = {
            id: 123,
            promise: mockPromise,
            resolve: mockResolve,
            reject: mockReject,
            task: 'testTask',
            payload: 'test payload'
        };
        const workerMock: IWorker = {
            connect: vi.fn().mockReturnValue(() => { /* disconnect function */ }),
            post: vi.fn(),
            terminate: vi.fn().mockReturnValue(true)
        };
        mockInternal = new WorkItemInternal(workerMock, wiData);
        workItem = new WorkItem(mockInternal);
    });

    describe('constructor', () => {
        it('Should create a WorkItem instance.', () => {
            expect(workItem).toBeInstanceOf(WorkItem);
        });
    });

    describe('promise property', () => {
        it('Should return the internal promise.', () => {
            expect(workItem.promise).toBe(mockPromise);
        });
    });

    describe('id property', () => {
        it('Should return the internal work item id.', () => {
            expect(workItem.id).toBe(123);
        });
    });

    describe('status property', () => {
        it('Should return the current status.', () => {
            expect(workItem.status).toBe(WorkItemStatus.Enqueued);
        });

        it('Should reflect status changes.', () => {
            mockInternal.status = WorkItemStatus.Started;
            expect(workItem.status).toBe(WorkItemStatus.Started);
        });
    });

    describe('cancel method', () => {
        it('Should return false when no cancellation source and not enqueued.', () => {
            mockInternal.status = WorkItemStatus.Started;
            mockInternal.cancellationSource = undefined;
            
            const result = workItem.cancel();
            
            expect(result).toBe(false);
        });

        it('Should signal cancellation source when available.', async () => {
            const cancellationSource = new CancellationSource();
            const signalSpy = vi.spyOn(cancellationSource, 'signal');
            mockInternal.cancellationSource = cancellationSource;
            
            const result = workItem.cancel();
            
            expect(signalSpy).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
            await expect(workItem.promise).rejects.toBeInstanceOf(CancelledMessage);
        });

        it('Should reject promise when work item is enqueued.', async () => {
            mockInternal.status = WorkItemStatus.Enqueued;
            
            workItem.cancel();
            
            await expect(mockInternal.data.promise).rejects.toBeInstanceOf(CancelledMessage);
        });

        it('Should return true when cancellation source exists.', async () => {
            mockInternal.cancellationSource = new CancellationSource();
            
            const result = workItem.cancel();
            
            expect(result).toBe(true);
            await expect(mockInternal.data.promise).rejects.toBeInstanceOf(CancelledMessage);
        });

        it('Should return true when work item status is Cancelled.', () => {
            mockInternal.status = WorkItemStatus.Cancelled;
            
            const result = workItem.cancel();
            
            expect(result).toBe(true);
        });

        it('Should mark internal as cancelled when conditions are met.', async () => {
            mockInternal.status = WorkItemStatus.Enqueued;
            mockInternal.cancelled = false;
            
            workItem.cancel();
            
            expect(mockInternal.cancelled).toBe(true);
            await expect(mockInternal.data.promise).rejects.toBeInstanceOf(CancelledMessage);
        });

        it('Should handle both cancellation source and enqueued status.', async () => {
            const cancellationSource = new CancellationSource();
            const signalSpy = vi.spyOn(cancellationSource, 'signal');
            const rejectSpy = vi.spyOn(mockInternal.data, 'reject');
            
            mockInternal.cancellationSource = cancellationSource;
            mockInternal.status = WorkItemStatus.Enqueued;
            
            const result = workItem.cancel();
            
            expect(signalSpy).toHaveBeenCalledTimes(1);
            expect(rejectSpy).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
            await expect(mockInternal.data.promise).rejects.toBeInstanceOf(CancelledMessage);
        });
    });
});