import { Queue } from "../misc/Queue.js";
import { nextWorkItemId } from "../misc/nextWorkItemId.js";
import type { IWorker, QueueingOptions, RejectFn, WorkerTasks, WorkItemData } from "../types.js";
import { InternalSharedWorker } from "./InternalSharedWorker.js";
import { InternalWorker } from "./InternalWorker.js";
import { WorkItem } from "./WorkItem.js";
import { WorkItemInternal } from "./WorkItemInternal.js";

/**
 * Determines if a worker-like object is a SharedWorker using duck typing.
 * @param worker The worker object to test
 * @returns true if the worker appears to be a SharedWorker, false otherwise
 */
function isSharedWorker(worker: any): worker is SharedWorker {
    // SharedWorker has a 'port' property (MessagePort) with the required methods
    return worker && 
           typeof worker === 'object' &&
           'port' in worker && 
           worker.port && 
           typeof worker.port === 'object' &&
           typeof worker.port.postMessage === 'function' && 
           typeof worker.port.addEventListener === 'function' &&
           typeof worker.port.removeEventListener === 'function';
}

/**
 * Represents the function used to enqueue a work item for a specific task.
 * @template Fn The type of the function representing the task.
 * @param payload The payload to be passed to the task function.
 * @param options Optional queueing options.
 * @returns A work item representing the enqueued task.
 */
export type EnqueueFn<Fn extends ((...args: any[]) => any) = (() => any)> =
    (payload: Fn extends () => any ? void : Parameters<Fn>[0], options?: QueueingOptions) => WorkItem<ReturnType<Fn>>;
/**
 * Represents the object used to enqueue work items for all tasks of a worker.
 * @template T The type of the tasks object, mapping task names to their respective functions.
 */
export type Enqueue<T extends Record<string, (...args: any[]) => any>> = {
    [K in keyof T]: EnqueueFn<T[K]>;
};

/**
 * Defines all possible work item status values.
 */
export const WorkItemStatus = Object.freeze({
    /**
     * Initial work item status.  This status value will not be seen in work items that immediately get transmitted to 
     * the worker (such as out-of-order work items).
     */
    Enqueued: 0,
    /**
     * The work item has started.  In this context, "started" means that the message that starts the worker's task has 
     * been transmitted.  Whether or not the actual work has started is unknown.
     */
    Started: 1,
    /**
     * The work item has been cancelled using its `cancel()` method.
     */
    Cancelled: 2,
    /**
     * The work item has been terminated because the worker was terminated using the `terminate()` method.
     */
    Terminated: 3,
    /**
     * The work item has completed and its promise has been fulfilled (resolved or rejected).
     */
    Completed: 4,
});

/**
 * Defines the type of the work item status values.
 */
export type WorkItemStatusEnum = typeof WorkItemStatus[keyof typeof WorkItemStatus];

/**
 * Abstracts a worker (dedicated or shared) and provides asynchronous syntax to control its functionality.
 */
export class AsyncWorker<Tasks extends Record<string, (...args: any[]) => any>> {
    #iWorker: IWorker;
    #queue;
    #taskRunning;
    #enqueue;
    constructor(worker: Worker | SharedWorker, tasks: Tasks) {
        this.#iWorker = isSharedWorker(worker) ? new InternalSharedWorker(worker) : new InternalWorker(worker as Worker);
        this.#queue = new Queue<WorkItemInternal>();
        this.#taskRunning = false;
        this.#enqueue = Object.keys(tasks).reduce((prev, curr) => {
            prev[curr as keyof Tasks] = this.#enqueueTask.bind(this, curr);
            return prev;
        }, {} as Enqueue<Tasks>);
    }

    #createTaskPromise<T>() {
        let resolve: (data: T | PromiseLike<T>) => void;
        let reject: RejectFn;
        const promise = new Promise<T>((rslv, rjct) => {
            resolve = rslv;
            reject = rjct;
        });
        return {
            resolve: resolve!,
            reject: reject!,
            promise
        };
    }
    /**
     * Returns the object used to enqueue work items.
     */
    get enqueue() {
        return this.#enqueue;
    }

    #enqueueTask<K extends keyof WorkerTasks<Tasks>>(task: K, payload: WorkerTasks<Tasks>[K]['payload'], options?: QueueingOptions) {
        const workItemId = nextWorkItemId();
        const { resolve, reject, promise } = this.#createTaskPromise<WorkerTasks<Tasks>[K]["return"]>();
        const workItemData = {
            id: workItemId,
            task: task as string,
            promise,
            resolve,
            reject,
            payload
        } satisfies WorkItemData<WorkerTasks<Tasks>[K]["return"]>;
        const workItem = new WorkItemInternal(this.#iWorker, workItemData, options);
        if (this.#taskRunning && !options?.outOfOrder) {
            this.#queue.enqueue(workItem);
        }
        else {
            if (!options?.outOfOrder) {
                this.#taskRunning = true;
                promise.finally(this.#startNextWorkItem.bind(this));
            }
            workItem.start();
        }
        return new WorkItem(workItem);
    }

    #startNextWorkItem() {
        if (!this.#queue.isEmpty) {
            const nextWorkItem = this.#queue.dequeue();
            nextWorkItem.data.promise.finally(this.#startNextWorkItem.bind(this));
            this.#taskRunning = true;
            nextWorkItem.start();
        }
        else {
            this.#taskRunning = false;
        }
    }
    /**
     * Terminates the underlying web worker.  Note that this is only possible for dedicated workers.  If an attempt to 
     * terminate a shared worker is tried, an error will be thrown.
     * @returns `true` if the worker is terminated and all pending work items' promises have been rejected, or `false` 
     * if the worker had already been terminated and therefore no further action took place.
     */
    terminate() {
        return this.#iWorker.terminate();
    }
};
