import '../styles.scss';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ViewContainer from './ViewContainer';

function App() {
  const [pageView, setPageView] = useState('map-view');

  return (
    <div className='app-container'>
      <div className='title-header'>
        <h1>Bike NYC</h1>
      </div>
      <div>
        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <a
              className={
                pageView === 'map-view' ? 'nav-link active' : 'nav-link'
              }
              href='#'
              onClick={() => setPageView('map-view')}
            >
              Browse Rides
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={
                pageView === 'creator-view' ? 'nav-link active' : 'nav-link'
              }
              href='#'
              onClick={() => setPageView('creator-view')}
            >
              Create Ride
            </a>
          </li>
        </ul>
      </div>
      <div className='main-container'>
        <ViewContainer currentView={pageView} />
      </div>
    </div>
  );
}

export default App;
