import path from 'path'
import fs from 'fs/promises'
import fssync from 'fs'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'
import { Brand, Model, Variant } from '../server/db/schemas'

// Load env from backend/.env
dotenv.config({ path: path.resolve(process.cwd(), './.env') })

function getEnv(name: string, fallback?: string) {
  const v = process.env[name] || fallback
  if (!v) throw new Error(`Missing env ${name}`)
  return v
}

function resolveLocalPath(uploadUrl: string) {
  // uploadUrl like '/uploads/filename.webp' => backend/uploads/filename.webp
  const rel = uploadUrl.startsWith('/') ? uploadUrl.slice(1) : uploadUrl
  return path.resolve(process.cwd(), rel)
}

function guessContentType(p: string) {
  return (mime.lookup(p) || 'application/octet-stream') as string
}

async function uploadFile(client: S3Client, bucket: string, key: string, filePath: string) {
  const body = await fs.readFile(filePath)
  const ContentType = guessContentType(filePath)
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType }))
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const apply = process.argv.includes('--apply')
  if (!dryRun && !apply) {
    console.log('Usage: tsx scripts/migrate-local-uploads-to-r2.ts --dry-run | --apply')
    process.exit(1)
  }

  const bucket = getEnv('R2_BUCKET')
  const accountId = process.env.R2_ACCOUNT_ID
  const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined)
  const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : undefined)
  if (!publicBase) throw new Error('Set R2_PUBLIC_BASE_URL or R2_ENDPOINT to build public URL')

  const s3 = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint,
    credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
      accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    } : undefined,
    forcePathStyle: true,
  })

  const mongoUri = getEnv('MONGODB_URI', 'mongodb://localhost:27017/gadizone')
  await mongoose.connect(mongoUri)

  let migrated = 0, missing = 0

  const migrateUrlField = async (doc: any, fieldPath: string[]) => {
    // Walk nested path (supports arrays only for known fields)
    const last = fieldPath[fieldPath.length - 1]
    let target: any = doc
    for (let i = 0; i < fieldPath.length - 1; i++) target = target?.[fieldPath[i]]
    if (!target) return

    // Scalar string
    if (typeof target[last] === 'string' && target[last].startsWith('/uploads/')) {
      const url = target[last]
      const localPath = resolveLocalPath(url)
      if (!fssync.existsSync(localPath)) {
        console.warn('Missing local file, skipping:', localPath)
        missing++
        return
      }
      const key = url.startsWith('/') ? url.slice(1) : url // keep under uploads/*
      if (dryRun) {
        console.log(`[DRY] would upload ${localPath} -> s3://${bucket}/${key}`)
      } else {
        await uploadFile(s3, bucket, key, localPath)
      }
      const newUrl = `${publicBase}/${key}`
      target[last] = newUrl
      migrated++
      return
    }

    // Array of objects with url
    const arr = target[last]
    if (Array.isArray(arr)) {
      for (const item of arr) {
        if (item && typeof item.url === 'string' && item.url.startsWith('/uploads/')) {
          const url = item.url
          const localPath = resolveLocalPath(url)
          if (!fssync.existsSync(localPath)) {
            console.warn('Missing local file, skipping:', localPath)
            missing++
            continue
          }
          const key = url.startsWith('/') ? url.slice(1) : url
          if (dryRun) {
            console.log(`[DRY] would upload ${localPath} -> s3://${bucket}/${key}`)
          } else {
            await uploadFile(s3, bucket, key, localPath)
          }
          const newUrl = `${publicBase}/${key}`
          item.url = newUrl
          migrated++
        }
      }
    }
  }

  // Brands
  const brands = await Brand.find({}).lean(false)
  for (const b of brands) {
    await migrateUrlField(b, ['logo'])
    if (!dryRun) await b.save()
  }

  // Models
  const models = await Model.find({}).lean(false)
  for (const m of models) {
    await migrateUrlField(m, ['heroImage'])
    await migrateUrlField(m, ['galleryImages'])
    await migrateUrlField(m, ['keyFeatureImages'])
    await migrateUrlField(m, ['spaceComfortImages'])
    await migrateUrlField(m, ['storageConvenienceImages'])
    await migrateUrlField(m, ['colorImages'])
    if (!dryRun) await m.save()
  }

  // Variants
  const variants = await Variant.find({}).lean(false)
  for (const v of variants) {
    await migrateUrlField(v, ['highlightImages'])
    if (!dryRun) await v.save()
  }

  console.log(`Migration complete. Migrated: ${migrated}, Missing local files: ${missing}, Mode: ${dryRun ? 'DRY-RUN' : 'APPLY'}`)
  await mongoose.connection.close()
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
