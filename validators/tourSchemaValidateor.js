import { check } from 'express-validator'

const tourValidator = [
  check('name')
    .not()
    .isEmpty()
    .isLength({ max: 50 })
    .withMessage('Name is required'),
  // check('viewCount').isInt({min: 100}).withMessage('Must be a number'),
  check('description')
    .not()
    .isEmpty()
    .isLength({ max: 500 })
    .withMessage('Description can not be more than 500 characters'),
  check('price')
    .isInt({ min: 100 })
    .withMessage('Price is required and must be a number greater than 100'),
  check('location').not().isEmpty().withMessage('Location is required'),
]

const updateTourValidator = [
  check('name')
    .isLength({ max: 50 })
    .withMessage('Name can not be more than 50 characters'),
  check('description')
    .isLength({ max: 500 })
    .withMessage('Description can not be more than 500 characters'),
  check('price')
    .isInt({ min: 100 })
    .withMessage('Price is required and must be a number greater than 100'),
]

export { tourValidator, updateTourValidator }
