const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://jappleton101:tetOUzAnagNRfbAU@personal-database.n79iw9r.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'bike-nyc',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;
const routeGeometrySchema = new Schema({
  coordinates: [],
  type: String,
  ride_name: String
});

const RouteGeometry = mongoose.model('routeGeometry', routeGeometrySchema);

module.exports = {
  RouteGeometry,
};
