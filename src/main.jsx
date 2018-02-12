import _ from 'lodash';
import React from 'react';

import 'styles/main.scss';

class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      count: 0,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const fav = [
      'Xup',
      'yo,',
      'Webpack!'
    ];

    let s = '';
    _.forEach (
      fav,
      (item) => {
        s += `${item} `;
      }
    );

    console.log(s);
  }

  handleClick() {
    this.setState ({
      count: this.state.count + 1
    });
  }

  render() {
    return (
      <button
        id='counter-button'
        onClick={this.handleClick}>
        Count: {this.state.count}
      </button>
    );
  }
}

export default Main;
