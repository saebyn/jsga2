/* @flow */
import React, {Component} from 'react';
import {Link} from 'react-router';


export class App extends Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired
  }

  render() {
    const {children} = this.props;

    return (
      <div className="container">
        <nav className="navbar navbar-light bg-faded">
          <ul className="nav navbar-nav" role="nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">JsGA</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create">Create</Link>
            </li>
          </ul>
        </nav>

        <main>
          {children}
        </main>
      </div>
    );
  }
}
