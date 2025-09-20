# @wjfe/async-workers

This is a package that brings async/await syntax to the web (and NodeJS + web-worker NPM package) workers world.  Read the project's README.md file for details.

## Atomic Tokens

Tokens are arrays of 2 32-bit values.  The first value is the token's signaled state; the second value is a type identifier.  This type is always checked by functions like AutoResetEvent.isSignaled() to ensure the function is only used on tokens coming from auto-resettable event class instances.

## Testing

There are currently 2 types of testing:  Unit testing, located in the `tests/ut/` folder, and type testing, located in the `tests/typetests/` folder.

All descriptions for all tests must be an English sentence that is grammatically correct:

1. It must start capitalized
2. It must end with a period
3. It *should* start with the word `Should`, but the more important thing is to properly describe the test

There are 4 NPM scripts defined for testing:

1. **test:unit** runs unit testing
2. **test:watch** runs unit testing in watch mode
3. **test:types** runs type testing
4. **test** runs all tests

### Specifics of Unit Testing

All testing is done with `mocha` in TypeScript and executed using `ts-mocha`.  Mocks are done using `sinon`, and assertions with `chai` and its `expect` API.  Since all is ES modules, `expect` is not required as a global.  It can simply be imported from the `"chai"` module.

### Specifics of Type Testing

Type testing is powered by the `tstyche` NPM package (https://www.npmjs.com/package/tstyche, https://tstyche.org) and the location of the tests, as noted, is `tests/typetests`.  This folder's name cannot be changed or the `tstyche` CLI won't be able to find the tests.
