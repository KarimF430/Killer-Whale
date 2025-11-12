import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import { imageProcessingConfigs } from '../middleware/image-processor'
import { newsStorage } from '../db/news-storage'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Removed auth middleware for now - open access

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/news')
    await fs.mkdir(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only images and videos are allowed'))
    }
  }
})

// Get all media
router.get('/', async (req, res) => {
  try {
    const { type, uploader } = req.query
    let media = await newsStorage.getAllMedia()

    if (type && typeof type === 'string') {
      media = media.filter(m => m.type === type)
    }

    if (uploader && typeof uploader === 'string') {
      media = media.filter(m => m.uploaderId === uploader)
    }

    // Sort by created date (newest first)
    media.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    res.json(media)
  } catch (error) {
    console.error('Get media error:', error)
    res.status(500).json({ error: 'Failed to get media' })
  }
})

// Upload single file with WebP conversion
router.post('/upload', upload.single('file'), imageProcessingConfigs.news, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video'
    const fileUrl = `/uploads/news/${req.file.filename}`

    const media = await newsStorage.createMedia({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      type: fileType,
      size: req.file.size,
      uploaderId: 'admin' // Default uploader since auth is removed
    })

    res.status(201).json({ ...media, url: fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Upload multiple files with WebP conversion
router.post('/upload-multiple', upload.array('files', 10), imageProcessingConfigs.news, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const uploadedMedia = await Promise.all(
      req.files.map(async (file) => {
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video'
        const fileUrl = `/uploads/news/${file.filename}`

        return newsStorage.createMedia({
          filename: file.filename,
          originalName: file.originalname,
          url: fileUrl,
          type: fileType,
          size: file.size,
          uploaderId: 'admin' // Default uploader since auth is removed
        })
      })
    )

    res.status(201).json(uploadedMedia)
  } catch (error) {
    console.error('Upload multiple error:', error)
    res.status(500).json({ error: 'Failed to upload files' })
  }
})

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    const media = await newsStorage.getMediaById(req.params.id)

    if (!media) {
      return res.status(404).json({ error: 'Media not found' })
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', media.url)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    // Delete from storage
    await newsStorage.deleteMedia(req.params.id)

    res.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Delete media error:', error)
    res.status(500).json({ error: 'Failed to delete media' })
  }
})

export default router
