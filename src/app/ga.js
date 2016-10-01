import {selectByProportionateFitness, selectByTournament} from './ga/selection';
import {randomInt} from './ga/utils';


function randomBase(bases) {
  return bases[randomInt(0, bases.length)];
}

function *generateChromosome(bases, length) {
  for (let ii = 0; ii < length; ii++) {
    yield randomBase(bases);
  }
}

function generatePool(size, chromosomeGenerator, fitnessFn) {
  let chromosomes = [];

  for (let ii = 0; ii < size; ii++) {
    chromosomes.push([...chromosomeGenerator()]);
  }

  sortByDescendingFitness(chromosomes, fitnessFn);

  return chromosomes;
}

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
function mutateChromosome(bases, chance, chromosome) {
  let newChromosome = chromosome.slice();

  for (let locusIndex = 0; locusIndex < chromosome.length; locusIndex++) {
    if (Math.random() < chance) {
      newChromosome[locusIndex] = randomBase(bases);
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
function crossoverChromosomes(chance, chromosomeA, chromosomeB) {
  if (Math.random() < chance) {
    // Get the length of the shorter of the two chromosomes to be
    // crossed-over.
    const chromosomeLength = Math.min(chromosomeA.length, chromosomeB.length);
    // Pick a position (locus) for the crossover
    const locus = randomInt(0, chromosomeLength);
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

function sortByDescendingFitness(chromosomes, fitnessFn) {
  chromosomes.sort((ca, cb) => fitnessFn(cb) - fitnessFn(ca));
}


/*
 * To make this a little more general purpose, this takes an
 * arbitrary number of chromosomes, then crosses over each
 * unique pair (e.g. at index 1 and 7 are crossed over once,
 * and then 7 and 1 are not). Chromosomes are not
 * crossed over with themselves.
 */
function breed(mutator, crossoverChance, population) {
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
            crossoverChance,
            population[ii], population[jj]
          )
        );
      }
    }
  }

  return newChromosomes.map(mutator);
}

/* eslint-disable no-new-func */
function buildFitnessFunction(fitnessFunctionSource) {
  return Function('chromosome', fitnessFunctionSource);
}

/* eslint-enable no-new-func */

export class GA {
  static fromSettings(settings) {
    let preparedSettings = Object.assign({}, settings);

    preparedSettings.fitnessFn = buildFitnessFunction(settings.fitnessFunctionSource);

    function chromosomeGenerator() {
      return generateChromosome(settings.bases, settings.chromosomeLength);
    }

    let chromosomes = generatePool(settings.startingPopulation, chromosomeGenerator, preparedSettings.fitnessFn);

    return new GA(preparedSettings, chromosomes, []);
  }

  constructor(settings, chromosomes, previousGenerations) {
    this.fitnessFn = settings.fitnessFn;
    this.chromosomes = chromosomes;
    // assert this.chromosomes is sorted by fitness descending.

    this.elitism = settings.elitism ? settings.selectionElitism : 0;
    this.tournamentSize = settings.tournamentSize;
    this.bases = settings.bases;
    this.selectionMechanism = settings.selectionMechanism;
    this.crossoverChance = settings.crossoverChance;
    this.mutationChance = settings.mutationChance;

    this.generation = previousGenerations.length;
    this.previousGenerations = previousGenerations;
  }

  select() {
    if (this.selectionMechanism === 'tournament') {
      return selectByTournament(this.tournamentSize, this.fitnessFn, this.chromosomes);
    } else if (this.selectionMechanism === 'fitness-proportionate') {
      return selectByProportionateFitness(this.fitnessFn, this.chromosomes);
    }

    throw new Error(`Unknown selection mechanism ${this.selectionMechanism}.`);
  }

  step() {
    // choose elite
    let pool = this.chromosomes.slice(0, Math.ceil(this.elitism * this.chromosomes.length));

    const mutator = (chromosome) =>
      mutateChromosome(this.bases, this.mutationChance, chromosome);

    // pick remaining in pairs, until we have as many as the existing population
    // breeding each pair
    while (pool.length < this.chromosomes.length) {
      pool = pool.concat(
        breed(
          mutator, this.crossoverChance,
          this.select(
            this.fitnessFn,
            this.selectionMechanism,
            this.tournamentSize,
            this.chromosomes
          )
        )
      );
    }

    return new GA(
      {
        elitism: this.elitism,
        tournamentSize: this.tournamentSize,
        fitnessFn: this.fitnessFn,
        bases: this.bases,
        selectionMechanism: this.selectionMechanism,
        crossoverChance: this.crossoverChance,
        mutationChance: this.mutationChance
      },
      pool,
      [this.chromosomes].concat(this.previousGenerations)
    );
  }

  count() {
    return this.chromosomes.length;
  }

  countGenerations() {
    return this.previousGenerations.length + 1;
  }

  getBases() {
    return this.bases;
  }

  view(start, end, generation = 0) {
    const chromosomes = [this.chromosomes].concat(this.previousGenerations)[generation];

    return chromosomes.slice(start, end);
  }
}
