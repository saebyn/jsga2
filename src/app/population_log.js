/* @flow */
import type {Organism, Population, PopulationWithStats} from './types';

type ViewArgs = {
  page: number,
  pageSize: number,
  generation: number,
};

type StatCategory = 'max' | 'min' | 'mean' | 'median';

function isOdd(number) {
  return number % 2 !== 0;
}

function sum(numbers) {
  return numbers.reduce((aa, bb) => aa + bb, 0);
}

function pluck(property) {
  return function pluckValue(value) {
    return value[property];
  };
}


export class PopulationLog {
  populations: PopulationWithStats[];

  constructor({organisms}: Population, populations: PopulationWithStats[] = []) {
    // population should be
    //  - an Array
    //  - containing objects like
    //      {organisms: [{fitness: N}, ...]}
    //    where organisms is sorted descending by fitness.
    //    and fitness (N) is a float that ranges from zero.
    const fitnesses = organisms.map((oo) => oo.fitness);
    let stats = {
      max: 0,
      min: 0,
      mean: 0,
      median: 0,
    };

    if (fitnesses.length > 0) {
      let halfIndex = Math.floor(fitnesses.length / 2);
      let median = fitnesses[halfIndex];

      if (isOdd(fitnesses.length)) {
        median = (fitnesses[halfIndex] + fitnesses[halfIndex + 1]) / 2;
      }

      stats = {
        max: fitnesses.length > 0 ? fitnesses[0] : 0,
        min: fitnesses.length > 0 ? fitnesses[fitnesses.length - 1] : 0,
        mean: sum(fitnesses) / fitnesses.length,
        median,
      };
    }

    this.populations = [{organisms, stats}].concat(populations);
  }

  append(population: Population) {
    return new PopulationLog(population, this.populations);
  }

  last() {
    return this.populations[0];
  }

  get length (): number {
    return this.populations.length;
  }

  getFitnessStats(category: StatCategory) {
    let stats = this.populations
      .map(pluck('stats'))
      .map(pluck(category));

    stats.reverse();

    return stats;
  }

  view({page, pageSize, generation}: ViewArgs): Organism[] {
    if (pageSize) {
      const viewStart = page * pageSize;
      const viewEnd = (page + 1) * pageSize;

      return this.populations[generation].organisms.slice(viewStart, viewEnd);
    } else {
      return this.populations[generation].organisms;
    }
  }
}
