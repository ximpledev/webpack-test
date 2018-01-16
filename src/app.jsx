console.log('Hello World!');

import React    from 'react';
import ReactDOM from 'react-dom';
import Counter  from './counter';

document.addEventListener (
  'DOMContentLoaded',
  () => {
    ReactDOM.render (
      React.createElement(Counter),
      document.getElementById('main')
    );
  }
);
