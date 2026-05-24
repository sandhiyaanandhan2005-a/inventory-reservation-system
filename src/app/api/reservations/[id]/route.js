import supabase from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { pathname } = new URL(request.url)
    const id = pathname.split('/').pop()

    console.log("GET ID:", id)

    if (!id) {
      return NextResponse.json({ error: 'ID missing' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    return NextResponse.json(data)

  } catch (err) {
    console.error("SERVER ERROR:", err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}