/* eslint-disable */
export interface RNG {
  random(): number;
  intBetween(start: number, end: number): number;
  range(start: number, end: number): number;
}

export type Base = string;
export type Chromosome = Base[];

export type Organism = {
  chromosome: Chromosome,
  fitness: number,
};


export type Population = {
  organisms: Organism[],
};

export type PopulationWithStats = {
  organisms: Organism[],
  stats: {
    min: number,
    max: number,
    median: number,
    mean: number,
  },
};
