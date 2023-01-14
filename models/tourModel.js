import mongoose from 'mongoose'
import slugify from 'slugify'

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
  },
  {
    timestamps: true,
  }
)

// Create Tour slug from the name
TourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})


const Tour = mongoose.model('Tour', TourSchema)
export default Tour
