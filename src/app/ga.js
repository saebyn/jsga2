import {breed, generatePool, mutateChromosome} from './ga/reproduction';
import {selectByProportionateFitness, selectByTournament} from './ga/selection';
import {elementGenerator} from './ga/utils';


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
      return elementGenerator(settings.bases, settings.chromosomeLength);
    }

    let organisms = generatePool(settings.startingPopulation, chromosomeGenerator, preparedSettings.fitnessFn);

    // sort organisms by descending fitness.
    organisms.sort((oa, ob) => ob.fitness - oa.fitness);

    return new GA(preparedSettings, {organisms}, []);
  }

  step() {
    const {organisms} = this.population;

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
      {organisms: pool},
      [this.population].concat(this.previousGenerations)
    );
  }

  count() {
    return this.population.organisms.length;
  }

  countGenerations() {
    return this.previousGenerations.length + 1;
  }

  getBases() {
    return this.bases;
  }

  view(start, end, generation = 0) {
    const {organisms} = [this.population].concat(this.previousGenerations)[generation];

    return organisms.slice(start, end);
  }

  // Internal methods
  constructor(settings, population, previousGenerations) {
    this.fitnessFn = settings.fitnessFn;

    this.population = population;

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
    const {organisms} = this.population;

    if (this.selectionMechanism === 'tournament') {
      return selectByTournament(this.tournamentSize, organisms);
    } else if (this.selectionMechanism === 'fitness-proportionate') {
      return selectByProportionateFitness(organisms);
    }

    throw new Error(`Unknown selection mechanism ${this.selectionMechanism}.`);
  }

}
