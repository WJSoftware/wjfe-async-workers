import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { sinon } from '../../setup.js';
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
        sinon.restore();
        
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
            connect: sinon.stub().returns(() => { /* disconnect function */ }),
            post: sinon.stub(),
            terminate: sinon.stub().returns(true)
        };
        mockInternal = new WorkItemInternal(workerMock, wiData);
        workItem = new WorkItem(mockInternal);
    });

    describe('constructor', () => {
        it('Should create a WorkItem instance.', () => {
            expect(workItem).to.be.instanceOf(WorkItem);
        });
    });

    describe('promise property', () => {
        it('Should return the internal promise.', () => {
            expect(workItem.promise).to.equal(mockPromise);
        });
    });

    describe('id property', () => {
        it('Should return the internal work item id.', () => {
            expect(workItem.id).to.equal(123);
        });
    });

    describe('status property', () => {
        it('Should return the current status.', () => {
            expect(workItem.status).to.equal(WorkItemStatus.Enqueued);
        });

        it('Should reflect status changes.', () => {
            mockInternal.status = WorkItemStatus.Started;
            expect(workItem.status).to.equal(WorkItemStatus.Started);
        });
    });

    describe('cancel method', () => {
        it('Should return false when no cancellation source and not enqueued.', () => {
            mockInternal.status = WorkItemStatus.Started;
            mockInternal.cancellationSource = undefined;
            
            const result = workItem.cancel();
            
            expect(result).to.be.false;
        });

        it('Should signal cancellation source when available.', () => {
            const cancellationSource = new CancellationSource();
            const signalSpy = sinon.spy(cancellationSource, 'signal');
            mockInternal.cancellationSource = cancellationSource;
            
            const result = workItem.cancel();
            
            expect(signalSpy).to.have.been.calledOnce;
            expect(result).to.be.true;
        });

        it('Should reject promise when work item is enqueued.', () => {
            mockInternal.status = WorkItemStatus.Enqueued;
            const rejectSpy = sinon.spy(mockInternal.data, 'reject');
            
            workItem.cancel();
            
            expect(rejectSpy).to.have.been.calledOnce;
            expect(rejectSpy.firstCall.args[0]).to.be.instanceOf(CancelledMessage);
        });

        it('Should return true when cancellation source exists.', () => {
            mockInternal.cancellationSource = new CancellationSource();
            
            const result = workItem.cancel();
            
            expect(result).to.be.true;
        });

        it('Should return true when work item status is Cancelled.', () => {
            mockInternal.status = WorkItemStatus.Cancelled;
            
            const result = workItem.cancel();
            
            expect(result).to.be.true;
        });

        it('Should mark internal as cancelled when conditions are met.', () => {
            mockInternal.status = WorkItemStatus.Enqueued;
            mockInternal.cancelled = false;
            
            workItem.cancel();
            
            expect(mockInternal.cancelled).to.be.true;
        });

        it('Should handle both cancellation source and enqueued status.', () => {
            const cancellationSource = new CancellationSource();
            const signalSpy = sinon.spy(cancellationSource, 'signal');
            const rejectSpy = sinon.spy(mockInternal.data, 'reject');
            
            mockInternal.cancellationSource = cancellationSource;
            mockInternal.status = WorkItemStatus.Enqueued;
            
            const result = workItem.cancel();
            
            expect(signalSpy).to.have.been.calledOnce;
            expect(rejectSpy).to.have.been.calledOnce;
            expect(result).to.be.true;
        });
    });
});