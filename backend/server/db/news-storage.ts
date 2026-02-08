import { v4 as uuidv4 } from 'uuid'
import { NewsArticle as NewsArticleModel, NewsCategory as NewsCategoryModel, NewsTag as NewsTagModel, NewsAuthor as NewsAuthorModel, NewsMedia } from './schemas'
import type { ContentBlock, NewsArticle, NewsCategory, NewsTag, NewsAuthor, Media } from '../../../types/news'

class NewsStorage {
  async initialize() {
    try {
      // Initialize default categories if none exist
      const categoriesCount = await NewsCategoryModel.countDocuments()
      if (categoriesCount === 0) {
        await this.createDefaultCategories()
      }
      console.log('✅ News storage initialized successfully (MongoDB)')
    } catch (error) {
      console.error('❌ Error initializing news storage:', error)
    }
  }

  private async createDefaultCategories() {
    const defaultCategories = [
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

    await NewsCategoryModel.insertMany(defaultCategories)
    console.log('✅ Created default news categories')
  }

  // ==================== ARTICLES ====================
  async getAllArticles(): Promise<NewsArticle[]> {
    const articles = await NewsArticleModel.find().lean()
    return articles.map(this.mapArticle)
  }

  async getArticleById(id: string): Promise<NewsArticle | undefined> {
    const article = await NewsArticleModel.findOne({ id }).lean()
    return article ? this.mapArticle(article) : undefined
  }

  async getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
    const article = await NewsArticleModel.findOne({ slug }).lean()
    return article ? this.mapArticle(article) : undefined
  }

