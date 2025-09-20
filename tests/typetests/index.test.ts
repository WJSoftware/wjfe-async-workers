import { describe, expect, test } from "tstyche";
import type { Token, WorkerTasks, AsyncMessage } from "../../src/workers.js";
import { CancellationSource } from "../../src/cancellation/CancellationSource.js";
import { TaskCancelledError } from "../../src/cancellation/TaskCancelledError.js";
import { Queue } from "../../src/misc/Queue.js";
import { AsyncWorker, type Enqueue, type EnqueueFn } from "../../src/workers/AsyncWorker.js";

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
        
        expect<TaskTypes['add']['payload']>().type.toBe<{ a: number; b: number }>();
        expect<TaskTypes['add']['return']>().type.toBe<number>();
        expect<TaskTypes['greet']['payload']>().type.toBe<{ name: string }>();
        expect<TaskTypes['greet']['return']>().type.toBe<string>();
        expect<TaskTypes['noArgs']['payload']>().type.toBe<undefined>();
        expect<TaskTypes['noArgs']['return']>().type.toBe<void>();
    });

    test("AsyncMessage should have correct structure", () => {
        type TestTasks = {
            compute: (args: { value: number }) => string;
        };

        type Message = AsyncMessage<TestTasks>;
        
        expect<Message['task']>().type.toBe<keyof TestTasks>();
        expect<Message['workItemId']>().type.toBe<number>();
        expect<Message['cancelToken']>().type.toBe<Token | undefined>();
        expect<Message['payload']>().type.toBe<{ value: number } | undefined>();
    });

    test("CancellationSource static methods should have correct signatures", () => {
        const token: Token = new Int32Array(1);
        
        expect(CancellationSource.isSignaled).type.toBeCallableWith(token);
        expect(CancellationSource.isSignaled(token)).type.toBe<boolean>();
        
        expect(CancellationSource.throwIfSignaled).type.toBeCallableWith(token);
        expect(CancellationSource.throwIfSignaled).type.toBeCallableWith(undefined);
        expect(CancellationSource.throwIfSignaled(token)).type.toBe<void>();
    });

    test("Queue should not accept wrong types", () => {
        const stringQueue = new Queue<string>();
        
        expect(stringQueue.enqueue).type.not.toBeCallableWith(42);
        expect(stringQueue.enqueue).type.not.toBeCallableWith(true);
        expect(stringQueue.enqueue).type.not.toBeCallableWith({});
    });
});