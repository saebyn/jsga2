
export function *generatePool(chromosomeGenerator, fitnessFn) {
  for (;;) {
    const chromosome = [...chromosomeGenerator()];

    yield {chromosome, fitness: fitnessFn(chromosome)};
  }
}
