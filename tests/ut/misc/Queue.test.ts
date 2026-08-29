import { describe, it, expect, beforeEach } from 'vitest';
import { Queue } from '../../../src/misc/Queue.js';

describe('Queue', () => {
    let queue: Queue<string>;

    beforeEach(() => {
        queue = new Queue<string>();
    });

    describe('constructor', () => {
        it('should create an empty queue', () => {
            expect(queue.length).toBe(0);
            expect(queue.isEmpty).toBe(true);
        });
    });

    describe('enqueue', () => {
        it('should add an item to the queue', () => {
            const result = queue.enqueue('first');
            
            expect(queue.length).toBe(1);
            expect(queue.isEmpty).toBe(false);
            expect(result).toBe(0); // Returns the index
        });

        it('should add multiple items in order', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            queue.enqueue('third');
            
            expect(queue.length).toBe(3);
        });

        it('should return consecutive indices', () => {
            const firstIndex = queue.enqueue('first');
            const secondIndex = queue.enqueue('second');
            
            expect(firstIndex).toBe(0);
            expect(secondIndex).toBe(1);
        });
    });

    describe('dequeue', () => {
        it('should throw error when dequeuing from empty queue', () => {
            expect(() => queue.dequeue()).toThrow('Cannot dequeue from an empty queue.');
        });

        it('should return the first item added', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            
            const result = queue.dequeue();
            expect(result).toBe('first');
            expect(queue.length).toBe(1);
        });

        it('should maintain FIFO order', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            queue.enqueue('third');
            
            expect(queue.dequeue()).toBe('first');
            expect(queue.dequeue()).toBe('second');
            expect(queue.dequeue()).toBe('third');
            expect(queue.isEmpty).toBe(true);
        });
    });

    describe('peek', () => {
        it('should throw error when peeking empty queue', () => {
            expect(() => queue.peek()).toThrow('Cannot peek on an empty queue.');
        });

        it('should return the first item without removing it', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            
            const result = queue.peek();
            expect(result).toBe('first');
            expect(queue.length).toBe(2); // Should not change length
        });

        it('should always return the same item until dequeued', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            
            expect(queue.peek()).toBe('first');
            expect(queue.peek()).toBe('first');
            
            queue.dequeue();
            expect(queue.peek()).toBe('second');
        });
    });

    describe('length property', () => {
        it('should update correctly with enqueue and dequeue operations', () => {
            expect(queue.length).toBe(0);
            
            queue.enqueue('item1');
            expect(queue.length).toBe(1);
            
            queue.enqueue('item2');
            expect(queue.length).toBe(2);
            
            queue.dequeue();
            expect(queue.length).toBe(1);
            
            queue.dequeue();
            expect(queue.length).toBe(0);
        });
    });

    describe('isEmpty property', () => {
        it('should return true for empty queue', () => {
            expect(queue.isEmpty).toBe(true);
        });

        it('should return false for non-empty queue', () => {
            queue.enqueue('item');
            expect(queue.isEmpty).toBe(false);
        });

        it('should return true after emptying queue', () => {
            queue.enqueue('item');
            queue.dequeue();
            expect(queue.isEmpty).toBe(true);
        });
    });
});