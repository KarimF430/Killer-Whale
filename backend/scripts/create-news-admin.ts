import bcrypt from 'bcryptjs'
import { newsStorage } from '../server/db/news-storage'

async function createNewsAdmin() {
  try {
    // Initialize storage
    await newsStorage.initialize()
    
    // Check if admin already exists
    const existingAdmin = await newsStorage.getAuthorByEmail('admin@gadizone.com')
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@gadizone.com')
      return
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Create admin user
    const admin = await newsStorage.createAuthor({
      name: 'Admin User',
      email: 'admin@gadizone.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'System Administrator',
      profileImage: '',
      socialLinks: {},
      isActive: true
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@gadizone.com')
    console.log('Password: admin123')
    console.log('\n🔐 Please change the password after first login!')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

createNewsAdmin()
