import { type Token } from "../workers";

export type IdentifierData = [
    number,
    string,
    string
];

export const manualResetEventIdentityData = [
    1,
    'manually-resettable event',
    'a'
] as const satisfies IdentifierData;

export const autoResetEventIdentityData = [
    2,
    'automatically-resettable event',
    'an'
] as const satisfies IdentifierData;

export const cancellationSourceIdentityData = [
    3,
    'cancellation source',
    'a'
] as const satisfies IdentifierData;

export const semaphoreIdentityData = [
    4,
    'semaphore',
    'a'
] as const satisfies IdentifierData;

export const mutexIdentityData = [
    5,
    'mutex',
    'a'
] as const satisfies IdentifierData;

/**
 * Ensures the given token is of the expected type by throwing an error if this is not the case.
 * @param token Token to check for.
 * @param identifier Token type identifier.
 * @param objectName Object name, used for constructing the error's message.
 * @param article Article for the object name, so the error's message is written in proper English.
 */
export function checkToken(token: Token, identifier: number, objectName: string, article: string) {
    if (Atomics.load(token, 1) !== identifier) {
        throw new Error(`The provided token is not that of ${article} ${objectName}.`);
    }
}
