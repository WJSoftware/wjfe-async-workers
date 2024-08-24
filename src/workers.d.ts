
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
export type AsyncMessage = {
    workItemId: number;
    task: string;
    cancelToken?: Token;
    payload?: any;
};

export type AsyncResponse = {
    workItemId: number;
    payload?: any;
};

export type ProcessMessageFn = (payload: any) => boolean;

export type WorkItemData<TResult> = {
    id: number;
    task: string;
    promise: Promise<TResult>;
    resolve: (result: any) => void;
    reject: (reason: any) => void;
    payload: any,
};

export type TaskCancelledMessage = {
    workItemId: number;
    payload: {
        _$cancelled: true;
    }
};

export type QueueingOptions = {
    cancellable?: boolean;
    processMessage?: ProcessMessageFn;
    transferables?: Transferable[];
    outOfOrder?: boolean;
}

export interface IWorker {
    connect(id: number, processMessage: ProcessMessageFn, resolve: (data: any) => void, reject: (reason: any) => void): DisconnectFn;
    post(message: AsyncMessage, transferables: Transferable[] | undefined): void;
    terminate(): boolean;
}

export type DisconnectFn = () => void;

export type RejectFn = (reason: any) => void;
