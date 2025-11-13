import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

async function testMongo() {
  const uri = process.env.MONGODB_URI
  console.log('Testing MongoDB connection...')
  console.log('URI length:', uri?.length)
  console.log('URI starts with:', uri?.substring(0, 20))
  console.log('URI contains port:', uri?.includes(':27017') || uri?.includes(':5001'))
  
  if (!uri) {
    throw new Error('MONGODB_URI not set')
  }
  
  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB connected successfully!')
    await mongoose.disconnect()
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message)
    throw error
  }
}

testMongo().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
