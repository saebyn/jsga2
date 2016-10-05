
export function randomElement(rng, bases) {
  console.assert(bases.length > 0, bases);

  return bases[rng.intBetween(0, bases.length - 1)];
}

export function *elementGenerator(rng, bases, length) {
  for (let ii = 0; ii < length; ii++) {
    yield randomElement(rng, bases);
  }
}
