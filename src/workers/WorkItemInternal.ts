import { CancellationSource } from "../cancellation/CancellationSource.js";
import { CancelledMessage } from "../cancellation/CancelledMessage.js";
import type { AsyncMessage, DisconnectFn, IWorker, QueueingOptions, WorkItemData } from "../workers.js";
import { WorkItemStatus, type WorkItemStatusEnum } from "./AsyncWorker.js";
import { WorkerTerminatedMessage } from "./WorkerTerminatedMessage";

export class WorkItemInternal<TResult = any> {
    worker;
    data;
    options;
    cancellationSource;
    status: WorkItemStatusEnum;
    disconnect: DisconnectFn | undefined;

    constructor(worker: IWorker, data: WorkItemData<TResult>, options: QueueingOptions | undefined) {
        this.status = WorkItemStatus.Enqueued;
        this.worker = worker;
        this.data = {
            ...data,
            resolve: (x: TResult) => {
                data.resolve(x);
                this.disconnect?.();
                this.status = WorkItemStatus.Completed;
            },
            reject: (reason: any) => {
                data.reject(reason);
                if (reason instanceof CancelledMessage) {
                    this.status = WorkItemStatus.Cancelled;
                }
                else if (reason instanceof WorkerTerminatedMessage) {
                    this.status = WorkItemStatus.Terminated;
                }
                else {
                    this.status = WorkItemStatus.Completed;
                }
                this.disconnect?.();
            }
        };
        this.options = options;
        this.cancellationSource = options?.cancellable ? new CancellationSource() : undefined;
    }

    #defaultProcessMessage(_payload: any) {
        return true;
    }

    start() {
        if (this.cancellationSource && CancellationSource.isSignalled(this.cancellationSource.token)) {
            return;
        }
        this.disconnect = this.worker.connect(
            this.data.id,
            this.options?.processMessage ?? this.#defaultProcessMessage.bind(this),
            this.data.resolve,
            this.data.reject
        );
        this.status = WorkItemStatus.Started;
        const wiPayload: AsyncMessage = {
            workItemId: this.data.id,
            task: this.data.task,
            cancelToken: this.cancellationSource?.token,
            payload: this.data.payload,
        };
        this.worker.post(wiPayload, this.options?.transferables);
    }
};
