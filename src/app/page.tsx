'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [reservation, setReservation] = useState<any>(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  const handleReserve = async (item:any) => {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: item.product_id,
        warehouse_id: item.warehouse_id,
        quantity: 1
      })
    })

    let data
    try {
      data = await res.json()
    } catch {
      data = {}
    }

    // 🔥 IMPORTANT FIX (409 / 410 handling)
    if (!res.ok) {
      alert(`❌ ${data.error || 'Something went wrong'}`)
      return
    }

    // ✅ SUCCESS
    alert(`✅ Reserved successfully!\nID: ${data.id}`)

    // 👉 redirect to reservation page
    window.location.href = `/reservation/${data.id}`
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>

      {products.map((item, i) => {
        const available = item.total_stock - item.reserved_stock

        return (
          <div
            key={i}
            style={{
              marginBottom: '15px',
              border: '1px solid gray',
              padding: '10px'
            }}
          >
            <p><b>Product:</b> {item.product_id}</p>
            <p><b>Warehouse:</b> {item.warehouse_id}</p>
            <p><b>Available Stock:</b> {available}</p>

            <button
              onClick={() => handleReserve(item)}
              disabled={available <= 0}
            >
              Reserve
            </button>
          </div>
        )
      })}
    </div>
  )
}