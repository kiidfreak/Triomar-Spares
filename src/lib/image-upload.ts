import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { db } from './db'

export interface ImageUploadResult {
  url: string
  key?: string
  success: boolean
  error?: string
}

export interface ImageStorageConfig {
  type: 's3' | 'postgresql' | 'local'
  s3?: {
    bucket: string
    region: string
    accessKeyId: string
    secretAccessKey: string
  }
  postgresql?: {
    table: string
    column: string
  }
}

class ImageUploadService {
  private config: ImageStorageConfig
  private s3Client?: S3Client

  constructor(config: ImageStorageConfig) {
    this.config = config
    
    if (config.type === 's3' && config.s3) {
      this.s3Client = new S3Client({
        region: config.s3.region,
        credentials: {
          accessKeyId: config.s3.accessKeyId,
          secretAccessKey: config.s3.secretAccessKey,
        },
      })
    }
  }

  async uploadImage(file: File, folder: string = 'products'): Promise<ImageUploadResult> {
    try {
      switch (this.config.type) {
        case 's3':
          return await this.uploadToS3(file, folder)
        case 'postgresql':
          return await this.uploadToPostgreSQL(file, folder)
        case 'local':
          return await this.uploadToLocal(file, folder)
        default:
          throw new Error('Unsupported storage type')
      }
    } catch (error) {
      return {
        url: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  async deleteImage(url: string, key?: string): Promise<boolean> {
    try {
      switch (this.config.type) {
        case 's3':
          if (key && this.s3Client) {
            await this.s3Client.send(new DeleteObjectCommand({
              Bucket: this.config.s3!.bucket,
              Key: key
            }))
            return true
          }
          break
        case 'postgresql':
          // Delete from database
          const result = await db.query(
            'DELETE FROM product_images WHERE image_url = $1',
            [url]
          )
          return (result.rowCount || 0) > 0
        case 'local':
          // For local storage, you might want to delete the file
          return true
      }
      return false
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  private async uploadToS3(file: File, folder: string): Promise<ImageUploadResult> {
    if (!this.s3Client || !this.config.s3) {
      throw new Error('S3 not configured')
    }

    const key = `${folder}/${Date.now()}-${file.name}`
    const command = new PutObjectCommand({
      Bucket: this.config.s3.bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    })

    await this.s3Client.send(command)
    
    const url = `https://${this.config.s3.bucket}.s3.${this.config.s3.region}.amazonaws.com/${key}`
    
    return {
      url,
      key,
      success: true
    }
  }

  private async uploadToPostgreSQL(file: File, folder: string): Promise<ImageUploadResult> {
    // Convert file to base64 for storage
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    
    // Store in database
    const result = await db.query(
      `INSERT INTO product_images (image_name, image_data, image_type, folder, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id`,
      [file.name, base64, file.type, folder]
    )

    if (result.rows.length === 0) {
      throw new Error('Failed to store image in database')
    }

    const imageId = result.rows[0].id
    const url = `/api/images/${imageId}` // This would serve the image from database

    return {
      url,
      success: true
    }
  }

  private async uploadToLocal(file: File, folder: string): Promise<ImageUploadResult> {
    // For local development, you might want to save to public folder
    // In production, this should redirect to S3 or cloud storage
    const fileName = `${Date.now()}-${file.name}`
    const url = `/uploads/${folder}/${fileName}`

    // Note: In a real implementation, you'd save the file to disk
    // This is just a placeholder for the URL structure

    return {
      url,
      success: true
    }
  }
}

// Default configuration - you can override this
export const imageUploadService = new ImageUploadService({
  type: process.env.IMAGE_STORAGE_TYPE as 's3' | 'postgresql' | 'local' || 's3',
  s3: {
    bucket: process.env.AWS_S3_BUCKET || '',
    region: process.env.AWS_S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  postgresql: {
    table: 'product_images',
    column: 'image_data'
  }
})

export default imageUploadService
