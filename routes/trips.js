var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://admin:Abc123456@long-transportations.a4l6l.mongodb.net/";
const dbName = "transportation";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* GET trip page. */
router.get("/", async function (req, res, next) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const collectionCars = db.collection("cars");
    const collectionRoutes = db.collection("routes");
    const collectionDrivers = db.collection("drivers");
    const allCars = await collectionCars.find({}).toArray();
    const allDrivers = await collectionDrivers.find({}).toArray();
    const allRoutes = await collectionRoutes.find({}).toArray();

    res.render("trip", {
      title: "Trip",
      cars: allCars,
      drivers: allDrivers,
      routes: allRoutes,
    });
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

module.exports = router;
