import React from 'react';

//import 'styles/footer.css';
import 'styles/footer.scss';

class Footer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='footer'>
        <a href="#">I'm footer!</a>
      </div>
    );
  }
}

export default Footer;
