import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message })
  }

  const result = {}

  data.forEach(row => {
    if (!result[row.product_id]) {
      result[row.product_id] = {
        id: row.product_id,
        name: "Product " + row.product_id,
        warehouses: []
      }
    }

    result[row.product_id].warehouses.push({
      id: row.warehouse_id,
      name: "Warehouse " + row.warehouse_id,
      available_stock: row.total_stock - row.reserved_stock
    })
  })

  return NextResponse.json(Object.values(result))
}