import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const result = await db.query(`
      SELECT id, name, description, price, brand, category_name, image_url 
      FROM product_catalog 
      LIMIT 150
    `)

    const products = (result.rows || []).map((row: any, idx: number) => ({
      id: row.id || `fallback-${idx + 1}`,
      name: row.name || 'Unnamed Part',
      price: row.price != null ? `KSH ${Number(row.price).toLocaleString('en-KE')}` : 'KSH 0',
      originalPrice: row.price != null ? `KSH ${Number(row.price).toLocaleString('en-KE')}` : 'KSH 0',
      image: row.image_url || '/images/placeholder.svg',
      category: row.category_name || 'General',
      brand: row.brand || 'Generic',
      rating: 4.5,
      reviews: 0,
      inStock: true,
      isDeal: false,
      description: row.description || ''
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}


