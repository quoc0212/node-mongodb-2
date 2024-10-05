var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { MongoClient } = require("mongodb");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var carsRouter = require("./routes/cars");
var driversRouter = require("./routes/drivers");
var tripsRouter = require("./routes/trips");
var routesRouter = require("./routes/routes");
var queryRouter = require("./routes/query");

var app = express();

const url = "<your connection string>";
const dbName = "your DB name";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/drivers", driversRouter);
app.use("/cars", carsRouter);
app.use("/routes", routesRouter);
app.use("/trips", tripsRouter);
app.use("/query", queryRouter);

app.post("/create-car", async function (req, res) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("cars");

    const newCar = {
      car_id: req.body.car_id,
      bien_so: req.body.bien_so,
      mau_xe: req.body.mau_xe,
      hang_san_xuat: req.body.hang_san_xuat,
      doi_xe: req.body.doi_xe,
      model: req.body.model,
      so_ghe: parseInt(req.body.so_ghe),
      so_nam_su_dung: parseInt(req.body.so_nam_su_dung),
      ngay_bao_duong_cuoi: new Date(req.body.ngay_bao_duong_cuoi),
    };

    await collection.insertOne(newCar, (err, result) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/cars");
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/create-driver", async function (req, res) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("drivers");

    const newDriver = {
      driver_id: req.body.driver_id,
      ten: req.body.ten,
      cmt: req.body.cmt,
      ma_so_bang_lai: req.body.ma_so_bang_lai,
      loai_bang_lai: req.body.loai_bang_lai,
      dia_chi: req.body.dia_chi,
      ngay_sinh: new Date(req.body.ngay_sinh),
      tham_nien: parseInt(req.body.tham_nien),
    };

    await collection.insertOne(newDriver, (err, result) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/drivers");
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/create-route", async function (req, res) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("routes");

    const newRoute = {
      route_id: req.body.route_id,
      diem_dau: req.body.diem_dau,
      diem_cuoi: req.body.diem_cuoi,
      do_dai: parseInt(req.body.do_dai),
      do_phuc_tap: parseInt(req.body.do_phuc_tap),
      duong_kho: parseFloat(req.body.duong_kho),
    };

    await collection.insertOne(newRoute, (err, result) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/routes");
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/create-trip", async function (req, res) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("trips");

    const newTrip = {
      trip_id: req.body.trip_id,
      ma_so_chuyen_xe: req.body.ma_so_chuyen_xe,
      car_id: req.body.car_id,
      tuyen: req.body.tuyen,
      ten_lai_xe: req.body.ten_lai_xe,
      ten_phu_xe: req.body.ten_phu_xe,
      so_khach: parseInt(req.body.so_khach),
      gia_ve: parseInt(req.body.gia_ve),
      ngay_bat_dau: new Date(req.body.ngay_bat_dau),
      ngay_ket_thuc: new Date(req.body.ngay_ket_thuc),
    };

    await collection.insertOne(newTrip, (err, result) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/trips");
    console.log("Connected successfully to MongoDB");
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/filter-aggregate", async function (req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(req.body.table);
    console.log(typeof req.body.query);
    const result = await collection.aggregate(req.body.query).toArray();
    res.send(result);
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.get("/question-1", async function (req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("trips");

    const result = await collection
      .aggregate([
        {
          $match: {
            ngay_ket_thuc: { $lte: new Date() },
          },
        },
        {
          $lookup: {
            from: "routes",
            localField: "route_id",
            foreignField: "tuyen",
            as: "routeInfo",
          },
        },
        {
          $addFields: {
            he_so: {
              $switch: {
                branches: [
                  {
                    case: { $eq: [{ $first: "$routeInfo.do_phuc_tap" }, 1] },
                    then: 0.8,
                  },
                  {
                    case: { $eq: [{ $first: "$routeInfo.do_phuc_tap" }, 2] },
                    then: 1.2,
                  },
                  {
                    case: { $eq: [{ $first: "$routeInfo.do_phuc_tap" }, 3] },
                    then: 3.5,
                  },
                ],
                default: 1,
              },
            },
          },
        },
        {
          $unwind: "$routeInfo",
        },
        {
          $lookup: {
            from: "drivers",
            let: { tripLaiXe: "$ten_lai_xe", tripPhuXe: "$ten_phu_xe" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$driver_id", "$$tripLaiXe"] },
                      { $eq: ["$driver_id", "$$tripPhuXe"] },
                    ],
                  },
                },
              },
            ],
            as: "driverDetails",
          },
        },
        {
          $unwind: "$driverDetails",
        },
        {
          $group: {
            _id: "$driverDetails.driver_id",
            totalAmount: {
              $sum: {
                $cond: {
                  if: { $eq: ["$ten_lai_xe", "$driverDetails.driver_id"] },
                  then: { $multiply: ["$gia_ve", "$so_khach", "$he_so", 2] },
                  else: { $multiply: ["$gia_ve", "$so_khach", "$he_so"] },
                },
              },
            },
            driverDetails: { $first: "$driverDetails" },
          },
        },
        { $skip: 0 },
        { $limit: 10 },
      ])
      .toArray();
    res.send(result);
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/create-trip", async function (req, res) {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("trips");

    const newTrip = {
      trip_id: req.body.trip_id,
      ma_so_chuyen_xe: req.body.ma_so_chuyen_xe,
      car_id: req.body.car_id,
      tuyen: req.body.tuyen,
      ten_lai_xe: req.body.ten_lai_xe,
      ten_phu_xe: req.body.ten_phu_xe,
      so_khach: req.body.so_khach,
      gia_ve: req.body.gia_ve,
      ngay_bat_dau: req.body.ngay_bat_dau,
      ngay_ket_thuc: req.body.ngay_ket_thuc,
    };

    await collection.insertOne(newTrip, (err, result) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/trips");
    console.log("Connected successfully to MongoDB");
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/question-1", async function (req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("trips");

    const result = await collection
      .aggregate([
        {
          $match: {
            ngay_ket_thuc: { $lte: new Date() },
          },
        },
        {
          $lookup: {
            from: "routes",
            localField: "route_id",
            foreignField: "tuyen",
            as: "routeInfo",
          },
        },
        {
          $addFields: {
            he_so: {
              $switch: {
                branches: [
                  {
                    case: { $eq: [{ $first: "$routeInfo.do_phuc_tap" }, 1] },
                    then: 0.8,
                  },
                  {
                    case: { $eq: [{ $first: "$routeInfo.do_phuc_tap" }, 2] },
                    then: 1.2,
                  },
                  {
                    case: { $eq: [{ $first: "$routeInfo.do_phuc_tap" }, 3] },
                    then: 3.5,
                  },
                ],
                default: 1,
              },
            },
          },
        },
        {
          $unwind: "$routeInfo",
        },
        {
          $lookup: {
            from: "drivers",
            let: { tripLaiXe: "$ten_lai_xe", tripPhuXe: "$ten_phu_xe" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$driver_id", "$$tripLaiXe"] },
                      { $eq: ["$driver_id", "$$tripPhuXe"] },
                    ],
                  },
                },
              },
            ],
            as: "driverDetails",
          },
        },
        {
          $unwind: "$driverDetails",
        },
        {
          $group: {
            _id: "$driverDetails.driver_id",
            totalAmount: {
              $sum: {
                $cond: {
                  if: { $eq: ["$ten_lai_xe", "$driverDetails.driver_id"] },
                  then: { $multiply: ["$gia_ve", "$so_khach", "$he_so", 2] },
                  else: { $multiply: ["$gia_ve", "$so_khach", "$he_so"] },
                },
              },
            },
            driverDetails: { $first: "$driverDetails" },
          },
        },
        { $skip: 0 },
        { $limit: 10 },
      ])
      .toArray();
    res.render("result_1", { title: "Result", result: result });
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/question-2", async function (req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("trips");

    const result = await collection
      .aggregate([
        {
          $match: {
            ngay_bat_dau: { $gte: new Date(req.body.ngay_bat_dau) },
            ngay_ket_thuc: { $lte: new Date(req.body.ngay_ket_thuc) },
          },
        },
        {
          $lookup: {
            from: "cars",
            localField: "car_id",
            foreignField: "car_id",
            as: "carInfo",
          },
        },
        {
          $unwind: "$carInfo",
        },
        {
          $group: {
            _id: "$carInfo.car_id",
            bien_so: { $first: "$carInfo.bien_so" },
            mau_xe: { $first: "$carInfo.mau_xe" },
            hang_san_xuat: { $first: "$carInfo.hang_san_xuat" },
            doi_xe: { $first: "$carInfo.doi_xe" },
            model: { $first: "$carInfo.model" },
            so_ghe: { $first: "$carInfo.so_ghe" },
            so_nam_su_dung: { $first: "$carInfo.so_nam_su_dung" },
            ngay_bao_duong_cuoi: { $first: "$carInfo.ngay_bao_duong_cuoi" },
            doanh_thu: { $sum: { $multiply: ["$gia_ve", "$so_khach"] } },
          },
        },
        { $skip: 0 },
        { $limit: 10 },
      ])
      .toArray();
    res.render("result_2", { title: "Result", result: result });
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

