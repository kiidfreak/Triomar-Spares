import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== 'admin' && userRole !== 'manager') {
      return NextResponse.json({ ok: false, error: { message: 'Insufficient permissions' } }, { status: 403 })
    }

    const productId = params.id
    const body = await req.json()

    // Get category and vehicle IDs based on names
    let categoryId = null
    let vehicleId = null

    if (body.category_name) {
      const { rows: categoryRows } = await db.query(
        'SELECT id FROM categories WHERE name = $1',
        [body.category_name]
      )
      categoryId = categoryRows[0]?.id
    }

    if (body.vehicle_name) {
      const { rows: vehicleRows } = await db.query(
        'SELECT id FROM vehicles WHERE name = $1',
        [body.vehicle_name]
      )
      vehicleId = vehicleRows[0]?.id
    }

    // Update the product
    const { rows } = await db.query(`
      UPDATE parts 
      SET 
        name = $1,
        part_number = $2,
        description = $3,
        category_id = $4,
        vehicle_id = $5,
        brand = $6,
        price = $7,
        stock_quantity = $8,
        warranty_months = $9,
        is_active = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [
      body.name,
      body.part_number || null,
      body.description || null,
      categoryId,
      vehicleId,
      body.brand || null,
      body.price,
      body.stock_quantity,
      body.warranty_months || 0,
      body.is_active !== undefined ? body.is_active : true,
      productId
    ])

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: { message: 'Product not found' } }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: rows[0] })
  } catch (err: any) {
    console.error('Error updating product:', err)
    return NextResponse.json(
      { ok: false, error: { message: err?.message || 'Unknown error' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== 'admin' && userRole !== 'manager') {
      return NextResponse.json({ ok: false, error: { message: 'Insufficient permissions' } }, { status: 403 })
    }

    const productId = params.id

    // Check if product exists
    const { rows: existingProduct } = await db.query(
      'SELECT id FROM parts WHERE id = $1',
      [productId]
    )

    if (existingProduct.length === 0) {
      return NextResponse.json({ ok: false, error: { message: 'Product not found' } }, { status: 404 })
    }

    // Delete the product
    await db.query('DELETE FROM parts WHERE id = $1', [productId])

    return NextResponse.json({ ok: true, message: 'Product deleted successfully' })
  } catch (err: any) {
    console.error('Error deleting product:', err)
    return NextResponse.json(
      { ok: false, error: { message: err?.message || 'Unknown error' } },
      { status: 500 }
    )
  }
}
