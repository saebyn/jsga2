
export function randomInt(min, max) {
  // [min, max)
  const range = max - min;

  return Math.floor(Math.random() * range + min);
}
