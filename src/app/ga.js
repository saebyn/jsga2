function randomInt(min, max) {
  // [min, max)
  const range = max - min;

  return Math.floor(Math.random() * range + min);
}

function randomBase(bases) {
  return bases[randomInt(0, bases.length)];
}

function *generateChromosome(bases, length) {
  for (let ii = 0; ii < length; ii++) {
    yield randomBase(bases);
  }
}

function generateChromosomes(size, bases, length, fitnessFn) {
  let chromosomes = [];

  for (let ii = 0; ii < size; ii++) {
    chromosomes.push([...generateChromosome(bases, length)]);
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

function tournamentChooseOne(size, fitnessFn, population) {
  // assert population.length > 0

  // Choose a single chromosome by holding a tournament between `size` random
  // participant chromosomes in the `population`, and selecting the fittest.
  let selections = Array(size)
    // gotcha, map won't work on an array of undefined's
    .fill(0)
    .map(() => randomInt(0, population.length))
    .map(position => population[position]);

  // Find the chromosome with the largest fitness
  return selections.reduce((ca, cb) => fitnessFn(ca) > fitnessFn(cb) ? ca : cb);
}

/*
 * Choose a pair of chromosomes by tournaments of `size`.
 *
 * This may select the same chromosome twice.
 *
 * Returns a list of two Organism instances.
 */
function selectByTournament(size, fitnessFn, population) {
  return [
    tournamentChooseOne(size, fitnessFn, population),
    tournamentChooseOne(size, fitnessFn, population)
  ];
}

/*
 * Choose a pair of chromosomes randomly, but where each chromosome has
 * a likelyhood of being selected proportional to its fitness.
 *
 * This may select the same chromosome twice.
 *
 * Returns a list of two Organism instances.
 */
function selectByProportionateFitness(totalFitness, fitnessFn, population) {
  let selections = [];

  // Continue until we have made two selections.
  // This loop should not run more than twice.
  while (selections.length < 2) {
    // Choose a random value in the range from 0 to the sum of all
    // of the fitness values of the chromosomes in this population.
    const randomValue = Math.floor(Math.random() * totalFitness);
    let accumulatedFitness = 0.0;

    // Iterate through all chromosomes in the population,
    // accumulating their fitness, until a selection is made.
    for (const chromosome of population) {
      const fitness = fitnessFn(chromosome);

      // If the random value is in the proportional subrange
      // of fitness of this chromosome
      if (randomValue >= accumulatedFitness && randomValue < accumulatedFitness + fitness) {
        // select it
        selections.push(chromosome);
        // search for the next random selection
        break;
      } else {
        accumulatedFitness += fitness;
      }
    }
  }

  return selections;
}

function select(fitnessFn, selectionMechanism, tournamentSize, population) {
  if (selectionMechanism === 'tournament') {
    return selectByTournament(tournamentSize, fitnessFn, population);
  } else if (selectionMechanism === 'fitness-proportionate') {
    const totalFitness = population.map(fitnessFn).reduce((fa, fb) => fa + fb, 0);

    return selectByProportionateFitness(totalFitness, fitnessFn, population);
  }

  throw new Error(`Unknown selection mechanism ${selectionMechanism}.`);
}

/*
 * To make this a little more general purpose, this takes an
 * arbitrary number of chromosomes, then crosses over each
 * unique pair (e.g. at index 1 and 7 are crossed over once,
 * and then 7 and 1 are not). Chromosomes are not
 * crossed over with themselves.
 */
function breed(bases, mutationChance, crossoverChance, population) {
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

  return newChromosomes
    .map(
      mutateChromosome.bind(null, bases, mutationChance)
    );
}

export class GA {
  constructor(opts, chromosomes = null, previousGenerations = []) {
    if (opts.fitnessFn) {
      this.fitnessFn = opts.fitnessFn;
    } else {
      this.fitnessFn = Function('chromosome', opts.fitnessFunction);
    }

    if (chromosomes === null) {
      this.chromosomes = generateChromosomes(opts.startingPopulation, opts.bases, opts.chromosomeLength, this.fitnessFn);
    } else {
      this.chromosomes = chromosomes;
    }
    // assert this.chromosomes is sorted by fitness descending.

    this.elitism = opts.elitism ? opts.selectionElitism : 0;
    this.tournamentSize = opts.tournamentSize;
    this.bases = opts.bases;
    this.selectionMechanism = opts.selectionMechanism;
    this.crossoverChance = opts.crossoverChance;
    this.mutationChance = opts.mutationChance;

    this.generation = previousGenerations.length;
    this.previousGenerations = previousGenerations;
  }

  step() {
    // choose elite
    let pool = this.chromosomes.slice(0, Math.ceil(this.elitism * this.chromosomes.length));

    // pick remaining in pairs, until we have as many as the existing population
    // breeding each pair
    while (pool.length < this.chromosomes.length) {
      pool = pool.concat(
        breed(
          this.bases, this.mutationChance, this.crossoverChance,
          select(
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
