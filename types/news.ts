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
  contentBlocks: ContentBlock[]
  categoryId: string
  tags: string[]
  authorId: string
  linkedCars: string[]
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
