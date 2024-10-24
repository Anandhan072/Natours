const express = require('express');
const morgan = require('morgan');
const AppError = require('./api_features/appError');
const globalErrorController = require('./controller/errorController');
const tourRoute = require('./routes/tourRouters');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public/`));

app.use((req, res, next) => {
  req.body.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`cont find the URL ${req.url}`, 404));
});

app.use(globalErrorController);

module.exports = app;
