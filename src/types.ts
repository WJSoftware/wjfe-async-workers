
/**
 * Token primitive type.
 */
export type Token = Int32Array;

/**
 * Helper type that enables proper inference of payload and return types.
 * 
 * Used by the async workers to provide proper Intellisense.
 */
export type WorkerTasks<T extends Record<string, (...args: any) => any>> = {
    [K in keyof T]: {
        payload: Parameters<T[K]>[0];
        return: ReturnType<T[K]>;
    }
};

/**
 * Message sent to a worker.
 */
export type AsyncMessage<Tasks extends Record<string, (...args: any) => any>> = {
    task: keyof Tasks;
    workItemId: number;
    cancelToken?: Token | undefined;
    payload?: WorkerTasks<Tasks>[keyof Tasks]['payload'] | undefined;
};

/**
 * Message sent to a worker.
 */
export type AsyncMessageUntyped = {
    workItemId: number;
    task: string;
    cancelToken?: Token | undefined;
    payload?: any;
};
/**
 * Message sent from the worker back to the main thread, containing the result of a previously queued work item or an 
 * intermediate result or status update.
 */
export type AsyncResponse = {
    /**
     * The unique identifier of the work item to which this response corresponds.
     */
    workItemId: number;
    /**
     * The payload containing the result, intermediate data, or status update from the worker.
     */
    payload?: any;
};
/**
 * Function type for processing messages from the worker.
 * @param payload The payload received from the worker.
 * @returns A boolean indicating whether the message was successfully processed.
 */
export type ProcessMessageFn = (payload: any) => boolean;
/**
 * Represents the data associated with a work item in the async worker queue.
 */
export type WorkItemData<TResult> = {
    /**
     * The unique identifier for the work item.
     */
    id: number;
    /**
     * The name of the task associated with the work item.
     */
    task: string;
    /**
     * The promise associated with the work item, which will be resolved or rejected based on the work item's
     * completion.
     */
    promise: Promise<TResult>;
    /**
     * Function to resolve the promise associated with the work item.
     */
    resolve: (result: any) => void;
    /**
     * Function to reject the promise associated with the work item.
     */
    reject: (reason: any) => void;
    /**
     * The payload associated with the work item.
     */
    payload: any,
};
/**
 * Message indicating that a previously queued work item has been cancelled.
 */
export type TaskCancelledMessage = {
    /**
     * The unique identifier of the work item that has been cancelled.
     */
    workItemId: number;
    /**
     * The payload indicating that the work item has been cancelled.
     */
    payload: {
        _$cancelled: true;
    }
};
/**
 * Options for queueing work items in the async worker.
 */
export type QueueingOptions = {
    /**
     * Indicates whether the queued work item can be cancelled.  This signals the library to provide cancellation
     * capabilities for the work item.
     * @default false
     */
    cancellable?: boolean;
    /**
     * Optional callback function to process messages from the worker.
     * @default undefined
     */
    processMessage?: ProcessMessageFn;
    /**
     * Optional array of transferable objects to be sent along with the message to the worker.
     * @default []
     */
    transferables?: Transferable[];
    /**
     * Indicates whether the work items can be processed out of order.
     * 
     * **IMPORTANT**:  When `outOfOrder` is set to `true`, the work item is sent immediately to the worker, skipping 
     * the current queue order.  This may produce unexpected behavior because the work item status is not tracked and 
     * their completion doesn't trigger dequeueing of subsequent work items.
     * @default false
     */
    outOfOrder?: boolean;
}

export interface IWorker {
    connect(id: number, processMessage: ProcessMessageFn, resolve: (data: any) => void, reject: (reason: any) => void): DisconnectFn | undefined;
    post(message: AsyncMessageUntyped, transferables: Transferable[] | undefined): void;
    terminate(): boolean;
}

export type DisconnectFn = () => void;

export type RejectFn = (reason: any) => void;