  async createArticle(articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'>): Promise<NewsArticle> {
    const article = new NewsArticleModel({
      ...articleData,
      id: uuidv4(),
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await article.save()
    return this.mapArticle(article.toObject())
  }

  async updateArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
    const article = await NewsArticleModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return article ? this.mapArticle(article) : null
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await NewsArticleModel.deleteOne({ id })
    return result.deletedCount > 0
  }

  async incrementArticleViews(id: string): Promise<void> {
    await NewsArticleModel.updateOne({ id }, { $inc: { views: 1 } })
  }

  // ==================== CATEGORIES ====================
  async getAllCategories(): Promise<NewsCategory[]> {
    const categories = await NewsCategoryModel.find().lean()
    return categories.map(this.mapCategory)
  }

  async getCategoryById(id: string): Promise<NewsCategory | undefined> {
    const category = await NewsCategoryModel.findOne({ id }).lean()
    return category ? this.mapCategory(category) : undefined
  }

  async createCategory(categoryData: Omit<NewsCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsCategory> {
    const category = new NewsCategoryModel({
      ...categoryData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await category.save()
    return this.mapCategory(category.toObject())
  }

  async updateCategory(id: string, updates: Partial<NewsCategory>): Promise<NewsCategory | null> {
    const category = await NewsCategoryModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return category ? this.mapCategory(category) : null
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await NewsCategoryModel.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== TAGS ====================
  async getAllTags(): Promise<NewsTag[]> {
    const tags = await NewsTagModel.find().lean()
    return tags.map(this.mapTag)
  }

  async getTagById(id: string): Promise<NewsTag | undefined> {
    const tag = await NewsTagModel.findOne({ id }).lean()
    return tag ? this.mapTag(tag) : undefined
  }

  async createTag(tagData: Omit<NewsTag, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsTag> {
    const tag = new NewsTagModel({
      ...tagData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await tag.save()
    return this.mapTag(tag.toObject())
  }

  async updateTag(id: string, updates: Partial<NewsTag>): Promise<NewsTag | null> {
    const tag = await NewsTagModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return tag ? this.mapTag(tag) : null
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await NewsTagModel.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== AUTHORS ====================
  async getAllAuthors(): Promise<NewsAuthor[]> {
    const authors = await NewsAuthorModel.find().lean()
    return authors.map(this.mapAuthor)
  }

  async getAuthorById(id: string): Promise<NewsAuthor | undefined> {
    const author = await NewsAuthorModel.findOne({ id }).lean()
    return author ? this.mapAuthor(author) : undefined
  }

  async getAuthorByEmail(email: string): Promise<NewsAuthor | undefined> {
    const author = await NewsAuthorModel.findOne({ email }).lean()
    return author ? this.mapAuthor(author) : undefined
  }

  async createAuthor(authorData: Omit<NewsAuthor, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsAuthor> {
    const author = new NewsAuthorModel({
      ...authorData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await author.save()
    return this.mapAuthor(author.toObject())
  }

  async updateAuthor(id: string, updates: Partial<NewsAuthor>): Promise<NewsAuthor | null> {
    const author = await NewsAuthorModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return author ? this.mapAuthor(author) : null
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const result = await NewsAuthorModel.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== MEDIA ====================
  async getAllMedia(): Promise<Media[]> {
    const media = await NewsMedia.find().lean()
    return media.map(this.mapMedia)
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    const media = await NewsMedia.findOne({ id }).lean()
    return media ? this.mapMedia(media) : undefined
  }

  async createMedia(mediaData: Omit<Media, 'id' | 'createdAt'>): Promise<Media> {
    const media = new NewsMedia({
      ...mediaData,
      id: uuidv4(),
      createdAt: new Date()
    })
    await media.save()
    return this.mapMedia(media.toObject())
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await NewsMedia.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== ANALYTICS ====================
  async getAnalytics() {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      categories,
      authors,
      topArticles
    ] = await Promise.all([
      NewsArticleModel.countDocuments(),
      NewsArticleModel.countDocuments({ status: 'published' }),
      NewsArticleModel.countDocuments({ status: 'draft' }),
      NewsArticleModel.countDocuments({ status: 'scheduled' }),
      NewsCategoryModel.find().lean(),
      NewsAuthorModel.find().lean(),
      NewsArticleModel.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(5)
        .select('id title views publishDate')
        .lean()
    ])

    const totalViews = await NewsArticleModel.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ])

    // Category stats
    const categoryStats = await Promise.all(
      categories.map(async (cat: any) => ({
        category: cat.name,
        count: await NewsArticleModel.countDocuments({ categoryId: cat.id })
      }))
    )

    // Author stats
    const authorStats = await Promise.all(
      authors.map(async (author: any) => ({
        author: author.name,
        count: await NewsArticleModel.countDocuments({ authorId: author.id })
      }))
    )

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      totalViews: totalViews[0]?.total || 0,
      categoryStats,
      authorStats,
      topArticles: topArticles.map((a: any) => ({
        id: a.id,
        title: a.title,
        views: a.views,
        publishDate: a.publishDate
      }))
    }
  }

  // ==================== MAPPING FUNCTIONS ====================
  private mapArticle(doc: any): NewsArticle {
    return {
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      contentBlocks: doc.contentBlocks || [],
      categoryId: doc.categoryId,
      tags: doc.tags || [],
      authorId: doc.authorId,
      linkedCars: doc.linkedCars || [],
      featuredImage: doc.featuredImage,
      seoTitle: doc.seoTitle,
      seoDescription: doc.seoDescription,
      seoKeywords: doc.seoKeywords || [],
      status: doc.status,
      publishDate: doc.publishDate instanceof Date ? doc.publishDate.toISOString() : doc.publishDate,
      views: doc.views || 0,
      likes: doc.likes || 0,
      comments: doc.comments || 0,
      isFeatured: doc.isFeatured || false,
      isBreaking: doc.isBreaking || false,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapCategory(doc: any): NewsCategory {
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      isFeatured: doc.isFeatured || false,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapTag(doc: any): NewsTag {
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      type: doc.type,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapAuthor(doc: any): NewsAuthor {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      bio: doc.bio || '',
      profileImage: doc.profileImage || '',
      socialLinks: doc.socialLinks || {},
      isActive: doc.isActive !== undefined ? doc.isActive : true,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapMedia(doc: any): Media {
    return {
      id: doc.id,
      filename: doc.filename,
      originalName: doc.originalName,
      url: doc.url,
      type: doc.type,
      size: doc.size,
      uploaderId: doc.uploaderId,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt
    }
  }
}

export const newsStorage = new NewsStorage()
