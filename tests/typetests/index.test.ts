import { describe, expect, test } from "tstyche";
import type { Token, WorkerTasks, AsyncMessage, QueueingOptions } from "../../src/workers.js";
import { CancellationSource } from "../../src/cancellation/CancellationSource.js";
import { TaskCancelledError } from "../../src/cancellation/TaskCancelledError.js";
import { Queue } from "../../src/misc/Queue.js";
import type { Enqueue, EnqueueFn } from "../../src/workers/AsyncWorker.js";
import { WorkItem } from "../../src/workers/WorkItem.js";

describe("Type Tests", () => {
    test("Token should be Int32Array", () => {
        expect<Token>().type.toBe<Int32Array>();
    });

    test("CancellationSource should extend Event", () => {
        const cancellationSource = new CancellationSource();
        expect(cancellationSource.token).type.toBe<Token>();
    });

    test("TaskCancelledError should extend Error", () => {
        const error = new TaskCancelledError();
        expect(error).type.toBeAssignableTo<Error>();
        expect(error.message).type.toBe<string>();
    });

    test("Queue should be generic", () => {
        const stringQueue = new Queue<string>();
        const numberQueue = new Queue<number>();
        
        expect(stringQueue.enqueue("test")).type.toBe<number>();
        expect(stringQueue.dequeue()).type.toBe<string>();
        expect(stringQueue.peek()).type.toBe<string>();
        expect(stringQueue.length).type.toBe<number>();
        expect(stringQueue.isEmpty).type.toBe<boolean>();
        
        expect(numberQueue.enqueue(42)).type.toBe<number>();
        expect(numberQueue.dequeue()).type.toBe<number>();
        expect(numberQueue.peek()).type.toBe<number>();
    });

    test("WorkerTasks type helper should work correctly", () => {
        type TestTasks = {
            add: (args: { a: number; b: number }) => number;
            greet: (args: { name: string }) => string;
            noArgs: () => void;
        };

        type TaskTypes = WorkerTasks<TestTasks>;
        
        expect<Pick<TaskTypes, "add">>().type.toBe<{
            add: { payload: { a: number; b: number }; return: number }
        }>();
        expect<Pick<TaskTypes, "greet">>().type.toBe<{
            greet: { payload: { name: string }; return: string }
        }>();
        expect<Pick<TaskTypes, "noArgs">>().type.toBe<{ 
            noArgs: { payload: undefined; return: void }
        }>();
    });

    test("AsyncMessage should have correct structure", () => {
        type TestTasks = {
            compute: (args: { value: number }) => string;
        };

        expect<AsyncMessage<TestTasks>>().type.toBe<{
            task: "compute";
            workItemId: number;
            cancelToken?: Token | undefined;
            payload?: { value: number } | undefined;
        }>();
    });

    test("CancellationSource static methods should have correct signatures", () => {
        const token: Token = new Int32Array(1);
        
        expect(CancellationSource.isSignaled(token)).type.toBe<boolean>();
        
        expect(CancellationSource.throwIfSignaled(token)).type.toBe<void>();
        expect(CancellationSource.throwIfSignaled(undefined)).type.toBe<void>();
    });

    test("Queue should not accept wrong types", () => {
        const stringQueue = new Queue<string>();
        
        expect(stringQueue.enqueue).type.not.toBeCallableWith(42);
        expect(stringQueue.enqueue).type.not.toBeCallableWith(true);
        expect(stringQueue.enqueue).type.not.toBeCallableWith({});
    });
});

describe('Enqueue, EnqueueFn', () => {
    type TestTasks = {
        add: (args: { a: number; b: number }) => number;
        greet: (args: { name: string }) => string;
        noArgs: () => void;
    };
    test("EnqueueFn should generate correct task functions.", () => {
        expect<EnqueueFn<TestTasks['add']>>().type.toBeCallableWith({ a: 1, b: 2 });
        expect<EnqueueFn<TestTasks['add']>>().type.toBeCallableWith({ a: 1, b: 2 }, { cancellable: true });
        expect<EnqueueFn<TestTasks['greet']>>().type.toBeCallableWith({ name: "Alice" });
        expect<EnqueueFn<TestTasks['greet']>>().type.toBeCallableWith({ name: "Alice" }, { cancellable: true });
        expect<EnqueueFn<TestTasks['noArgs']>>().type.toBeCallableWith();
        expect<EnqueueFn<TestTasks['noArgs']>>().type.toBeCallableWith(undefined, { cancellable: true });
    });
    test("Enqueue should map task names to EnqueueFn correctly.", () => {
        expect<Enqueue<TestTasks>>().type.toBe<{
            add: (payload: { a: number; b: number }, options?: QueueingOptions) => WorkItem<number>;
            greet: (payload: { name: string }, options?: QueueingOptions) => WorkItem<string>;
            noArgs: (payload: void, options?: QueueingOptions) => WorkItem<void>;
        }>();
    });
});