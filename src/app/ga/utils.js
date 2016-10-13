/* @flow */
/* global Generator */

import type {Base, RNG} from '../types';

export function randomElement(rng: RNG, bases: Base[]): Base {
  console.assert(bases.length > 0, bases);

  return bases[rng.intBetween(0, bases.length - 1)];
}

export function *elementGenerator(rng: RNG, bases: Base[], length: number): Generator<Base, void, void> {
  for (let ii = 0; ii < length; ii++) {
    yield randomElement(rng, bases);
  }
}
