/* @flow */
import type {Base, Organism, RNG} from './types';
import {breed, mutateChromosome} from './ga/reproduction';
import {selectByProportionateFitness, selectByTournament} from './ga/selection';
import Random from 'random-seed';
import {elementGenerator} from './ga/utils';
import {generatePool} from './ga/generator';


/* eslint-disable no-new-func */
function buildFitnessFunction(fitnessFunctionSource: string) {
  return new Function('chromosome', fitnessFunctionSource);
}

/* eslint-enable no-new-func */

type Settings = {
  bases: Base[],
  seed: number,
  startingPopulation: number,
  fitnessFunctionSource: string,
  chromosomeLength: number,
  selectionMechanism: string,
  tournamentSize: number,
  elitism: boolean,
  selectionElitism: number,
  crossoverChance: number,
  mutationChance: number,
};


type Population = {organisms: Organism[]};

export class GA {
  bases: Base[];
  rng: RNG;
  seed: number;
  startingPopulation: number;
  fitnessFn: Function;
  chromosomeLength: number;
  selectionMechanism: string;
  tournamentSize: number;
  elitism: number;
  crossoverChance: number;
  mutationChance: number;

  constructor(settings: Settings) {
    this.fitnessFn = buildFitnessFunction(settings.fitnessFunctionSource);

    this.rng = Random.create(settings.seed);
    this.bases = settings.bases;
    this.chromosomeLength = settings.chromosomeLength;
    this.startingPopulation = settings.startingPopulation;
    this.elitism = settings.elitism ? settings.selectionElitism : 0;
    this.tournamentSize = settings.tournamentSize;
    this.bases = settings.bases;
    this.selectionMechanism = settings.selectionMechanism;
    this.crossoverChance = settings.crossoverChance;
    this.mutationChance = settings.mutationChance;
  }

  spawn() {
    const chromosomeGenerator = () =>
      elementGenerator(this.rng, this.bases, this.chromosomeLength);

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

  step(population: Population) {
    const {organisms} = population;
    // assert organisms is sorted by fitness in descending order.

    // choose elite
    let pool = organisms.slice(0, Math.ceil(this.elitism * organisms.length));

    const mutator = (chromosome) =>
      mutateChromosome(this.rng, this.bases, this.mutationChance, chromosome);

    // pick remaining in pairs, until we have as many as the existing population
    // breeding each pair
    while (pool.length < organisms.length) {
      const selectedChromosomes = this.select(
        organisms
      ).map(
        (organism) => organism.chromosome
      );

      const bredOrganisms = breed(
        this.rng,
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

  getBases() {
    return this.bases;
  }

  // Internal methods
  select(organisms: Organism[]) {
    if (this.selectionMechanism === 'tournament') {
      return selectByTournament(this.rng, this.tournamentSize, organisms);
    } else if (this.selectionMechanism === 'fitness-proportionate') {
      return selectByProportionateFitness(this.rng, organisms);
    }

    throw new Error(`Unknown selection mechanism ${this.selectionMechanism}.`);
  }

}
