import _ from 'lodash';
import fav from './fav';

let s = '';
_.forEach (
  fav,
  (item) => {
    s += `${item} `;
  }
);

alert(s);
