import { TaskCancelledError } from "../cancellation/TaskCancelledError.js";
import { AsyncMessage, AsyncResponse } from "../workers.js";

/**
 * Defines the function provided to worker tasks so workers can communicate back to the calling thread.
 */
export type PostFn = (payload: any, options?: WindowPostMessageOptions) => void;

function isAsyncMessage(msg: any): msg is AsyncMessage {
    return typeof msg.workItemId === 'number' && msg.task && typeof msg.task === 'string';
}

function post(workItemId: number, payload: any, options?: WindowPostMessageOptions) {
    self.postMessage({
        workItemId,
        payload
    } satisfies AsyncResponse, options);
}

/**
 * Creates a listener function specialized for the given worker tasks object.  The listener is then assigned to the web 
 * worker's `onmessage` property.
 * @param workerTasks Worker tasks object that define the web worker.
 * @returns The sought listener.
 */
export function workerListener<Tasks extends Record<string, (...args: any) => any>>(workerTasks: Tasks) {
    return (ev: MessageEvent<AsyncMessage>) => {
        if (!isAsyncMessage(ev.data)) {
            return;
        }
        const taskFn = workerTasks[ev.data.task];
        if (typeof taskFn !== 'function') {
            console.warn('Async message with task "$s" yields no task function.');
            return;
        }
        try {
            const result = taskFn(ev.data.payload, post.bind(null, ev.data.workItemId), ev.data.cancelToken);
            post(ev.data.workItemId, result);
        }
        catch (error) {
            if (error instanceof TaskCancelledError) {
                post(ev.data.workItemId, { _$cancelled: true });
            }
        }
    };
};
