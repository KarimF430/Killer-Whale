import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Content Block Interface for flexible article content
export interface ContentBlock {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'image' | 'bulletList' | 'numberedList' | 'quote' | 'code'
  content: string
  imageUrl?: string
  imageCaption?: string
}

// News Article Interface
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  contentBlocks: ContentBlock[] // New: Block-based content instead of single HTML string
  categoryId: string
  tags: string[]
  authorId: string
  linkedCars: string[] // Array of car model IDs
  featuredImage: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  views: number
  likes: number
  comments: number
  isFeatured: boolean
  isBreaking: boolean
  createdAt: string
  updatedAt: string
}

// Category Interface
export interface NewsCategory {
  id: string
  name: string
  slug: string
  description: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

// Tag Interface
export interface NewsTag {
  id: string
  name: string
  slug: string
  type: 'brand' | 'segment' | 'fuel' | 'general'
  createdAt: string
  updatedAt: string
}

// Author Interface
export interface NewsAuthor {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'author'
  bio: string
  profileImage: string
  socialLinks: {
    twitter?: string
    linkedin?: string
    facebook?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Media Interface
export interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  type: 'image' | 'video'
  size: number
  uploaderId: string
  createdAt: string
}

class NewsStorage {
  private dataDir: string
  private articlesFile: string
  private categoriesFile: string
  private tagsFile: string
  private authorsFile: string
  private mediaFile: string

  private articles: NewsArticle[] = []
  private categories: NewsCategory[] = []
  private tags: NewsTag[] = []
  private authors: NewsAuthor[] = []
  private media: Media[] = []

  constructor() {
    this.dataDir = path.join(__dirname, '../../data')
    this.articlesFile = path.join(this.dataDir, 'news-articles.json')
    this.categoriesFile = path.join(this.dataDir, 'news-categories.json')
    this.tagsFile = path.join(this.dataDir, 'news-tags.json')
    this.authorsFile = path.join(this.dataDir, 'news-authors.json')
    this.mediaFile = path.join(this.dataDir, 'news-media.json')
  }

  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
      await this.loadArticles()
      await this.loadCategories()
      await this.loadTags()
      await this.loadAuthors()
      await this.loadMedia()
      console.log('News storage initialized successfully')
    } catch (error) {
      console.error('Error initializing news storage:', error)
    }
  }

  // ==================== ARTICLES ====================
  private async loadArticles() {
    try {
      const data = await fs.readFile(this.articlesFile, 'utf-8')
      this.articles = JSON.parse(data)
      console.log(`Loaded ${this.articles.length} articles from storage`)
    } catch (error) {
      this.articles = []
      await this.saveArticles()
    }
  }

  private async saveArticles() {
    await fs.writeFile(this.articlesFile, JSON.stringify(this.articles, null, 2))
  }

  async getAllArticles(): Promise<NewsArticle[]> {
    return this.articles
  }

  async getArticleById(id: string): Promise<NewsArticle | undefined> {
    return this.articles.find(article => article.id === id)
  }

