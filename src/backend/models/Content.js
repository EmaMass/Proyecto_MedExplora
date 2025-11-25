import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  text: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

export default mongoose.model('Content', contentSchema)