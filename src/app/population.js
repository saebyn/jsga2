import React, {Component} from 'react';

import {ChromosomesLegend} from './chromosomes_legend';
import {ChromosomesChart} from './chromosomes_chart';
import {GA} from './ga';
import {Paginate} from './paginate';
import {Runner} from './runner';

export class Population extends Component {
  constructor(props) {
    super(props);

    const settings = JSON.parse(props.location.query.settings);

    this.state = {
      ga: new GA(settings),
      settings,
      generation: 0,
      page: 0,
      pageSize: 36,
    };

    this.handleStep = () => {
      this.setState({ga: this.state.ga.step()});
    };

    this.handleGotoPage = (page) => {
      this.setState({page});
    };
  }

  render() {
    const {ga, generation, page, pageSize} = this.state;

    const chromosomesCount = ga ? ga.count() : 0;

    return (
      <div>
        <div className="row">
          <Runner onStep={this.handleStep} ga={ga} />
        </div>
        <div className="row">
          <ChromosomesLegend
            generation={generation}
            page={page}
            pageSize={pageSize}
            ga={ga}
            />
        </div>
        <div className="row">
          <ChromosomesChart
            generation={generation}
            page={page}
            pageSize={pageSize}
            ga={ga}
            />
        </div>
        <div className="row">
          <Paginate
            onGotoPage={this.handleGotoPage}
            currentPage={page}
            pages={Math.ceil(chromosomesCount / pageSize)}
            />
        </div>
      </div>
    );
  }
}

Population.contextTypes = {
  router: React.PropTypes.object.isRequired
};
