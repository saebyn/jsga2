import React, {Component} from 'react';

import {Chromosomes} from './chromosomes';
import {GA} from './ga';
import {Paginate} from './paginate';
import {PopulationSettings} from './population_settings';
import {Runner} from './runner';

export class Population extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ga: null,
      generation: 0,
      page: 0,
      pageSize: 36,
    };

    this.handleCreate = (settings) => {
      this.setState({ga: new GA(settings)});
    };

    this.handleReset = () => {
      this.setState({ga: null, generation: 0});
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <PopulationSettings
              onCreate={this.handleCreate}
              onReset={this.handleReset}
              />
          </div>

          {
            this.state.ga
            ? <div className="col-sm-9">
                <div className="row">
                  <Runner onStep={this.handleStep} ga={ga} />
                </div>
                <div className="row">
                  <Chromosomes
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
              </div> : null
          }
        </div>
      </div>
    );
  }
}