  async getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
    return this.articles.find(article => article.slug === slug)
  }

  async createArticle(articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'>): Promise<NewsArticle> {
    const article: NewsArticle = {
      ...articleData,
      id: uuidv4(),
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.articles.push(article)
    await this.saveArticles()
    return article
  }

  async updateArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
    const index = this.articles.findIndex(article => article.id === id)
    if (index === -1) return null

    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.saveArticles()
    return this.articles[index]
  }

  async deleteArticle(id: string): Promise<boolean> {
    const index = this.articles.findIndex(article => article.id === id)
    if (index === -1) return false

    this.articles.splice(index, 1)
    await this.saveArticles()
    return true
  }

  async incrementArticleViews(id: string): Promise<void> {
    const article = this.articles.find(a => a.id === id)
    if (article) {
      article.views++
      await this.saveArticles()
    }
  }

  // ==================== CATEGORIES ====================
  private async loadCategories() {
    try {
      const data = await fs.readFile(this.categoriesFile, 'utf-8')
      this.categories = JSON.parse(data)
      console.log(`Loaded ${this.categories.length} categories from storage`)
    } catch (error) {
      this.categories = this.getDefaultCategories()
      await this.saveCategories()
    }
  }

  private getDefaultCategories(): NewsCategory[] {
    return [
      {
        id: uuidv4(),
        name: 'News',
        slug: 'news',
        description: 'Latest automotive news and updates',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Reviews',
        slug: 'reviews',
        description: 'Expert car reviews and road tests',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Buying Guide',
        slug: 'buying-guide',
        description: 'Car buying guides and tips',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Comparison',
        slug: 'comparison',
        description: 'Car comparisons and head-to-head reviews',
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  private async saveCategories() {
    await fs.writeFile(this.categoriesFile, JSON.stringify(this.categories, null, 2))
  }

  async getAllCategories(): Promise<NewsCategory[]> {
    return this.categories
  }

  async getCategoryById(id: string): Promise<NewsCategory | undefined> {
    return this.categories.find(cat => cat.id === id)
  }

  async createCategory(categoryData: Omit<NewsCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsCategory> {
    const category: NewsCategory = {
      ...categoryData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.categories.push(category)
    await this.saveCategories()
    return category
  }

  async updateCategory(id: string, updates: Partial<NewsCategory>): Promise<NewsCategory | null> {
    const index = this.categories.findIndex(cat => cat.id === id)
    if (index === -1) return null

    this.categories[index] = {
      ...this.categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.saveCategories()
    return this.categories[index]
  }

  async deleteCategory(id: string): Promise<boolean> {
    const index = this.categories.findIndex(cat => cat.id === id)
    if (index === -1) return false

    this.categories.splice(index, 1)
    await this.saveCategories()
    return true
  }

  // ==================== TAGS ====================
  private async loadTags() {
    try {
      const data = await fs.readFile(this.tagsFile, 'utf-8')
      this.tags = JSON.parse(data)
      console.log(`Loaded ${this.tags.length} tags from storage`)
    } catch (error) {
      this.tags = []
      await this.saveTags()
    }
  }

  private async saveTags() {
    await fs.writeFile(this.tagsFile, JSON.stringify(this.tags, null, 2))
  }

  async getAllTags(): Promise<NewsTag[]> {
    return this.tags
  }

  async getTagById(id: string): Promise<NewsTag | undefined> {
    return this.tags.find(tag => tag.id === id)
  }

  async createTag(tagData: Omit<NewsTag, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsTag> {
    const tag: NewsTag = {
      ...tagData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.tags.push(tag)
    await this.saveTags()
    return tag
  }

  async updateTag(id: string, updates: Partial<NewsTag>): Promise<NewsTag | null> {
    const index = this.tags.findIndex(tag => tag.id === id)
    if (index === -1) return null

    this.tags[index] = {
      ...this.tags[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.saveTags()
    return this.tags[index]
  }

  async deleteTag(id: string): Promise<boolean> {
    const index = this.tags.findIndex(tag => tag.id === id)
    if (index === -1) return false

    this.tags.splice(index, 1)
    await this.saveTags()
    return true
  }

  // ==================== AUTHORS ====================
  private async loadAuthors() {
    try {
      const data = await fs.readFile(this.authorsFile, 'utf-8')
      this.authors = JSON.parse(data)
      console.log(`Loaded ${this.authors.length} authors from storage`)
    } catch (error) {
      this.authors = []
      await this.saveAuthors()
    }
  }

  private async saveAuthors() {
    await fs.writeFile(this.authorsFile, JSON.stringify(this.authors, null, 2))
  }

  async getAllAuthors(): Promise<NewsAuthor[]> {
    return this.authors
  }

  async getAuthorById(id: string): Promise<NewsAuthor | undefined> {
    return this.authors.find(author => author.id === id)
  }

  async getAuthorByEmail(email: string): Promise<NewsAuthor | undefined> {
    return this.authors.find(author => author.email === email)
  }

  async createAuthor(authorData: Omit<NewsAuthor, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsAuthor> {
    const author: NewsAuthor = {
      ...authorData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.authors.push(author)
    await this.saveAuthors()
    return author
  }

  async updateAuthor(id: string, updates: Partial<NewsAuthor>): Promise<NewsAuthor | null> {
    const index = this.authors.findIndex(author => author.id === id)
    if (index === -1) return null

    this.authors[index] = {
      ...this.authors[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.saveAuthors()
    return this.authors[index]
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const index = this.authors.findIndex(author => author.id === id)
    if (index === -1) return false

    this.authors.splice(index, 1)
    await this.saveAuthors()
    return true
  }

  // ==================== MEDIA ====================
  private async loadMedia() {
    try {
      const data = await fs.readFile(this.mediaFile, 'utf-8')
      this.media = JSON.parse(data)
      console.log(`Loaded ${this.media.length} media files from storage`)
    } catch (error) {
      this.media = []
      await this.saveMedia()
    }
  }

  private async saveMedia() {
    await fs.writeFile(this.mediaFile, JSON.stringify(this.media, null, 2))
  }

  async getAllMedia(): Promise<Media[]> {
    return this.media
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    return this.media.find(m => m.id === id)
  }

  async createMedia(mediaData: Omit<Media, 'id' | 'createdAt'>): Promise<Media> {
    const media: Media = {
      ...mediaData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }
    this.media.push(media)
    await this.saveMedia()
    return media
  }

  async deleteMedia(id: string): Promise<boolean> {
    const index = this.media.findIndex(m => m.id === id)
    if (index === -1) return false

    this.media.splice(index, 1)
    await this.saveMedia()
    return true
  }

  // ==================== ANALYTICS ====================
  async getAnalytics() {
    const totalArticles = this.articles.length
    const publishedArticles = this.articles.filter(a => a.status === 'published').length
    const draftArticles = this.articles.filter(a => a.status === 'draft').length
    const scheduledArticles = this.articles.filter(a => a.status === 'scheduled').length
    const totalViews = this.articles.reduce((sum, a) => sum + a.views, 0)

    // Top categories
    const categoryStats = this.categories.map(cat => ({
      category: cat.name,
      count: this.articles.filter(a => a.categoryId === cat.id).length
    }))

    // Top authors
    const authorStats = this.authors.map(author => ({
      author: author.name,
      count: this.articles.filter(a => a.authorId === author.id).length
    }))

    // Top articles by views
    const topArticles = [...this.articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        title: a.title,
        views: a.views,
        publishDate: a.publishDate
      }))

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      totalViews,
      categoryStats,
      authorStats,
      topArticles
    }
  }
}

export const newsStorage = new NewsStorage()
