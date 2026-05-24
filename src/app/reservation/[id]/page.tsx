'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ReservationPage() {
  const params = useParams()
  const id = params.id as string

  const [reservation, setReservation] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  // 🔥 Fetch reservation details (SAFE JSON)
  useEffect(() => {
    const fetchReservation = async () => {
      const res = await fetch(`/api/reservations/${id}`)

      let data
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      setReservation(data)

      if (data?.expires_at) {
        const diff =
          new Date(data.expires_at).getTime() - new Date().getTime()
        setTimeLeft(diff)
      }
    }

    fetchReservation()
  }, [id])

  // ⏳ Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1000)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // ✅ Confirm API call (UPDATED)
  const handleConfirm = async () => {
    const res = await fetch(`/api/reservations/${id}/confirm`, {
      method: 'POST',
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(`❌ ${data.error}`)
    } else {
      setMessage(`✅ ${data.message}`)
    }

    // 🔥 update UI without reload
    const updated = await fetch(`/api/reservations/${id}`)
    const newData = await updated.json()
    setReservation(newData)
  }

  // ❌ Cancel / Release API call (UPDATED)
  const handleCancel = async () => {
    const res = await fetch(`/api/reservations/${id}/release`, {
      method: 'POST',
    })

    const data = await res.json()

    if (!res.ok) {
      setMessage(`❌ ${data.error}`)
    } else {
      setMessage(`✅ ${data.message}`)
    }

    // 🔥 update UI without reload
    const updated = await fetch(`/api/reservations/${id}`)
    const newData = await updated.json()
    setReservation(newData)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Reservation Page</h1>

      {reservation && (
        <>
          <p><b>ID:</b> {reservation.id}</p>
          <p><b>Status:</b> {reservation.status}</p>

          <p>
            <b>Time Left:</b>{' '}
            {timeLeft > 0 ? Math.floor(timeLeft / 1000) + ' sec' : 'Expired'}
          </p>

          {/* ✅ BUTTONS */}
          <button
            onClick={handleConfirm}
            disabled={reservation.status !== 'pending'}
            style={{ marginRight: '10px' }}
          >
            ✅ Confirm
          </button>

          <button
            onClick={handleCancel}
            disabled={reservation.status !== 'pending'}
          >
            ❌ Cancel
          </button>
        </>
      )}

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  )
}