export class Queue<TItem> {
    #items: Record<number, TItem>;
    #head: number;
    #tail: number;

    constructor() {
        this.#items = {};
        this.#head = 0;
        this.#tail = 0;
    }

    get length() {
        return this.#tail - this.#head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    enqueue(item: TItem) {
        this.#items[this.#tail] = item;
        return this.#tail++;
    }

    dequeue() {
        if (this.isEmpty) {
            throw new Error("Cannot dequeue from an empty queue.");
        }
        const item = this.#items[this.#head];
        delete this.#items[this.#head++];
        return item;
    }

    peek() {
        if (this.isEmpty) {
            throw new Error("Cannot peek on an empty queue.");
        }
        return this.#items[this.#head];
    }
};
