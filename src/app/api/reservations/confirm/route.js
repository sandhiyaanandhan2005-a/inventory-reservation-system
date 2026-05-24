import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(req) {
  try {
    const { reservation_id } = await req.json()

    if (!reservation_id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservation_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reservation: data })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}