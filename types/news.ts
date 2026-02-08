export interface ContentBlock {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'image' | 'bulletList' | 'numberedList' | 'quote' | 'code'
  content: string
  imageUrl?: string
  imageCaption?: string
}

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
