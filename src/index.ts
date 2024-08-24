// cancellation
export * from "./cancellation/CancellationSource.js";
export * from "./cancellation/CancelledMessage.js";
export * from "./cancellation/TaskCancelledError.js";
// events
export * from "./events/AutoResetEvent.js";
export * from "./events/ManualResetEvent.js";
// workers
export * from './workers/AsyncWorker.js';
export * from "./workers/workerListener.js";
export * from './workers/WorkerTerminatedMessage.js';
export * from "./workers/WorkItem.js";

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
    cancelToken?: Token;
    payload?: WorkerTasks<Tasks>[keyof Tasks]['payload'];
};

export type ProcessMessageFn = (payload: any, cancelToken?: Token) => boolean;
