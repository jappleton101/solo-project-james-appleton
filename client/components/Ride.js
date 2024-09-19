import '../styles.scss';
import * as React from 'react';

function Ride({ rideName, clickHandler, selected }) {
  return (
    <li className={selected ? 'selected-ride' : 'ride'}>
      <button
        className='nav-link link-body-emphasis'
        onClick={() => clickHandler(rideName)}
      >
        {rideName}
      </button>
    </li>
  );
}

export default Ride;
