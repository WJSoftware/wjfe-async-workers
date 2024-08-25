import { CancellationSource, ManualResetEvent, workerListener, type PostFn, type Token } from "../../../dist/index.js";

function isPrime(n: number, cancelToken?: Token) {
    // Made unecessarily inefficient for demo purposes.
    for (let i = 2; i <= n / 2; ++i) {
        CancellationSource.throwIfSignalled(cancelToken);
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}

function isPrimePausable(n: number, pause: Token, cancelToken?: Token) {
    // Made unecessarily inefficient for demo purposes.
    for (let i = 2; i <= n / 2; ++i) {
        CancellationSource.throwIfSignalled(cancelToken);
        ManualResetEvent.wait(pause);
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}

function getAllPrimes(max: number, pause: Token | undefined, post: PostFn, cancelToken?: Token) {
    let isPrimeFn = !!pause ? (n: number) => isPrimePausable(n, pause, cancelToken) : (n: number) => isPrime(n, cancelToken);
    for (let i = 1; i < max; ++i) {
        if (isPrimeFn(i)) {
            post(i);
        }
    }
}

export const exampleWorker = {
    sayHello(payload: { name: string; }) {
        console.log('Hello, %s!', payload.name);
    },
    calculatePrimes(payload: { to: number; pause?: Token }, post: PostFn, cancelToken?: Token) {
        getAllPrimes(payload.to, payload.pause, post, cancelToken);
    }
};

export type ExampleWorker = typeof exampleWorker;

self.onmessage = workerListener(exampleWorker);
