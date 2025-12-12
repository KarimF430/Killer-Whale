#!/usr/bin/env node

/**
 * MongoDB Backup Script
 * Automated daily backups with rotation
 * 
 * Usage:
 * npx tsx backend/scripts/backup/mongodb-backup.ts
 * 
 * Schedule with cron:
 * 0 2 * * * cd /path/to/project && npx tsx backend/scripts/backup/mongodb-backup.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

// Configuration
const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone',
  backupDir: process.env.BACKUP_DIR || './backups',
  maxBackups: parseInt(process.env.MAX_BACKUPS || '7'), // Keep 7 days of backups
  s3Bucket: process.env.S3_BACKUP_BUCKET, // Optional S3 bucket for cloud backup
};

// Parse MongoDB URI
function parseMongoUri(uri: string) {
  const match = uri.match(/mongodb:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
  if (match) {
    return {
      username: match[1],
      password: match[2],
      host: match[3],
      database: match[4].split('?')[0],
    };
  }
  
  // Simple URI without auth
  const simpleMatch = uri.match(/mongodb:\/\/([^/]+)\/(.+)/);
  if (simpleMatch) {
    return {
      host: simpleMatch[1],
      database: simpleMatch[2].split('?')[0],
    };
  }
  
  throw new Error('Invalid MongoDB URI');
}

// Create backup
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `gadizone-backup-${timestamp}`;
  const backupPath = path.join(config.backupDir, backupName);
  
  try {
    console.log('🔄 Starting MongoDB backup...');
    console.log(`📁 Backup directory: ${backupPath}`);
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
    }
    
    // Parse MongoDB connection details
    const mongoConfig = parseMongoUri(config.mongoUri);
    
    // Build mongodump command
    let command = `mongodump --host ${mongoConfig.host} --db ${mongoConfig.database} --out ${backupPath}`;
    
    if (mongoConfig.username && mongoConfig.password) {
      command += ` --username ${mongoConfig.username} --password ${mongoConfig.password}`;
    }
    
    // Add additional options
    command += ' --gzip'; // Compress backup
    
    // Execute backup
    console.log('⏳ Running mongodump...');
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('done dumping')) {
      throw new Error(stderr);
    }
    
    console.log('✅ Backup created successfully');
    
    // Create tar archive
    const archiveName = `${backupName}.tar.gz`;
    const archivePath = path.join(config.backupDir, archiveName);
    
    console.log('📦 Creating archive...');
    await execAsync(`tar -czf ${archivePath} -C ${config.backupDir} ${backupName}`);
    
    // Remove uncompressed backup
    await execAsync(`rm -rf ${backupPath}`);
    
    console.log(`✅ Archive created: ${archiveName}`);
    
    // Upload to S3 if configured
    if (config.s3Bucket) {
      await uploadToS3(archivePath, archiveName);
    }
    
    // Clean old backups
    await cleanOldBackups();
    
    // Log backup info
    const stats = fs.statSync(archivePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('📊 Backup Summary:');
    console.log(`   - File: ${archiveName}`);
    console.log(`   - Size: ${sizeMB} MB`);
    console.log(`   - Location: ${archivePath}`);
    
    return {
      success: true,
      file: archiveName,
      path: archivePath,
      size: sizeMB,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

// Upload backup to S3
async function uploadToS3(filePath: string, fileName: string) {
  try {
    console.log('☁️  Uploading to S3...');
    
    const command = `aws s3 cp ${filePath} s3://${config.s3Bucket}/mongodb-backups/${fileName}`;
    await execAsync(command);
    
    console.log('✅ Uploaded to S3 successfully');
  } catch (error) {
    console.error('⚠️  S3 upload failed:', error);
    // Don't throw - local backup still succeeded
  }
}

// Clean old backups
async function cleanOldBackups() {
  try {
    console.log('🧹 Cleaning old backups...');
    
    const files = fs.readdirSync(config.backupDir)
      .filter(file => file.startsWith('gadizone-backup-'))
      .map(file => ({
        name: file,
        path: path.join(config.backupDir, file),
        time: fs.statSync(path.join(config.backupDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // Sort by newest first
    
    // Keep only the latest backups
    if (files.length > config.maxBackups) {
      const filesToDelete = files.slice(config.maxBackups);
      
      for (const file of filesToDelete) {
        fs.unlinkSync(file.path);
        console.log(`   Deleted: ${file.name}`);
      }
      
      console.log(`✅ Cleaned ${filesToDelete.length} old backup(s)`);
    } else {
      console.log('✅ No old backups to clean');
    }
  } catch (error) {
    console.error('⚠️  Cleanup failed:', error);
    // Don't throw - backup still succeeded
  }
}

// Restore backup
export async function restoreBackup(backupFile: string) {
  try {
    console.log('🔄 Starting MongoDB restore...');
    
    const backupPath = path.join(config.backupDir, backupFile);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }
    
    // Extract archive
    const extractDir = backupPath.replace('.tar.gz', '');
    console.log('📦 Extracting archive...');
    await execAsync(`tar -xzf ${backupPath} -C ${config.backupDir}`);
    
    // Parse MongoDB connection details
    const mongoConfig = parseMongoUri(config.mongoUri);
    
    // Build mongorestore command
    let command = `mongorestore --host ${mongoConfig.host} --db ${mongoConfig.database} --drop ${extractDir}/${mongoConfig.database}`;
    
    if (mongoConfig.username && mongoConfig.password) {
      command += ` --username ${mongoConfig.username} --password ${mongoConfig.password}`;
    }
    
    // Execute restore
    console.log('⏳ Running mongorestore...');
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('done')) {
      throw new Error(stderr);
    }
    
    // Clean up extracted files
    await execAsync(`rm -rf ${extractDir}`);
    
    console.log('✅ Restore completed successfully');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

// List available backups
export async function listBackups() {
  try {
    const files = fs.readdirSync(config.backupDir)
      .filter(file => file.startsWith('gadizone-backup-'))
      .map(file => {
        const stats = fs.statSync(path.join(config.backupDir, file));
        return {
          name: file,
          size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          created: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    
    console.log('📋 Available backups:');
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name} (${file.size}) - ${file.created}`);
    });
    
    return files;
  } catch (error) {
    console.error('❌ Failed to list backups:', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  createBackup()
    .then(result => {
      console.log('✅ Backup completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Backup failed:', error);
      process.exit(1);
    });
}

export { createBackup };
