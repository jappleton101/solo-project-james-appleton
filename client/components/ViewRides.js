import '../styles.scss';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Ride from './Ride';

function RideView({rideListProp}) {
  const [rideGeometry, setRideGeometry] = useState({
    coordinates: null,
    type: null,
    startLat: null,
    startLong: null,
    endLat: null,
    endLong: null,
  });
  const [rideList, setRideList] = useState([]);

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
          coordinates: rideGeometry.coordinates,
          type: rideGeometry.type,
        },
      },
    ],
  };

  const rideComponentList = [];

  function selectRideClickHandler(rideName) {
    const selectedRide = rideList.filter(
      (ride) => ride.ride_name === rideName
    )[0];
    const coordsLength = selectedRide.coordinates.length - 1;
    setRideGeometry(
      Object.assign(
        { ...rideGeometry },
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

  function populateRideComponentList() {
    for (let i = 0; i < rideList.length; i++) {
      rideComponentList.push(
        <Ride
          rideName={rideList[i].ride_name}
          clickHandler={selectRideClickHandler}
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
        setRideGeometry(
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
  }, []);

  return (
    <div id='map-container' className='d-flex'>
      <Map
        id='mainMap'
        mapLib={import('mapbox-gl')}
        initialViewState={{
          longitude: -73.95614,
          latitude: 40.7459,
          zoom: 12,
        }}
        style={{
          width: 900,
          height: 700,
          justifyContent: 'center',
          flexGrow: 1,
          flexShrink: 1,
        }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken='pk.eyJ1IjoiamFwcGxldG9uMTAxIiwiYSI6ImNrY2U1NXJtOTAzemIyenBiOGtkM2JsejMifQ.tRtcXxM39mpqPM-SHRCkJQ'
      >
        <Source id='my-data' type='geojson' data={rideGeoJson}>
          <Layer {...layerStyle} />
        </Source>
        <Marker
          longitude={rideGeometry.startLong}
          latitude={rideGeometry.startLat}
          color='green'
        ></Marker>
        <Marker
          longitude={rideGeometry.endLong}
          latitude={rideGeometry.endLat}
          color='red'
        ></Marker>
      </Map>
    </div>
  );
}

export default RideView;
