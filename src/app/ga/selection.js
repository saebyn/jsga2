/* @flow */
import type {Organism, RNG} from '../types';

function takeRandomOrganismIndexes(rng, size, organismsLength) {
  return Array(size)
    // gotcha, map won't work on an array of undefined's
    .fill(0)
    .map(() => rng.intBetween(0, organismsLength - 1));
}


function tournamentChooseOne(rng, size, organisms) {
  console.assert(organisms.length > 0, organisms);

  // assert organisms is sorted by fitness in descending order.

  // Choose a single chromosome by holding a tournament between `size` random
  // participant organisms in the `organisms`, and selecting the fittest.
  let selectionIndex = Math.min(...takeRandomOrganismIndexes(rng, size, organisms.length));

  // Find the organism with the largest fitness
  return organisms[selectionIndex];
}

/*
 * Choose a pair of organisms by tournaments of `size`.
 *
 * This may select the same chromosome twice.
 *
 * Returns a list of two Organism instances.
 */
export function selectByTournament(rng: RNG, size: number, organisms: Organism[]) {
  return [
    tournamentChooseOne(rng, size, organisms),
    tournamentChooseOne(rng, size, organisms)
  ];
}


function selectOneByProportionateFitness(targetValue, organisms) {
  let accumulatedFitness = 0.0;

  /*
  console.assert(targetValue >= 0);
  console.assert(organisms.length > 0);
  */

  let selected = organisms[0];

  // Iterate through all organisms,
  // accumulating their fitness, until a selection is made.
  for (let organism of organisms) {
    // If the random value is in the proportional subrange
    // of fitness of this chromosome
    console.assert(targetValue >= accumulatedFitness);
    if (targetValue < accumulatedFitness + organism.fitness) {
      // select it
      selected = organism;
      // search for the next random selection
      break;
    } else {
      accumulatedFitness += organism.fitness;
    }
  }

  return selected;
}


/*
 * Choose a pair of organisms randomly, but where each organism has
 * a likelyhood of being selected proportional to its fitness.
 *
 * This may select the same organism twice.
 */
export function selectByProportionateFitness(rng: RNG, organisms: Organism[]) {
  const totalFitness = organisms.reduce((acc, fb) => acc + fb.fitness, 0);

  // Choose a random value in the range from 0 to the sum of all
  // of the fitness values of the organisms.

  return [
    selectOneByProportionateFitness(rng.range(0, totalFitness), organisms),
    selectOneByProportionateFitness(rng.range(0, totalFitness), organisms),
  ];
}
