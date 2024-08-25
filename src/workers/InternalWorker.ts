import { CancelledMessage } from "../cancellation/CancelledMessage.js";
import type { AsyncMessage, AsyncResponse, DisconnectFn, IWorker, ProcessMessageFn, RejectFn, TaskCancelledMessage } from "../workers.js";
import { WorkerTerminatedMessage } from "./WorkerTerminatedMessage.js";

function isTaskCancelledMessage(message: any): message is TaskCancelledMessage {
    return message?.payload?._$cancelled === true && typeof message.workItemId === 'number';
}

function isAsyncResponse(message: any): message is AsyncResponse {
    return typeof message.workItemId === 'number';
}

export class InternalWorker implements IWorker {
    #worker;
    #terminated;
    #rejectMap;
    constructor(worker: Worker) {
        this.#worker = worker;
        this.#terminated = false;
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

    connect(id: number, processMessage: ProcessMessageFn, resolve: (data: any) => void, reject: (reason: any) => void): DisconnectFn | undefined {
        if (this.#terminated) {
            reject(new WorkerTerminatedMessage(id));
            return;
        }
        const listener = this.#listenerFactory(id, processMessage, resolve);
        this.#worker.addEventListener('message', listener);
        this.#worker.addEventListener('error', reject);
        this.#rejectMap.set(id, reject);
        return () => {
            this.#worker.removeEventListener('error', reject);
            this.#worker.removeEventListener('message', listener);
            this.#rejectMap.delete(id);
        };
    }

    post(message: AsyncMessage, transferables: Transferable[] | undefined): void {
        if (this.#terminated) {
            throw new Error('The worker has been terminated and cannot accept new messages.');
        }
        this.#worker.postMessage(message, { transfer: transferables });
    }

    terminate() {
        if (this.#terminated) {
            return false;
        }
        this.#worker.terminate();
        for (let [id, r] of this.#rejectMap.entries()) {
            r(new WorkerTerminatedMessage(id));
        }
        return this.#terminated = true;
    }
}
