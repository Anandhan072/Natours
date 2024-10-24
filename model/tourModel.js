const slugify = require('slugify');

const validator = require('validator');

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Must be included Name'],
      trim: true,
      unique: true,
      minlength: [10, 'A tour name must have greater than 10 character'],
      maxlength: [40, 'A tour name must have less or equal to 40 character'],
      validate: [
        validator.isAlpha,
        'Tour name must only contained Alphabetic charters',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      default: 4,
    },
    maxGroupSize: {
      type: Number,
      default: 8,
    },
    difficulty: {
      type: String,
      required: [true, 'Must be included difficulty'],
      enum: { values: ['easy', 'medium', 'difficult'], message: 'Must hut be' },
    },
    ratingsAverage: {
      type: Number,
      default: 4.0,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 4000,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discount price ({VALUE}) should be less than the regular price',
      },
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      default: '',
    },
    images: [String],

    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// document Middleware
tourSchema.virtual('Weeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

// query Middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`query took ${Date.now() - this.start} millisecond`);
  console.log(doc);
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift(
    { $match: { secretTour: { $ne: true } } },
    { $project: { _id: 0 } },
  );
  console.log(this.pipeline());
  next();
});

const Tours = mongoose.model('Tours', tourSchema);

module.exports = Tours;
