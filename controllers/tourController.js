import asyncHandler from 'express-async-handler'
import Tour from '../models/tourModel.js'
import ErrorResponse from '../utils.js/errorResponse.js'
import path from 'path'

// @desc      Get all tours
// @route     GET /api/v1/tours
// @access    Public
const getTours = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Create new tour
// @route     POST /api/v1/tours
// @access    Public
const createTour = asyncHandler(async (req, res) => {
  const tour = await Tour.create(req.body)
  res.status(201).json({
    success: true,
    data: tour,
  })
})

// @desc      Get single tour
// @route     GET /api/v1/tours/:id
// @access    Public
const getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(
      new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404)
    )
  }
  //increment by one the viewCount
  const updatetedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { viewCount: 1 },
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({ success: true, data: updatetedTour })
})

//@dec    Update tour
//@route   PUT /api/v1/tours/:id
//@access  Public
const updateTour = asyncHandler(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(
      new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404)
    )
  }
  tour = await Tour.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: tour })
})

//@dec    Delete tour
//@route   DELETE /api/v1/tours/:id
//@access  Public
const deleteTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(
      new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404)
    )
  }
  tour.remove()
  res.status(200).json({ success: true, data: {} })
})

//@dec     Upload photo for tour
//@route   PUT /api/v1/tours/:id/photo
//@access  Public
const tourPhotoUpload = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(
      new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404)
    )
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }
  const file = req.files.file
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }
  // Create custom filename
  file.name = `photo_${tour._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }
    await Tour.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({
      success: true,
      data: file.name,
    })
  })
})

//@dec     Get top 5 cheap tours
//@route   GET /api/v1/tours/cheapest
//@access  Public
const getTopCheapestTours = asyncHandler(async (req, res, next) => {
  const tours = await Tour.find().sort({ price: 1 }).limit(3)
  res.status(200).json({ success: true, data: tours })
})

//@dec     Get top 3 viewed tour
//@route   GET /api/v1/tours/trending
//@access  Public
const getTopViewedTours = asyncHandler(async (req, res, next) => {
  const tours = await Tour.find().sort({ viewCount: -1 }).limit(3)
  res.status(200).json({ success: true, data: tours })
})

export {
  getTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  tourPhotoUpload,
  getTopCheapestTours,
  getTopViewedTours,
}
