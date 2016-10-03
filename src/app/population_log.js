

export class PopulationLog {
  constructor(population, populations = []) {
    this.populations = [Object.assign({}, population)].concat(populations);
  }

  append(population) {
    return new PopulationLog(population, this.populations);
  }

  last() {
    return this.populations[0];
  }

  get length () {
    return this.populations.length;
  }

  view({page, pageSize, generation}) {
    if (pageSize) {
      const viewStart = page * pageSize;
      const viewEnd = (page + 1) * pageSize;

      return this.populations[generation].organisms.slice(viewStart, viewEnd);
    } else {
      return this.populations[generation].organisms;
    }
  }
}
