import '../styles.scss';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Ride from './Ride';
import CreateRide from './CreateRide';

function ViewContainer({ currentView }) {
  const [selectedRideGeometry, setSelectedRideGeometry] = useState({
    coordinates: null,
    type: null,
    startLat: 40.7459,
    startLong: -73.95614,
    endLat: null,
    endLong: null,
  });
  const [rideList, setRideList] = useState([]);
  const [selectedRide, setSelectedRide] = useState();

  const [newRideCoords, setNewRideCoords] = useState({
    startLat: 0,
    startLong: 0,
    endLat: 0,
    endLong: 0,
  });
  const [rideAddStatus, setRideAddStatus] = useState();
  const [newRideName, setNewRideName] = useState('');

  const layerStyle = {
    id: 'route',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75,
    },
  };

  const rideGeoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          coordinates: selectedRideGeometry.coordinates,
          type: selectedRideGeometry.type,
        },
      },
    ],
  };

  const rideComponentList = [];

  function selectRideClickHandler(rideName) {
    const selectedRide = rideList.filter(
      (ride) => ride.ride_name === rideName
    )[0];
    setSelectedRide(rideName);
    const coordsLength = selectedRide.coordinates.length - 1;
    setSelectedRideGeometry(
      Object.assign(
        { ...selectedRideGeometry },
        {
          coordinates: selectedRide.coordinates,
          type: selectedRide.type,
          startLat: selectedRide.coordinates[0][1],
          startLong: selectedRide.coordinates[0][0],
          endLat: selectedRide.coordinates[coordsLength][1],
          endLong: selectedRide.coordinates[coordsLength][0],
        }
      )
    );
  }

  function mapRideClickHandler(e) {
    if (e.originalEvent.metaKey) {
      setNewRideCoords(
        Object.assign(
          { ...newRideCoords },
          {
            endLat: e.lngLat.lat,
            endLong: e.lngLat.lng,
          }
        )
      );
    } else {
      setNewRideCoords(
        Object.assign(
          { ...newRideCoords },
          {
            startLat: e.lngLat.lat,
            startLong: e.lngLat.lng,
          }
        )
      );
    }
  }

  function newRideButtonHandler(buttonName) {
    if (buttonName === 'clear') {
      setNewRideCoords(
        Object.assign(
          { ...newRideCoords },
          {
            startLat: 0,
            startLong: 0,
            endLat: 0,
            endLong: 0,
          }
        )
      );
      setNewRideName('');
    }
    if (buttonName === 'save-map-route') {
      setNewRideCoords(
        Object.assign(
          { ...newRideCoords },
          {
            startLat: 0,
            startLong: 0,
            endLat: 0,
            endLong: 0,
          }
        )
      );
      setNewRideName('');
      alert('Ride saved!');
    }
    setRideAddStatus(buttonName);
  }

  function populateRideComponentList() {
    for (let i = 0; i < rideList.length; i++) {
      rideComponentList.push(
        <Ride
          rideName={rideList[i].ride_name}
          clickHandler={selectRideClickHandler}
          selected={rideList[i].ride_name === selectedRide}
          key={rideList[i].ride_name}
        />
      );
    }
  }

  populateRideComponentList();

  useEffect(() => {
    fetch('/rides')
      .then((response) => response.json())
      .then((rideData) => {
        const initialRide = rideData[0];
        const coordsLength = initialRide.coordinates.length - 1;
        setRideList(rideData);
        setSelectedRide(initialRide.ride_name);
        setSelectedRideGeometry(
          Object.assign(
            { ...rideGeoJson },
            {
              coordinates: initialRide.coordinates,
              type: initialRide.type,
              startLat: initialRide.coordinates[0][1],
              startLong: initialRide.coordinates[0][0],
              endLat: initialRide.coordinates[coordsLength][1],
              endLong: initialRide.coordinates[coordsLength][0],
            }
          )
        );
      });
  }, [currentView]);

  return (
    <div id='site-container' className='d-flex justify-content-start'>
      <div id='left-container'>
        <div
          id='side-bar'
          className='d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary'
        >
          {currentView === 'map-view' ? (
            <div id='ride-list-section'>
              <a className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none'>
                <span className='fs-4' id='menu-title'>
                  Ride List
                </span>
              </a>
              <hr></hr>
              <ul className='nav nav-pills flex-column mb-auto'>
                {rideComponentList}
              </ul>
            </div>
          ) : null}
          {currentView === 'creator-view' ? (
            <div>
              <a className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none'>
                <span className='fs-4' id='menu-title'>
                  Ride Creator
                </span>
              </a>
              <div id='ride-creator-section'>
                <ol>
                  <li>Selct a start point by clicking on the map.</li>
                  <li>Select an endpoint by command-clicking.</li>
                  <li>Map and save your route.</li>
                </ol>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  onClick={() => newRideButtonHandler('get-map-route')}
                >
                  Map Route
                </button>
                <br />
                <br />

                <input
                  value={newRideName}
                  onChange={(e) => setNewRideName(e.target.value)}
                  placeholder='Ride Name'
                  className='form-control'
                  aria-label='Small'
                  aria-describedby='inputGroup-sizing-sm'
                ></input>
                <button
                  type='button'
                  className='btn btn-success btn-sm'
                  onClick={() => newRideButtonHandler('save-map-route')}
                >
                  Save Ride
                </button>
                <br />
                <br />
                <button
                  type='button'
                  className='btn btn-warning btn-sm'
                  onClick={() => newRideButtonHandler('clear')}
                >
                  Clear Mapped Ride
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {currentView === 'map-view' ? (
        <div id='map-container' className='d-flex'>
          <Map
            id='mainMap'
            mapLib={import('mapbox-gl')}
            initialViewState={{
              longitude: selectedRideGeometry.startLong,
              latitude: selectedRideGeometry.startLat,
              zoom: 12,
            }}
            style={{
              width: 900,
              height: 700,
              justifyContent: 'center',
              flexGrow: 1,
              flexShrink: 1,
            }}
            viewState={{
              longitude: selectedRideGeometry.startLong,
              latitude: selectedRideGeometry.startLat,
            }}
            mapStyle='mapbox://styles/mapbox/streets-v9'
            mapboxAccessToken='pk.eyJ1IjoiamFwcGxldG9uMTAxIiwiYSI6ImNrY2U1NXJtOTAzemIyenBiOGtkM2JsejMifQ.tRtcXxM39mpqPM-SHRCkJQ'
          >
            <Source id='my-data' type='geojson' data={rideGeoJson}>
              <Layer {...layerStyle} />
            </Source>
            <Marker
              longitude={selectedRideGeometry.startLong}
              latitude={selectedRideGeometry.startLat}
              color='green'
            ></Marker>
            <Marker
              longitude={selectedRideGeometry.endLong}
              latitude={selectedRideGeometry.endLat}
              color='red'
            ></Marker>
          </Map>
        </div>
      ) : (
        <CreateRide
          mapClickHandler={mapRideClickHandler}
          newRideCoords={newRideCoords}
          rideAddStatus={rideAddStatus}
          newRideName={newRideName}
        />
      )}
    </div>
  );
}

export default ViewContainer;
