import {breed, mutateChromosome} from './ga/reproduction';
import {selectByProportionateFitness, selectByTournament} from './ga/selection';
import {elementGenerator} from './ga/utils';
import {generatePool} from './ga/generator';


/* eslint-disable no-new-func */
function buildFitnessFunction(fitnessFunctionSource) {
  return Function('chromosome', fitnessFunctionSource);
}

/* eslint-enable no-new-func */

export class GA {
  constructor(settings) {
    this.fitnessFn = buildFitnessFunction(settings.fitnessFunctionSource);

    this.bases = settings.bases;
    this.chromosomeLength = settings.chromosomeLength;
    this.startingPopulation = settings.startingPopulation;
    this.elitism = settings.elitism ? settings.selectionElitism : 0;
    this.tournamentSize = settings.tournamentSize;
    this.bases = settings.bases;
    this.selectionMechanism = settings.selectionMechanism;
    this.crossoverChance = settings.crossoverChance;
    this.mutationChance = settings.mutationChance;

    this.population = this.spawn();
  }

  spawn() {
    const chromosomeGenerator = () =>
      elementGenerator(this.bases, this.chromosomeLength);

    let organisms = [];

    for (let organism of generatePool(chromosomeGenerator, this.fitnessFn)) {
      if (organisms.length < this.startingPopulation) {
        organisms.push(organism);
      } else {
        break;
      }
    }

    // sort organisms by descending fitness.
    organisms.sort((oa, ob) => ob.fitness - oa.fitness);

    return {organisms};
  }

  step(population) {
    const {organisms} = population;

    // choose elite
    let pool = organisms.slice(0, Math.ceil(this.elitism * organisms.length));

    const mutator = (chromosome) =>
      mutateChromosome(this.bases, this.mutationChance, chromosome);

    // pick remaining in pairs, until we have as many as the existing population
    // breeding each pair
    while (pool.length < organisms.length) {
      const selectedChromosomes = this.select(
        this.selectionMechanism,
        this.tournamentSize,
        organisms
      ).map(
        (organism) => organism.chromosome
      );

      const bredOrganisms = breed(
        mutator, this.crossoverChance,
        selectedChromosomes
      ).map(
        (chromosome) =>
          ({chromosome, fitness: this.fitnessFn(chromosome)})
      );

      pool = pool.concat(bredOrganisms);
    }

    // sort organisms by descending fitness.
    pool.sort((oa, ob) => ob.fitness - oa.fitness);

    return {organisms: pool};
  }

  count() {
    return this.population.organisms.length;
  }

  getBases() {
    return this.bases;
  }

  // Internal methods
  select() {
    const {organisms} = this.population;

    if (this.selectionMechanism === 'tournament') {
      return selectByTournament(this.tournamentSize, organisms);
    } else if (this.selectionMechanism === 'fitness-proportionate') {
      return selectByProportionateFitness(organisms);
    }

    throw new Error(`Unknown selection mechanism ${this.selectionMechanism}.`);
  }

}
