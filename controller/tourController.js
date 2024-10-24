const Tours = require('../model/tourmodel.js');
const APIFeatures = require('../api_features/apiFeatures.js');
const catchAsync = require('./catchAsyncError.js');
const AppError = require('../api_features/appError.js');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       message: `Missing ${req.body.name ? 'Prices' : 'Name'}`,
//     });
//   }
//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   const validId = tours.findIndex((tour) => tour.id === +val);

//   if (validId === -1) {
//     return res.status(404).json({
//       message: `Invalid ID`,
//     });
//   }
//   next();
// };

exports.getCheapTour = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary, difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tours.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .paging();
  const tours = await features.query;

  res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tours.create(req.body);

  res.status(201).json({
    message: 'Successfully',
    data: newTour,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tours.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No Tour found with this ID', 404)); // Fixed typo in error message
  }

  console.log('hi');
  res.status(201).json({
    message: 'Success',
    data: tour,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tours.updateOne(
    { _id: req.params.id },
    { $set: { ...req.body } },
  );
  // Tours.findOne({ _id: req.params.id });
  res.status(201).json({
    message: 'Success',
    data: tour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tours.findByIdAndDelete(req.params.id);
  // const find = tours.findIndex((tour) => tour.id === id);
  // tours.splice(find, 1);

  res.status(201).json({
    message: 'data Receive',
  });
});

exports.getTourState = catchAsync(async (req, res, next) => {
  const state = await Tours.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } },
    },
    {
      $group: {
        _id: { $toUpper: `$difficulty` },
        numTour: { $sum: 1 },
        ratingsAverage: { $avg: `$ratingsAverage` },
        averagePrice: { $avg: '$price' },
        numRating: { $sum: '$ratingsQuantity' },
        minAmount: { $min: '$price' },
        maxAmount: { $max: '$price' },
      },
    },
    {
      $sort: {
        averagePrice: -1,
      },
    },
  ]);

  res.status(201).json({
    message: 'data Receive',
    data: {
      state,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const state = await Tours.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-30`),
        },
      },
    },
    {
      $group: {
        _id: { $month: `$startDates` },
        numTours: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: `$_id` },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);

  res.status(201).json({
    message: 'data Receive',
    result: state.length,
    data: {
      state,
    },
  });
});
