import mongoose from 'mongoose'

const ContentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  text: { type: String, default: '' },
  image: { type: String, default: '' },
})

export default mongoose.model('Content', ContentSchema)