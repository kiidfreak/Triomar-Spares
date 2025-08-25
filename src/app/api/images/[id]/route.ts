import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = parseInt(params.id)
    
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 })
    }

    // Fetch image data from database
    const result = await db.query(
      'SELECT image_data, image_type, image_name FROM product_images WHERE id = $1',
      [imageId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const { image_data, image_type, image_name } = result.rows[0]

    // Convert base64 back to buffer
    const imageBuffer = Buffer.from(image_data, 'base64')

    // Return image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': image_type,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Content-Disposition': `inline; filename="${image_name}"`
      }
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = parseInt(params.id)
    
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 })
    }

    // Delete image from database
    const result = await db.query(
      'DELETE FROM product_images WHERE id = $1 RETURNING id',
      [imageId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
