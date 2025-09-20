import { expect } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { use } from 'chai';

// Configure chai with sinon plugin
use(sinonChai);

// Configure chai globally
declare global {
    var expect: typeof import('chai').expect;
}

(global as any).expect = expect;

// Configure sinon
export { sinon };