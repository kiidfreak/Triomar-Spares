import { NextRequest, NextResponse } from 'next/server'
import imageUploadService from '@/lib/image-upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Upload using the configured service
    const result = await imageUploadService.uploadImage(file, 'products')

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({ 
      url: result.url, 
      key: result.key,
      success: true,
      message: 'Image uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
