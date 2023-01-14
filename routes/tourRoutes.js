import express from 'express'
import advancedResults from '../middleware/advancedResults.js'
import Tour from '../models/tourModel.js'
import {
  createTour,
  deleteTour,
  getTopCheapestTours,
  getTopViewedTours,
  getTour,
  getTours,
  tourPhotoUpload,
  updateTour,
} from '../controllers/tourController.js'
import {
  tourValidator,
  updateTourValidator,
} from '../validators/tourSchemaValidateor.js'
import runValidation from '../validators/index.js'
const router = express.Router()

router
  .route('/')
  .get(advancedResults(Tour), getTours)
  .post(tourValidator, runValidation, createTour)
router.route('/trending').get(getTopViewedTours)
router.route('/cheapest').get(getTopCheapestTours)
router
  .route('/:id')
  .get(getTour)
  .put(updateTourValidator, runValidation, updateTour)
  .delete(deleteTour)
router.route('/:id/photo').put(tourPhotoUpload)

export default router
