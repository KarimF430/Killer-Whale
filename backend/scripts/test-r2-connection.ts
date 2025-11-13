import dotenv from 'dotenv'
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'

dotenv.config()

async function testR2Connection() {
  console.log('Testing R2 connection...')
  console.log('Bucket:', process.env.R2_BUCKET)
  console.log('Account ID:', process.env.R2_ACCOUNT_ID)
  console.log('Endpoint:', process.env.R2_ENDPOINT)
  console.log('Access Key ID:', process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing')
  console.log('Secret Access Key:', process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing')
  
  const accountId = process.env.R2_ACCOUNT_ID
  const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`
  
  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
  
  try {
    console.log('\nAttempting to list buckets...')
    const response = await client.send(new ListBucketsCommand({}))
    console.log('✅ Connection successful!')
    console.log('Buckets:', response.Buckets?.map(b => b.Name).join(', '))
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    if (error.Code) console.error('Error code:', error.Code)
    throw error
  }
}

testR2Connection().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
