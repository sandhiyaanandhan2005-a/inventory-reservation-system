'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ReservationPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!id || id === 'undefined') return

    fetch(`/api/reservations/${id}`)
      .then(res => res.json())
      .then(data => setData(data.reservation))
  }, [id])

  if (!id || id === 'undefined') {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-red-500">
          ❌ Invalid Reservation ID
        </h1>
        <p className="mt-2">Please go back and create a reservation.</p>
      </div>
    )
  }

  if (!data) {
    return <p className="p-10">Loading...</p>
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Reservation Details</h1>

      <p><strong>Product:</strong> {data.product_id}</p>
      <p><strong>Warehouse:</strong> {data.warehouse_id}</p>
      <p><strong>Quantity:</strong> {data.quantity}</p>
      <p><strong>Status:</strong> {data.status}</p>
    </div>
  )
}