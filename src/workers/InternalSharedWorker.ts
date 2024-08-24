import { CancelledMessage } from "../cancellation/CancelledMessage.js";
import type { AsyncMessage, AsyncResponse, DisconnectFn, IWorker, ProcessMessageFn, RejectFn, TaskCancelledMessage } from "../workers.js";

function isTaskCancelledMessage(message: any): message is TaskCancelledMessage {
    return message?.payload?._$cancelled === true && typeof message.workItemId === 'number';
}

function isAsyncResponse(message: any): message is AsyncResponse {
    return typeof message.workItemId === 'number';
}

export class InternalSharedWorker implements IWorker {
    #worker;
    #rejectMap;
    constructor(worker: SharedWorker) {
        this.#worker = worker;
        this.#rejectMap = new Map<number, RejectFn>();
    }

    #listenerFactory(id: number, processMessage: ProcessMessageFn, resolve: (data:any) => void) {
        return (ev: MessageEvent) => {
            if (isTaskCancelledMessage(ev.data) && ev.data.workItemId === id) {
                console.log('Received a cancellation: %o', ev.data);
                this.#rejectMap.get(id)?.(new CancelledMessage(false));
            } else if (isAsyncResponse(ev.data) && (ev.data.workItemId === id)) {
                if (processMessage(ev.data.payload)) {
                    resolve(ev.data.payload);
                }
            }
            else {
                console.warn('Work item ID %d:  Unidentified message event: %o', id, ev);
            }
        };
    }

    connect(
        id: number,
        processMessage: ProcessMessageFn,
        resolve: (data: any) => void,
        reject: (reason: any) => void
    ): DisconnectFn {
        const listener = this.#listenerFactory(id, processMessage, resolve);
        this.#worker.port.addEventListener('message', listener);
        this.#worker.port.start();
        this.#worker.addEventListener('error', reject);
        this.#rejectMap.set(id, reject);
        return () => {
            this.#worker.removeEventListener('error', reject);
            this.#worker.port.removeEventListener('message', listener);
            this.#rejectMap.delete(id);
        };
    }

    post(message: AsyncMessage, transferables: Transferable[] | undefined): void {
        this.#worker.port.postMessage(message, { transfer: transferables });
    }

    terminate(): boolean {
        throw new Error('Shared workers cannot be terminated.');
    }
}
