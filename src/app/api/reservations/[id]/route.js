import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(req) {
  try {
    const { product_id, warehouse_id, quantity } = await req.json()

    if (!product_id || !warehouse_id || !quantity) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', product_id)
      .eq('warehouse_id', warehouse_id)
      .single()

    if (invError || !inventory) {
      console.log("Inventory error:", invError)
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 })
    }

    const available = inventory.total_stock - inventory.reserved_stock

    if (available < quantity) {
      return NextResponse.json({ error: 'Not enough stock' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('inventory')
      .update({
        reserved_stock: inventory.reserved_stock + quantity
      })
      .eq('id', inventory.id)

    if (updateError) {
      console.log("Update error:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const { data, error: resError } = await supabase
      .from('reservations')
      .insert([
        {
          product_id,
          warehouse_id,
          quantity,
          status: 'pending'
        }
      ])
      .select()

    if (resError) {
      console.log("Insert error:", resError)
      return NextResponse.json({ error: resError.message }, { status: 500 })
    }

    const reservation = data?.[0]

    if (!reservation) {
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    }

    console.log("SUCCESS INSERT:", reservation)

    return NextResponse.json({ reservation })

  } catch (err) {
    console.log("SERVER ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}