app.post("/question-3", async function (req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("trips");

    const result = await collection
      .aggregate([
        {
          $lookup: {
            from: "routes",
            localField: "route_id",
            foreignField: "tuyen",
            as: "routeInfo",
          },
        },
        {
          $lookup: {
            from: "cars",
            localField: "car_id",
            foreignField: "car_id",
            as: "carInfo",
          },
        },
        {
          $addFields: {
            so_ngay_con_lai: {
              $subtract: [
                360,
                {
                  $dateDiff: {
                    startDate: { $first: "$carInfo.ngay_bao_duong_cuoi" },
                    endDate: new Date(),
                    unit: "day",
                  },
                },
              ],
            },
            he_so_tru: {
              $multiply: [
                { $first: "$routeInfo.do_dai" },
                { $first: "$routeInfo.duong_kho" },
                0.01,
              ],
            },
          },
        },
        {
          $group: {
            _id: "$car_id",
            carInfo: { $first: "$carInfo" },
            so_ngay_can_tru: {
              $sum: "$he_so_tru",
            },
            so_ngay_chua_tru: { $first: "$so_ngay_con_lai" },
          },
        },
        {
          $addFields: {
            den_ngay_bao_duong: {
              $dateAdd: {
                startDate: { $first: "$carInfo.ngay_bao_duong_cuoi" },
                unit: "day",
                amount: {
                  $floor: {
                    $subtract: ["$so_ngay_chua_tru", "$so_ngay_can_tru"],
                  },
                },
              },
            },
          },
        },
        { $skip: 0 },
        { $limit: 10 },
      ])
      .toArray();
    res.render("result_3", { title: "Result", result: result });
  } catch (e) {
    console.error(e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error" });
});

module.exports = app;
