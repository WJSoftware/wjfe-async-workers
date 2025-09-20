import { Semaphore } from '../../../dist/sync/Semaphore.js';
import { Mutex } from '../../../dist/sync/Mutex.js';

self.onmessage = function (event) {
    const { token, source, timeout } = event.data;
    try {
        self.postMessage('running');
        const releaser = timeout !== undefined
            ? (source === "Mutex" ? Mutex.acquire(token, timeout) : Semaphore.acquire(token, timeout))
            : (source === "Mutex" ? Mutex.acquire(token) : Semaphore.acquire(token));
        self.postMessage({ success: typeof releaser === 'function' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        self.postMessage({ success: false, error: errorMessage });
    }
};
