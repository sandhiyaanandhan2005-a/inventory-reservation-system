import supabase from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  // 🔥 Extract ID manually from URL
  const url = req.url
  const parts = url.split('/')
  const id = parts[parts.length - 2]  // gets {id}

  console.log("ID FROM URL:", id)

  if (!id) {
    return NextResponse.json({ error: 'ID missing' }, { status: 400 })
  }

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('reservations')
    .update({ status: 'confirmed' })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Reservation confirmed' })
}