

function tournamentChooseOne(rng, size, organisms) {
  console.assert(organisms.length > 0, organisms);

  // Choose a single chromosome by holding a tournament between `size` random
  // participant organisms in the `organisms`, and selecting the fittest.
  let selections = Array(size)
    // gotcha, map won't work on an array of undefined's
    .fill(0)
    .map(() => rng.intBetween(0, organisms.length - 1))
    .map(position => organisms[position]);

  // Find the organism with the largest fitness
  return selections.reduce((ca, cb) => {
    if (ca.fitness > cb.fitness) {
      return ca;
    } else {
      return cb;
    }
  });
}

/*
 * Choose a pair of organisms by tournaments of `size`.
 *
 * This may select the same chromosome twice.
 *
 * Returns a list of two Organism instances.
 */
export function selectByTournament(rng, size, organisms) {
  return [
    tournamentChooseOne(rng, size, organisms),
    tournamentChooseOne(rng, size, organisms)
  ];
}

/*
 * Choose a pair of organisms randomly, but where each organism has
 * a likelyhood of being selected proportional to its fitness.
 *
 * This may select the same organism twice.
 */
export function selectByProportionateFitness(rng, organisms) {
  const totalFitness = organisms.reduce((acc, fb) => acc + fb.fitness, 0);
  let selections = [];
  const SELECTIONS_WANTED = 2;

  // Continue until we have made two selections.
  // This loop should not run more than twice.
  while (selections.length < SELECTIONS_WANTED) {
    // Choose a random value in the range from 0 to the sum of all
    // of the fitness values of the organisms.
    const randomValue = rng.range(0, totalFitness);
    let accumulatedFitness = 0.0;

    // Iterate through all organisms,
    // accumulating their fitness, until a selection is made.
    for (let organism of organisms) {
      // If the random value is in the proportional subrange
      // of fitness of this chromosome
      if (randomValue >= accumulatedFitness && randomValue < accumulatedFitness + organism.fitness) {
        // select it
        selections.push(organism);
        // search for the next random selection
        break;
      } else {
        accumulatedFitness += organism.fitness;
      }
    }
  }

  console.assert(selections.length === SELECTIONS_WANTED, selections);

  return selections;
}
