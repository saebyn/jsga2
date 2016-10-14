/* @flow */
/* global Generator */
import type {Organism} from '../types';


export function *generatePool(chromosomeGenerator: Function, fitnessFn: Function): Generator<Organism, void, void> {
  for (;;) {
    const chromosome = [...chromosomeGenerator()];

    yield {chromosome, fitness: fitnessFn(chromosome)};
  }
}
