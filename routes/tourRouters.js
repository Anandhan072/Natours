const express = require('express');
const {
  getAllTours,
  createNewTour,
  getTourState,
  getTour,
  updateTour,
  deleteTour,
  getCheapTour,
  getMonthlyPlan,
} = require('../controller/tourController');

const router = express.Router();

// router.param('id', checkId);

router.route('/get-cheap-tour').get(getCheapTour, getAllTours);

router.route('/get-year/:year').get(getMonthlyPlan);

router.route('/get-avg').get(getTourState);
router.route('/monthly-plan');

router.route('/').get(getAllTours).post(createNewTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
