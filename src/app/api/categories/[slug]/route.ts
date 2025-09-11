import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const categorySlug = params.slug

    // Map slug to category name
    const categoryMap: { [key: string]: string } = {
      'engine-filters': 'Engine & Filters',
      'brakes-suspension': 'Brakes & Suspension',
      'electrical': 'Electrical Components',
      'mazda-cx5': 'Mazda CX-5 Parts',
      'nissan-xtrail': 'Nissan X-Trail Parts',
      'toyota-prado': 'Toyota Prado Parts'
    }

    const categoryName = categoryMap[categorySlug]
    if (!categoryName) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Fetch category info
    const categoryResult = await db.query(`
      SELECT id, name, description 
      FROM categories 
      WHERE name = $1
    `, [categoryName])

    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const category = categoryResult.rows[0]

    // Fetch products for this category
    const productsResult = await db.query(`
      SELECT DISTINCT
        p.id,
        p.name,
        p.description,
        p.price,
        p.brand,
        pi.image_url,
        c.name as category_name,
        p.created_at
      FROM parts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.part_id AND pi.is_primary = true
      WHERE c.name = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
    `, [categoryName])

    const products = productsResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price != null ? `KSH ${Math.round(Number(row.price)).toLocaleString('en-KE')}` : 'KSH 0',
      brand: row.brand || 'Generic',
      image: row.image_url || '/images/placeholder.svg',
      category: row.category_name
    }))

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        slug: categorySlug
      },
      products
    })
  } catch (error) {
    console.error('Failed to fetch category products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category products' },
      { status: 500 }
    )
  }
}
