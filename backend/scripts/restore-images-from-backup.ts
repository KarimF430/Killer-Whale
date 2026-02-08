import path from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Restore images referenced in backup JSON files to R2, and rewrite JSON to use public R2 URLs
// Supported sources:
// - brands.json -> logo
// - models.json -> heroImage, galleryImages[].url, keyFeatureImages[].url, spaceComfortImages[].url, storageConvenienceImages[].url, colorImages[].url
// - variants.json -> highlightImages[].url (if any)
// - news-articles.json -> contentBlocks[].imageUrl, featuredImage (if was local uploads)
// - news-media.json -> url

dotenv.config()

const DATA_DIR = path.join(process.cwd(), 'data')
const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

function isLocalUploadsUrl(value: any): value is string {
  return typeof value === 'string' && value.startsWith('/uploads/')
}

function contentTypeFromExt(ext: string): string {
  const e = ext.toLowerCase()
  if (e === '.webp') return 'image/webp'
  if (e === '.png') return 'image/png'
  if (e === '.jpg' || e === '.jpeg') return 'image/jpeg'
  if (e === '.gif') return 'image/gif'
  return 'application/octet-stream'
}

async function fileExists(abs: string): Promise<boolean> {
  try { await fs.access(abs); return true } catch { return false }
}

async function resolveLocalPathFromUploadsUrl(uploadsUrl: string): Promise<{ abs: string, key: string, contentType: string } | null> {
  // Keep the same key path in R2
  const rel = uploadsUrl.replace(/^\//, '') // remove leading /
  const absCandidate = path.join(process.cwd(), rel)
  const ext = path.extname(rel)
  const base = ext ? absCandidate.slice(0, -ext.length) : absCandidate
  const candidates = [absCandidate]
  // Try popular alternates if the specific ext missing
  if (ext !== '.webp') candidates.push(base + '.webp')
  if (ext !== '.jpg') candidates.push(base + '.jpg')
  if (ext !== '.jpeg') candidates.push(base + '.jpeg')
  if (ext !== '.png') candidates.push(base + '.png')

  for (const abs of candidates) {
    if (await fileExists(abs)) {
      return { abs, key: rel, contentType: contentTypeFromExt(path.extname(abs)) }
    }
  }
  return null
}

function getS3(): { client: S3Client, bucket: string, publicBase: string } {
  const bucket = process.env.R2_BUCKET
  if (!bucket) throw new Error('R2_BUCKET not set')
  const accountId = process.env.R2_ACCOUNT_ID
  if (!accountId) throw new Error('R2_ACCOUNT_ID not set')
  
  const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`
  
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be set')
  }
  
  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  })
  
  const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`
  if (!publicBase) throw new Error('Set R2_PUBLIC_BASE_URL or R2_ENDPOINT to derive public URLs')
  return { client, bucket, publicBase }
}

async function uploadToR2(localAbs: string, key: string, contentType: string, client: S3Client, bucket: string): Promise<string> {
  const body = await fs.readFile(localAbs)
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }))
  return key
}

async function restoreBrands(client: S3Client, bucket: string, publicBase: string) {
  const file = path.join(DATA_DIR, 'brands.json')
  const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
  let items: any[] = JSON.parse(raw)
  let updated = 0, missing = 0
  for (const b of items) {
    if (isLocalUploadsUrl(b.logo)) {
      const resolved = await resolveLocalPathFromUploadsUrl(b.logo)
      if (resolved) {
        const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
        b.logo = `${publicBase}/${key}`
        updated++
      } else {
        missing++
      }
    }
  }
  await fs.writeFile(file, JSON.stringify(items, null, 2))
  console.log(`brands.json: updated=${updated} missing=${missing}`)
}

async function rewriteArrayOfImages(arr: any[] | undefined, client: S3Client, bucket: string, publicBase: string) {
  if (!Array.isArray(arr)) return
  for (const obj of arr) {
    if (obj && isLocalUploadsUrl(obj.url)) {
      const resolved = await resolveLocalPathFromUploadsUrl(obj.url)
      if (resolved) {
        const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
        obj.url = `${publicBase}/${key}`
      }
    }
  }
}

