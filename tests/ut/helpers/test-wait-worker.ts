import { ManualResetEvent } from '../../../dist/sync/ManualResetEvent.js';
import { AutoResetEvent } from '../../../dist/sync/AutoResetEvent.js';

self.onmessage = function(event) {
    const { sharedBuffer, waitFunction, timeout } = event.data;
    try {
        let result;
        self.postMessage('running');
        if (waitFunction === 'ManualResetEvent.wait') {
            result = ManualResetEvent.waitSync(sharedBuffer, timeout);
        } else if (waitFunction === 'AutoResetEvent.wait') {
            result = AutoResetEvent.waitSync(sharedBuffer, timeout);
        } else {
            throw new Error('Unknown wait function: ' + waitFunction);
        }
        self.postMessage({ success: true, result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        self.postMessage({ success: false, error: errorMessage });
    }
};