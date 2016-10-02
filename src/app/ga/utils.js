
export function randomInt(min, max) {
  // [min, max)
  const range = max - min;

  return Math.floor(Math.random() * range + min);
}

export function randomElement(bases) {
  return bases[randomInt(0, bases.length)];
}

export function *elementGenerator(bases, length) {
  for (let ii = 0; ii < length; ii++) {
    yield randomElement(bases);
  }
}
