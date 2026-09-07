# @wjfe/async-workers

> Thread-safe, atomic synchronization objects and asynchronous worker wrappers for the browser and Node environments

[Live Demo](https://wjsoftware.github.io/wjfe-async-workers)

## Objectives

1. To provide friendly `async/await` syntax to the Node and web workers world.
2. To provide thread-safe, atomic synchronization objects like the ones found in other runtimes like .Net.

## Quickstart

These are the recommended steps to get things going:

1. Write the web worker as an object whose properties are the discrete worker tasks.  Use `workerListener()` to listen 
to incoming messages.
2. Export the tasks worker object.
3. Create a new instance of `Worker` the way is recommended by your bundler, usually with the syntax 
`new Worker("./my-worker.js", import.meta.url)`.  However, this forces you to write the worker in JavaScript, at least 
in Vite-powered projects.
4. Create a new instance of `AsyncWorker` (from this package) by passing the worker object and the tasks object from 
the previous points.
5. Start worker tasks by using the `AsyncWorker.enqueue` property.  The functions found in this object return an object 
of type `WorkItem` that exposes the `promise` property and the `cancel()` method.
6. Await the promise to obtain the worker's result.  The promise completes when the task finishes.  The promise rejects 
on unhandled errors in the worker side, when the task is cancelled or the worker is terminated.

> **How can I cancel the task?** Use `terminate()`.  NO!  Just kidding.  We have the good stuff.  Keep reading.

### The Worker

Write your worker.  The following example is a simple worker that works in steps:  Initialize the data, then sort it 
the way you need to, then calculate something (the running total of some property):

```typescript
import type { MyData } from './my-types.js'; // ./my-types.d.ts or similar
import { workerListener } from '@wjfe/async-workers';

let workerData: MyData[];

function getComparerForKey(key: string; desc: boolean) {
    return (a, b) => { ... };
}

function runningTotal() {
    // Process workerData;
    return result;
}

// This is the tasks object.
export const myWorker = {
    init(payload: MyData[]) {
        workerData = payload;
    },
    sortBy(payload: { sortKey: string; desc: boolean; }) {
        workerData.sort(
            getComparerForKey(payload.sortKey, payload.desc)
        );
    },
    calculateRunningTotal() {
        return runningTotal();
    }
};

// OPTIONAL:  For easy typing of props or variables along the way.
export type MyWorker = typeof myWorker;

// Now listen for messages.
self.onmessage = workerListener(myWorker);
```

This is a 3-step worker.  The worker simply waits to be informed which step to run from the user interface thread.

> ℹ️ Worker tasks may take zero arguments.  This is perfectly valid.

### The Async Worker in the UI Thread

This is what needs to be done in order to obtain an object that commands the worker:

> **⚡ Important**
> 
> This example is using TypeScript and the following assumes a Vite-powered project.  We are deviating from the 
> recommended way of obtaining a worker because the recommended way requires the worker to be written in JavaScript 
> while in serve mode (`npm run dev`).

```typescript
import { myWorker } from './myWorker.js';
// Vite-specific.  May also work with other bundlers.
// Consult your bundler's documentation.
import myWorkerCtor from './myWorker.js?worker';
import { AsyncWorker } from '@wjfe/async-workers';

const myWorkerController = new AsyncWorker(
    new myWorkerCtor(),
    myWorker
);

// Done.  Do what you must to get this controller
// to the places where is needed.  For example,
// this could be a module and the controller could
// be exported.
export myWorkerController;
```

Now it is a matter of using the controller (async worker) wherever needed:

```typescript
import { myWorkerController } from './myModule.js';

// Use the "enqueue" property to enqueue the worker's tasks and obtain a WorkItem object.
const initWorkItem = myWorkerController.enqueue.init(aBunchOfData);
const defaultSortWorkItem = myWorkerController.enqueue.sortBy({
    key: 'eventDate',
    desc: false,
});
const defaultRunningTotalWorkItem = myWorkerController.enqueue.calculateRunningTotal();
```

Yes!  The above is valid:  You may queue up as many tasks as you wish without having to await for the completion of 
previous ones, even if the worker is asynchronous (uses `async/await`).  The worker controller will keep perfect record 
of the order in which the tasks must be run.

This table shows through examples how various call signatures change from worker to enqueue object:

| Worker Function | Enqueue Function |
| - | - |
| `init(config: Configuration): void;` | `init(payload: Configuration, options?: QueueingOptions): WorkItem<void>;` |
| `sort(array: MyData[]): MyData[];` | `sort(payload: MyData[], options?: QueueingOptions): WorkItem<MyData[]>;` |
| `shutdown(): void;` | `shutdown(payload: void, options?: QueueingOptions): WorkItem<void>;` |
| `primesBetween(payload: { a: number; b: number; }): number[];` | `primesBetween(payload: { a: number; b: number }): WorkItem<number[]>;` |

Task functions can only take zero or 1 parameter, so if more than one piece of data is needed as payload, pass an object with all the data, as the last example does.

## Shared Workers

Shared workers are also supported through the same `AsyncWorker` class.  Note, however, the following key differences:

- Shared workers cannot be terminated.  Calling `AsyncWorker.terminate()` will throw an error.
- Shared workers don't have per-connection error handling.  It cannot be guaranteed that an error belongs to a 
particular connection or work item.  All connected (started) work items from all `AsyncWorker` objects that point to 
the same shared worker script will have their promises rejected.
- Not related to this NPM package, but note that the listening code of shared workers is different.  See below.

```typescript
self.onconnect = (ev) => {
    const port = ev.ports[0];
    port.onmessage = workerListener(myWorker);
}
```

## Bi-Directional Communication

> **🕓 TL;DR**
> 
> It's OK for workers to transmit intermediate results like progress reports and partial results.  It is not recommended for the main thread to have to send data to a paused task.  Promises in work item objects resolve once the `QueueingOptions.processMessage()` function returns `true`.

The default functionality is fine for many cases:  A worker task is started, the user interface waits for its 
completion and when the task finishes, the work item's `promise` property spits out the resultant object when awaited.

There are also many cases where "interim" communication between the worker and the UI thread is desired, most commonly:

1. Progress reports
2. Partial results

How can a worker send data while the task is still in progress?  By using the provided `post()` function.

In reality, the functions of the worker's tasks object in the quickstart are simplified.  In reality we can re-write 
the tasks object like this:

```typescript
import {
    workerListener,
    type PostFn,
    type Token,
} from '@wjfe/async-workers';

...

// This is the tasks object.
export const myWorker = {
    init(payload: MyData[], post: PostFn, cancelToken?: Token) {
        workerData = payload;
    },
    sortBy(payload: { sortKey: string; desc: boolean; }, post: PostFn, cancelToken?: Token) {
        workerData.sort(getComparerForKey(sortKey, desc));
        return workerData;
    },
    calculateRunningTotal(_: undefined, post: PostFn, cancelToken?: Token) {
        return runningTotal();
    }
};
```

Try not to be distracted with the `cancelToken` parameter.  Yes, worker tasks can be cancelled in real-time with this 
package.  This is explained in the [CancellationSource](#cancellationsource) section, later in the document.

A worker task may use `post()` to send data back to the UI thread at any point:

```typescript
    calculateRunningTotal(_: undefined, post: PostFn, cancelToken?: Token) {
        ...
        // Only one parameter:  The payload (say, progress report or partial result) to send back to the UI.
        post(partialResult);
        ...
        return runningTotal();
    }
```

Doing this, however and by default, incorrectly makes the work item's promise in the UI thread to resolve.  You must 
account for these extra messages in the UI side.  This is done when the work item is queued:

```typescript
const defaultRunningTotalWorkItem = myWorkerController.enqueue.calculateRunningTotal(undefined, {
    processMessage: (payload: any) => {
        // Examine the payload and determine whether or not,
        // based on its contents, the work item's promise
        // should resolve or not.
        if (payloadIsProgressReport(payload) || payloadIsPartialResult(payload)) {
            // A progress report or partial result.
            // Don't resolve the work item yet.
            return false;
        }
        // Payload is not a known payload.  There are 2 options:
        // It's the task's return value, or it's an unknown message,
        // which should be impossible, but have this in the back of
        // your head.
        if (isExpectedReturnValue(payload)) {
            // Ok, this is the return value, so the task completed.
            // Allow the work item's promise to resolve.
            return true;
        }
        // You may choose to ignore the unknown payload by doing
        // nothing and returning false, or you may do something
        // else.  Your choice.
        return false;
    }
});
```

This is it.  Bi-directional communication is fully set up.

### How About Sending Something Back?

You might be tempted to develop a worker that uses `post()` to request extra data mid-flight.  Don't.  This is 
difficult to maintain, not to mention that it requires releasing the worker thread using `await` so the queue of 
messages can be processed, which could contain instructions to start an entirely different task, and the list of 
problems probably goes on.

At your own risk, do "partial update" tasks in the worker's tasks object:

```typescript
export const myWorker = {
    init(payload: MyData[]) {
        workerData = payload;
    },
    sortBy(payload: { sortKey: string; desc: boolean; }) {
        workerData.sort(getComparerForKey(sortKey, desc));
        return workerData;
    },
    calculateRunningTotal(_: undefined, post: PostFn, cancelToken?: Token) {
        return runningTotal();
    }
    riskyDataUpdate(theData: UpdatedData) {
        ...
    }
};
```

Inside `processMessage`, do `myWorkerController.enqueue.riskyDataUpdate(theData, { outOfOrder: true })`
and hope for the best.

## Worker Task Cancellation

To fully understand, read [this topic](#cancellationsource) in the section about synchronization objects (coming up next), and also [this other topic about WorkItem class](#the-workitem-class).

To use a cancellation token, specify the `cancellable` option when the task is enqueued:

```typescript
const workItem = myWorkerController.enqueue.doSomething(somePayload, { cancellable: true });
...
// If so needed, cancel at some point.
workItem.cancel();
...
// At any point where the promise is awaited, an error will be thrown.
try {
    const result = await workItem.promise;
}
catch (err: unknown) {
    if (err instanceof CancelledMessage) {
        // The task was cancelled.
    }
}
```

To learn about the implementation in the worker side, keep reading.

## Synchronization Objects

This package provides synchronization objects that use `Atomics` to cross the thread boundary safely.

> **⚡ Important**
> 
> This implementation uses `Atomics` on `SharedArrayBuffer` objects which demands certain 
[security requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements) in browser environments.

### CancellationSource

This is the web worker equivalent of `AbortController` and provides a token that can be passed to workers in a task's 
payload.

The worker can use `CancellationSource.isSignaled()` or `CancellationSource.throwIfSignaled()` through polling in order 
to abort the current work:

```typescript
import { CancellationSource, type Token } from '@wjfe/async-workers';

function computeSomeStuff(cancelToken?: Token) {
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; ++i) {
        // No throwing will be done if cancelToken is undefined.
        CancellationSource.throwIfSignaled(cancelToken);
        ...
    }
}
```

The throw option is the preferred, and if used, this package will take care of catching the exception and making sure 
the work item's promise rejects with an object of type `CancelledMessage`.  This object has the 
`cancelledBeforeStarted` property that will be `true` if cancellation took place before the worker task even got 
started.

Passing the token "by hand" via the `payload` property to eventually get the token where is needed, is boilerplate that 
is already simplified.  Taking one line from the quickstart example:

```typescript
const defaultRunningTotalWorkItem = myWorkerController.enqueue.calculateRunningTotal(undefined, { cancellable: true });
```

By adding the `cancellable` option, a cancellation token will be available to `calculateRunningTotal` in its third 
parameter, as seen in the previous section.

Whenever cancellation is desired, simply call the work item's `cancel()` method.  For more information about this 
method, refer to [this section](#the-cancel-method).

If you're using `CancellationSource` on your own, like outside the context of async workers:

+ Do `const cs = new CancellationSource()` to create a new cancellation source.
+ The token is available via `cs.token`.
+ Signalling the token to trigger cancellation is done with `cs.signal()`.

### ManualResetEvent

This is a synchronization object that can be used to signal multiple threads at once because it will remain signaled 
until the `reset()` event is invoked.  A typical use case is to use it for pausing a worker's work.

### AutoResetEvent

This is a synchronization object that signals a single thread because once awaited, its state is automatically reset.

Typical use cases involve the need to unlock a single thread at a time.

### Semaphore

Semaphores are synchronization objects that are created with an initial capacity (a positive, non-zero integer).  This 
capacity can be thought as the number of threads that can access a resource simultaneously.

Use semaphores when you want to limit access to a **thread-safe** resource.  For example:  A battery of workers that 
upload files to a server via an HTTP request fulfills this description.  In order to not overwhelm the HTTP server, a 
semaphore could be used to limit the number of files that can be simultaneously uploaded.

### Mutex

A mutex is a semaphore of capacity 1.  Its name comes from the combination of the words _"mutually exclusive"_.  Since 
its capacity is 1, only one thread at a time can be the owner of a mutex.

## The WorkItem Class

Instances of the `WorkItem` class is what is returned by the functions in the `AsyncWorker.enqueue` property.  The 
class exposes the following properties and methods:

+ `id`:  A unique numeric identifier given to the work item upon creation.  Payloads carry this ID behind the scenes.
+ `status`:  A numeric value (enum) that tells the current status of the work item.
+ `promise`:  A promise that accurately represents the lifetime of the worker's task and the one that returns the 
task's return value.
+ `cancel()`:  A method that can potentially cancel a worker's task.

### The `cancel()` Method

For a worker task to be cancelled using `cancel()`, it must fulfill one of the following conditions:

1. It must have been enqueued using the `cancellable` option **and** the worker's code uses the cancellation token.
2. The work item hasn't been transmitted to the worker.

In other words, cancellation is not magical.  The good news is that any task is potentially cancellable as long as it 
hasn't been transmitted to the worker without the need of any extra coding, and if this is the case, the associated 
promise immediately rejects, meaning one doesn't have to wait for the task's turn in the queue of tasks to get it 
rejected.

The function returns `true` if action was taken towards cancelling the work item, or `false` otherwise.  The latter 
case can happen if the work item was already cancelled, or if none of the aforementioned conditions are met.  Yes, the 
function cannot know if the worker's code uses the cancellation token, so even if `true` is returned, a worker's task 
may still not cancel.  Be wary of this edge case.

### Out-of-Order Work Items

Out-of-order work items are created when enqueueing a task using the `outOfOrder` queueing option.  These work items 
skip the queue of other "normal" work items and are immediately transmitted to the worker, skipping the waiting line.

Because of their nature, they are ghosts in the machine.  Their running status is not tracked, their completions 
trigger no dequeueing of other tasks, and their execution delays, for seemingly no good reason, the execution of 
"normal" work items.  Avoid the need for these ghosts as much as possible.

## The AsyncWorker Class

This is the top-level class used in the user interface side, and is the wrapper of the native `Worker` class.  It 
combines the worker with the worker tasks and orchestrates things behind the scenes.  It exposes the following 
properties and methods:

+ `enqueue`:  The property used to enqueue worker tasks.
+ `terminate`:  Terminates the worker.

Terminating the worker immediately rejects the promises of all work items, and further use of `enqueue` will produce 
work items whose promise immediately rejects as well.  Promises that reject due to termination will have a reason 
object of type `WorkerTerminatedMessage`.

Terminated workers should be disposed as fast as possible.

### Shared vs Dedicated Worker

The `AsyncWorker` class, upon construction, will duck-type test the provided worker.  If it looks like a shared worker, it will initialize as a controller for a shared worker; otherwise, it will initialize as a controller for a dedicated worker.  Duck-type testing enables any `Worker` polyfill, including the popular `web-worker` for use in Node or any other runtime environment that supports it (maybe Deno, Bun) (server-sided JavaScript).  See the next section.

## Usage in Node.Js

> Since **v0.2.3**

This package, by design, is for use in the browser.  However, there is this NPM package called [web-worker](https://www.npmjs.com/package/web-worker) that brings the browser API into Node.  This collaboration works OK and enables the use of `@wjfe/async-workers` in Node.  The author haven't tested Deno or Bun or any other runtime environment.

## Roadmap

| Synchronization Objects | Dedicated Worker | Shared Worker |
| - | - | - |
| ✅ ManualResetEvent | ✅ Simple request/response scenario | ✅ Simple request/response scenario |
| ✅ AutoResetEvent | ✅ Request/multiple response scenario | ✅ Request/multiple response scenario |
| ✅ Semaphore | ✅ Strongly-typed tasks | ✅ Strongly-typed tasks |
| ✅ CancellationSource | ✅ Worker termination |  |
| ✅ Mutex | ✅ Out-of-order work items | ✅ Out-of-order work items |
| | ✅ Task cancellation | ✅ Task cancellation|
