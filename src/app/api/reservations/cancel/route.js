import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(req) {
  try {
    const { reservation_id } = await req.json()

    if (!reservation_id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservation_id)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservation_id)

    const { data: inventory } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', reservation.product_id)
      .eq('warehouse_id', reservation.warehouse_id)
      .single()

    await supabase
      .from('inventory')
      .update({
        reserved_stock: inventory.reserved_stock - reservation.quantity,
      })
      .eq('id', inventory.id)

    return NextResponse.json({ success: true })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}