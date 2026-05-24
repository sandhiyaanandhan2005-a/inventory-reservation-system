import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(req) {
  try {
    const { product_id, warehouse_id, quantity } = await req.json()

    if (!product_id || !warehouse_id || !quantity) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Get inventory
    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', product_id)
      .eq('warehouse_id', warehouse_id)
      .single()

    if (invError || !inventory) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 })
    }

    const available = inventory.total_stock - inventory.reserved_stock

    if (available < quantity) {
      return NextResponse.json({ error: 'Not enough stock' }, { status: 409 })
    }

    // 2. Update reserved stock
    const { error: updateError } = await supabase
      .from('inventory')
      .update({
        reserved_stock: inventory.reserved_stock + quantity
      })
      .eq('id', inventory.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // 3. Create reservation
    const expires_at = new Date(Date.now() + 10 * 60 * 1000)

    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .insert([
        {
          product_id,
          warehouse_id,
          quantity,
          status: 'pending',
          expires_at
        }
      ])
      .select()
      .single()

    if (resError) {
      return NextResponse.json({ error: resError.message }, { status: 500 })
    }

    return NextResponse.json(reservation)

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}