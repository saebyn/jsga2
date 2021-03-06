/* @flow */

import type {Base, Chromosome, RNG} from '../types';
import {randomElement} from './utils';


/*
 * Mutate this chromosome at random.
 *
 * The chance that a given base in this chromosome
 * will be mutated is represented by `chance`.
 *
 * Assuming that a mutation does occur, this method will select a new
 * base randomly from `bases` with a unform probability
 * of choosing each base. The chosen base will replace the existing
 * base of the chromosome.
 *
 * Since the probability of each base in the `chromosome` being mutated
 * is independent, the probability that some base is mutated is given by:
 *
 *  1 - (1 - `chance`)^`chromosome.length`
 *
 * Maybe this isn't what we want? This is what the original implementation did though.
 */
export function mutateChromosome(rng: RNG, bases: Base[], chance: number, chromosome: Chromosome): Chromosome {
  let newChromosome = chromosome.slice();

  for (let locusIndex = 0; locusIndex < chromosome.length; locusIndex++) {
    if (rng.random() < chance) {
      newChromosome[locusIndex] = randomElement(rng, bases);
    }
  }

  return newChromosome;
}

/*
 *
 * Crossover this chromosome with another.
 *
 * The probability of a crossover occuring is given by `chance`.
 * If a crossover does not occur, a shallow copy of each original chromosome
 * will be returned instead.
 *
 * A crossover is performed by select a random locus.
 *
 * If a crossover occurs, the first child will have the initial bases
 * of the first chromosome and bases from the chosen locus onward
 * will be from the second chromosome. The second child will have initial
 * bases from the second chromosome and those from the locus onward of the
 * first chromosome.
 *
 */
function crossoverChromosomes(rng: RNG, chance: number, chromosomeA: Chromosome, chromosomeB: Chromosome): Chromosome[] {
  if (Math.random() < chance) {
    // Get the length of the shorter of the two chromosomes to be
    // crossed-over.
    const chromosomeLength = Math.min(chromosomeA.length, chromosomeB.length);
    // Pick a position (locus) for the crossover
    const locus = rng.intBetween(0, chromosomeLength - 1);
    // Construct the two child chromosomes
    const childOneChromosome = chromosomeA
      .slice(0, locus)
      .concat(chromosomeB.slice(locus));

    const childTwoChromosome = chromosomeB
      .slice(0, locus)
      .concat(chromosomeA.slice(locus));

    return [childOneChromosome, childTwoChromosome];
  }

  return [chromosomeA, chromosomeB];
}


/*
 * To make this a little more general purpose, this takes an
 * arbitrary number of chromosomes, then crosses over each
 * unique pair (e.g. at index 1 and 7 are crossed over once,
 * and then 7 and 1 are not). Chromosomes are not
 * crossed over with themselves.
 */
export function breed(rng: RNG, mutator: Function, crossoverChance: number, population: Chromosome[]): Chromosome[] {
  let newChromosomes = [];

  /*
   *  123456
   * 1X#####
   * 2XX####
   * 3XXX###
   * 4XXXX##
   * 5XXXXX#
   * 6XXXXXX
   */
  for (let ii = 0; ii < population.length; ii++) {
    for (let jj = ii; jj < population.length; jj++) {
      if (ii !== jj) {
        newChromosomes = newChromosomes.concat(
          crossoverChromosomes(
            rng,
            crossoverChance,
            population[ii], population[jj]
          )
        );
      }
    }
  }

  return newChromosomes.map(mutator);
}
