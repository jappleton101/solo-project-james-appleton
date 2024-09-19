const mapboxController = {};

mapboxController.findroute = async (req, res, next) => {
  try {
    console.log('MapboxController.findRoute');
    console.log(req);
    const rideDetails = await fetch(
      'https://api.mapbox.com/directions/v5/mapbox/cycling/' +
        req.body.startLong +
        '%2C' +
        req.body.startLat +
        '%3B' +
        req.body.endLong +
        '%2C' +
        req.body.endLat +
        '?alternatives=true&continue_straight=true&geometries=geojson&exclude=ferry&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiamFwcGxldG9uMTAxIiwiYSI6ImNrY2U1NXJtOTAzemIyenBiOGtkM2JsejMifQ.tRtcXxM39mpqPM-SHRCkJQ'
    ).then((response) => response.json());
    res.locals.geometry = rideDetails.routes[0].geometry;
    console.log(res.locals.geometry);
    console.log('Res locals set');
    return next();
  } catch (e) {
    return next({ error: e });
  }
};

module.exports = mapboxController;
