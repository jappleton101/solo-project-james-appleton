import '../styles.scss';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function CreateRide({
  rideAddStatus,
  mapClickHandler,
  newRideCoords,
  newRideName,
}) {
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

  const [newRideGeoJson, setNewRideGeoJson] = useState({
    coordinates: [[0, 0]],
    type: 'LineString',
  });

  const rideGeoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          coordinates: newRideGeoJson.coordinates,
          type: newRideGeoJson.type,
        },
      },
    ],
  };

  useEffect(() => {
    if (rideAddStatus === 'clear') {
      setNewRideGeoJson(
        Object.assign(
          { ...newRideGeoJson },
          {
            coordinates: [[0, 0]],
            type: 'LineString',
          }
        )
      );
      console.log('Clearing data...');
      return;
    }

    if (!Object.values(newRideCoords).some((val) => val === 0)) {
      if (rideAddStatus === 'get-map-route') {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        fetch('/findroute', {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(newRideCoords),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setNewRideGeoJson(
              Object.assign(
                { ...newRideGeoJson },
                {
                  coordinates: result.coordinates,
                  type: result.type,
                }
              )
            );
          });
        return;
      }
      if (rideAddStatus === 'save-map-route') {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        fetch('/rides', {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            coordinates: newRideGeoJson.coordinates,
            type: newRideGeoJson.type,
            ride_name: newRideName,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          });
        return;
      }
    }
  }, [rideAddStatus]);

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
        mapboxAccessToken=MAPBOX_TOKEN
        onClick={mapClickHandler}
      >
        {newRideGeoJson.coordinates.length > 1 ? (
          <Source id='my-data' type='geojson' data={rideGeoJson}>
            <Layer {...layerStyle} />
          </Source>
        ) : null}
        <Marker
          longitude={newRideCoords.startLong}
          latitude={newRideCoords.startLat}
          color='green'
        ></Marker>
        <Marker
          longitude={newRideCoords.endLong}
          latitude={newRideCoords.endLat}
          color='red'
        ></Marker>
      </Map>
    </div>
  );
}

export default CreateRide;