async function restoreModels(client: S3Client, bucket: string, publicBase: string) {
  const file = path.join(DATA_DIR, 'models.json')
  const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
  let items: any[] = JSON.parse(raw)
  let updated = 0
  for (const m of items) {
    const fields = ['heroImage'] as const
    for (const f of fields) {
      const val = m[f]
      if (isLocalUploadsUrl(val)) {
        const resolved = await resolveLocalPathFromUploadsUrl(val)
        if (resolved) {
          const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
          m[f] = `${publicBase}/${key}`
          updated++
        }
      }
    }
    await rewriteArrayOfImages(m.galleryImages, client, bucket, publicBase)
    await rewriteArrayOfImages(m.keyFeatureImages, client, bucket, publicBase)
    await rewriteArrayOfImages(m.spaceComfortImages, client, bucket, publicBase)
    await rewriteArrayOfImages(m.storageConvenienceImages, client, bucket, publicBase)
    await rewriteArrayOfImages(m.colorImages, client, bucket, publicBase)
  }
  await fs.writeFile(file, JSON.stringify(items, null, 2))
  console.log(`models.json: updated fields=${updated}`)
}

async function restoreVariants(client: S3Client, bucket: string, publicBase: string) {
  const file = path.join(DATA_DIR, 'variants.json')
  const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
  let items: any[] = JSON.parse(raw)
  let changed = 0
  for (const v of items) {
    if (Array.isArray(v.highlightImages)) {
      for (const img of v.highlightImages) {
        if (img && isLocalUploadsUrl(img.url)) {
          const resolved = await resolveLocalPathFromUploadsUrl(img.url)
          if (resolved) {
            const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
            img.url = `${publicBase}/${key}`
            changed++
          }
        }
      }
    }
  }
  await fs.writeFile(file, JSON.stringify(items, null, 2))
  console.log(`variants.json: updated images=${changed}`)
}

async function restoreNews(client: S3Client, bucket: string, publicBase: string) {
  // news-articles.json
  {
    const file = path.join(DATA_DIR, 'news-articles.json')
    const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
    let items: any[] = JSON.parse(raw)
    let changed = 0
    for (const a of items) {
      if (isLocalUploadsUrl(a.featuredImage)) {
        const resolved = await resolveLocalPathFromUploadsUrl(a.featuredImage)
        if (resolved) {
          const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
          a.featuredImage = `${publicBase}/${key}`
          changed++
        }
      }
      if (Array.isArray(a.contentBlocks)) {
        for (const b of a.contentBlocks) {
          if (b && isLocalUploadsUrl(b.imageUrl)) {
            const resolved = await resolveLocalPathFromUploadsUrl(b.imageUrl)
            if (resolved) {
              const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
              b.imageUrl = `${publicBase}/${key}`
              changed++
            }
          }
        }
      }
    }
    await fs.writeFile(file, JSON.stringify(items, null, 2))
    console.log(`news-articles.json: updated images=${changed}`)
  }

  // news-media.json
  {
    const file = path.join(DATA_DIR, 'news-media.json')
    const raw = await fs.readFile(file, 'utf-8').catch(() => '[]')
    let items: any[] = JSON.parse(raw)
    let changed = 0
    for (const m of items) {
      if (isLocalUploadsUrl(m.url)) {
        const resolved = await resolveLocalPathFromUploadsUrl(m.url)
        if (resolved) {
          const key = await uploadToR2(resolved.abs, resolved.key, resolved.contentType, client, bucket)
          m.url = `${publicBase}/${key}`
          changed++
        }
      }
    }
    await fs.writeFile(file, JSON.stringify(items, null, 2))
    console.log(`news-media.json: updated images=${changed}`)
  }
}

async function main() {
  const { client, bucket, publicBase } = getS3()
  console.log('➡️  Restoring images to R2 bucket:', bucket)
  console.log('📁 Data dir:', DATA_DIR)
  console.log('📂 Uploads dir:', UPLOADS_DIR)

  await restoreBrands(client, bucket, publicBase)
  await restoreModels(client, bucket, publicBase)
  await restoreVariants(client, bucket, publicBase)
  await restoreNews(client, bucket, publicBase)

  console.log('✅ Image restore complete. Commit updated JSON files and redeploy to apply on server startup.')
}

main().catch((err) => {
  console.error('❌ Restore failed:', err)
  process.exit(1)
})
