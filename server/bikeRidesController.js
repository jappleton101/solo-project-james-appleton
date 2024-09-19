const models = require('./bikeRideModels');

const bikeRidesController = {};

bikeRidesController.getAllRides = async (req, res, next) => {
  try {
    const geometryResult = await models.RouteGeometry.find({}, null, {
      limit: 5,
    });
    res.locals.geometry = geometryResult;
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

bikeRidesController.createNewRide = async (req, res, next) => {
  console.log('Bike rides controller');
  // Create new record in mongodb
  try {
    console.log(req.body);
    const geometryResult = await models.RouteGeometry.create({
      coordinates: req.body.coordinates,
      type: req.body.type,
      ride_name: req.body.ride_name,
    });
    console.log(geometryResult);
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

module.exports = bikeRidesController;
