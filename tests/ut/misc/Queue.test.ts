import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Queue } from '../../../src/misc/Queue.js';

describe('Queue', () => {
    let queue: Queue<string>;

    beforeEach(() => {
        queue = new Queue<string>();
    });

    describe('constructor', () => {
        it('should create an empty queue', () => {
            expect(queue.length).to.equal(0);
            expect(queue.isEmpty).to.be.true;
        });
    });

    describe('enqueue', () => {
        it('should add an item to the queue', () => {
            const result = queue.enqueue('first');
            
            expect(queue.length).to.equal(1);
            expect(queue.isEmpty).to.be.false;
            expect(result).to.equal(0); // Returns the index
        });

        it('should add multiple items in order', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            queue.enqueue('third');
            
            expect(queue.length).to.equal(3);
        });

        it('should return consecutive indices', () => {
            const firstIndex = queue.enqueue('first');
            const secondIndex = queue.enqueue('second');
            
            expect(firstIndex).to.equal(0);
            expect(secondIndex).to.equal(1);
        });
    });

    describe('dequeue', () => {
        it('should throw error when dequeuing from empty queue', () => {
            expect(() => queue.dequeue()).to.throw('Cannot dequeue from an empty queue.');
        });

        it('should return the first item added', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            
            const result = queue.dequeue();
            expect(result).to.equal('first');
            expect(queue.length).to.equal(1);
        });

        it('should maintain FIFO order', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            queue.enqueue('third');
            
            expect(queue.dequeue()).to.equal('first');
            expect(queue.dequeue()).to.equal('second');
            expect(queue.dequeue()).to.equal('third');
            expect(queue.isEmpty).to.be.true;
        });
    });

    describe('peek', () => {
        it('should throw error when peeking empty queue', () => {
            expect(() => queue.peek()).to.throw('Cannot peek on an empty queue.');
        });

        it('should return the first item without removing it', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            
            const result = queue.peek();
            expect(result).to.equal('first');
            expect(queue.length).to.equal(2); // Should not change length
        });

        it('should always return the same item until dequeued', () => {
            queue.enqueue('first');
            queue.enqueue('second');
            
            expect(queue.peek()).to.equal('first');
            expect(queue.peek()).to.equal('first');
            
            queue.dequeue();
            expect(queue.peek()).to.equal('second');
        });
    });

    describe('length property', () => {
        it('should update correctly with enqueue and dequeue operations', () => {
            expect(queue.length).to.equal(0);
            
            queue.enqueue('item1');
            expect(queue.length).to.equal(1);
            
            queue.enqueue('item2');
            expect(queue.length).to.equal(2);
            
            queue.dequeue();
            expect(queue.length).to.equal(1);
            
            queue.dequeue();
            expect(queue.length).to.equal(0);
        });
    });

    describe('isEmpty property', () => {
        it('should return true for empty queue', () => {
            expect(queue.isEmpty).to.be.true;
        });

        it('should return false for non-empty queue', () => {
            queue.enqueue('item');
            expect(queue.isEmpty).to.be.false;
        });

        it('should return true after emptying queue', () => {
            queue.enqueue('item');
            queue.dequeue();
            expect(queue.isEmpty).to.be.true;
        });
    });
});