import React, {Component} from 'react';
import {Link} from 'react-router';


export class Hello extends Component {
  render() {
    return (
      <div className="jumbotron">
        <h1 className="display-3">Hi</h1>

        <p className="lead">
          <a href="https://github.com/saebyn/jsga2">This</a> is a rewrite of <a href="https://github.com/saebyn/jsga">jsga</a>, a genetic algorithm demo I wrote about five years ago.
        </p>

        <p>
          In this demo, you can create and watch <b>selection</b>, <b>crossover</b>, and <b>mutation</b> happen over a population of randomly created organisms.
        </p>

        <p className="lead">
          <Link to="/create" className="btn btn-primary btn-lg">Get started</Link>
        </p>
      </div>
    );
  }
}
