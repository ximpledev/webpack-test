import React from 'react';

import 'styles/header.scss';

class Header extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='header'>
        <h1>I'm header!</h1>
      </div>
    );
  }
}

export default Header;
