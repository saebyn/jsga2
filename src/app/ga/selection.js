import {randomInt} from './utils';


function tournamentChooseOne(size, fitnessFn, chromosomes) {
  // assert chromosomes.length > 0

  // Choose a single chromosome by holding a tournament between `size` random
  // participant chromosomes in the `chromosomes`, and selecting the fittest.
  let selections = Array(size)
    // gotcha, map won't work on an array of undefined's
    .fill(0)
    .map(() => randomInt(0, chromosomes.length))
    .map(position => chromosomes[position]);

  // Find the chromosome with the largest fitness
  return selections.reduce((ca, cb) => {
    if (fitnessFn(ca) > fitnessFn(cb)) {
      return ca;
    } else {
      return cb;
    }
  });
}

/*
 * Choose a pair of chromosomes by tournaments of `size`.
 *
 * This may select the same chromosome twice.
 *
 * Returns a list of two Organism instances.
 */
export function selectByTournament(size, fitnessFn, chromosomes) {
  return [
    tournamentChooseOne(size, fitnessFn, chromosomes),
    tournamentChooseOne(size, fitnessFn, chromosomes)
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
export function selectByProportionateFitness(fitnessFn, chromosomes) {
  const fitnesses = chromosomes.map(fitnessFn);
  const totalFitness = fitnesses.reduce((fa, fb) => fa + fb, 0);
  let selections = [];
  const SELECTIONS_WANTED = 2;

  // Continue until we have made two selections.
  // This loop should not run more than twice.
  while (selections.length < SELECTIONS_WANTED) {
    // Choose a random value in the range from 0 to the sum of all
    // of the fitness values of the chromosomes in this chromosomes.
    const randomValue = Math.floor(Math.random() * totalFitness);
    let accumulatedFitness = 0.0;

    // Iterate through all chromosomes in the chromosomes,
    // accumulating their fitness, until a selection is made.
    for (let chromosomeIndex = 0; chromosomeIndex < chromosomes.length; chromosomeIndex++) {
      const fitness = fitnesses[chromosomeIndex];
      const chromosome = chromosomes[chromosomeIndex];

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
