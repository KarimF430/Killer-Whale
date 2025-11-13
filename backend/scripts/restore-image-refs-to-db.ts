import path from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import { MongoDBStorage } from '../server/db/mongodb-storage'

// Read updated JSON backups (with R2 URLs) and write the image fields back into MongoDB
// Requires MONGODB_URI in env

dotenv.config()

const DATA_DIR = path.join(process.cwd(), 'data')

function isHttp(url: any): url is string {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set in environment')

  const storage = new MongoDBStorage()
  await storage.connect(uri)
  console.log('✅ Connected to MongoDB')

  // Brands: logo
  try {
    const brandsPath = path.join(DATA_DIR, 'brands.json')
    const brandsRaw = await fs.readFile(brandsPath, 'utf-8')
    const brands = JSON.parse(brandsRaw)
    let updated = 0
    for (const b of brands) {
      if (b && isHttp(b.logo)) {
        await storage.updateBrand(b.id, { logo: b.logo })
        updated++
      }
    }
    console.log(`Brands updated: ${updated}`)
  } catch (e) {
    console.warn('Brands restore skipped:', e instanceof Error ? e.message : e)
  }

  // Models: heroImage + arrays of images
  try {
    const modelsPath = path.join(DATA_DIR, 'models.json')
    const modelsRaw = await fs.readFile(modelsPath, 'utf-8')
    const models = JSON.parse(modelsRaw)
    let updated = 0
    for (const m of models) {
      const patch: any = {}
      if (isHttp(m.heroImage)) patch.heroImage = m.heroImage
      const arrays = [
        'galleryImages',
        'keyFeatureImages',
        'spaceComfortImages',
        'storageConvenienceImages',
        'colorImages',
      ] as const
      for (const f of arrays) {
        if (Array.isArray(m[f])) {
          patch[f] = m[f]
        }
      }
      if (Object.keys(patch).length > 0) {
        await storage.updateModel(m.id, patch)
        updated++
      }
    }
    console.log(`Models updated: ${updated}`)
  } catch (e) {
    console.warn('Models restore skipped:', e instanceof Error ? e.message : e)
  }

  // Variants: highlightImages
  try {
    const variantsPath = path.join(DATA_DIR, 'variants.json')
    const variantsRaw = await fs.readFile(variantsPath, 'utf-8')
    const variants = JSON.parse(variantsRaw)
    let updated = 0
    for (const v of variants) {
      if (Array.isArray(v.highlightImages)) {
        await storage.updateVariant(v.id, { highlightImages: v.highlightImages })
        updated++
      }
    }
    console.log(`Variants updated: ${updated}`)
  } catch (e) {
    console.warn('Variants restore skipped:', e instanceof Error ? e.message : e)
  }

  console.log('✅ Database image references restored from backup JSONs')
}

main().catch((err) => {
  console.error('❌ Restore image refs failed:', err)
  process.exit(1)
})
