'use client'

import { useState } from 'react'

export default function Home() {

  const [productId, setProductId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservation, setReservation] = useState(null)

  const handleReserve = async () => {
    if (loading) return

    setLoading(true)
    setMessage('⏳ Reserving...')
    setReservation(null) 

    if (!productId || !warehouseId) {
      setMessage('❌ Please enter all fields')
      setLoading(false)
      return
    }

    if (quantity <= 0) {
      setMessage('❌ Invalid quantity')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          warehouse_id: warehouseId,
          quantity,
        }),
      })

      const data = await res.json()
      console.log("API RESPONSE:", data)

      if (!res.ok) {
        setMessage(`❌ ${data.error}`)
        setLoading(false)
        return
      }

      setMessage('✅ Reserved successfully!')

      setReservation(data.reservation)

    } catch (err) {
      console.error(err)
      setMessage('❌ Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[400px] text-center">

        <h1 className="text-2xl font-bold mb-4">
          Inventory Reservation
        </h1>

        <input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-3 w-full mb-3 rounded"
        />

        <input
          placeholder="Warehouse ID"
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="border p-3 w-full mb-3 rounded"
        />

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-3 w-full mb-4 rounded"
        />

        <button
          onClick={handleReserve}
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600'
          }`}
        >
          {loading ? 'Reserving...' : 'Reserve'}
        </button>

        {message && (
          <p className="mt-4 font-semibold">{message}</p>
        )}

        {/* ✅ SHOW DATA */}
        {reservation && (
          <div className="mt-4 text-left border p-3 rounded">
            <p><b>Product:</b> {reservation.product_id}</p>
            <p><b>Warehouse:</b> {reservation.warehouse_id}</p>
            <p><b>Quantity:</b> {reservation.quantity}</p>
            <p><b>Status:</b> {reservation.status}</p>
          </div>
        )}

      </div>
    </div>
  )
}