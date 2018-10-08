import Footer   from './footer';
import Header   from './header';
import Main     from './main';
import React    from 'react';
import ReactDOM from 'react-dom';

document.addEventListener (
  'DOMContentLoaded',
  () => {
    let header = document.getElementsByTagName('header')[0];

    ReactDOM.render (
      React.createElement(Header),
      header
    );

    let main = document.getElementsByTagName('main')[0];

    ReactDOM.render (
      React.createElement(Main),
      main
    );

    let footer = document.getElementsByTagName('footer')[0];

    ReactDOM.render (
      React.createElement(Footer),
      footer
    );
  }
);
