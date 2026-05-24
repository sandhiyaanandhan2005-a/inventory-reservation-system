"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  useEffect(() => {
    if (!reservation) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [reservation])

  const handleReserve = async (item: any) => {
    setLoading(true)

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: item.product_id,
        warehouse_id: item.warehouse_id,
        quantity: 1,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      alert("✅ Reserved successfully")
      setReservation(data)
      setTimeLeft(600)
    } else {
      alert("❌ Out of stock")
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial",
        marginTop: "30px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Inventory Reservation System
      </h1>

      {/* ✅ PRODUCT LIST */}
      {!reservation && (
        <>
          <h2>Products</h2>

          {products.map((item: any) => (
            <div
              key={item.product_id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                margin: "10px",
                borderRadius: "10px",
                width: "300px",
              }}
            >
              <p><b>Product:</b> {item.product_id}</p>
              <p><b>Warehouse:</b> {item.warehouse_id}</p>

              <button
                onClick={() => handleReserve(item)}
                disabled={loading}
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Reserving..." : "Reserve"}
              </button>
            </div>
          ))}
        </>
      )}

      {/* ✅ RESERVATION PAGE */}
      {reservation && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            marginTop: "20px",
          }}
        >
          <h2>Reservation Page</h2>

          <p><b>ID:</b> {reservation.id}</p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  reservation.status === "pending" ? "orange" : "green",
              }}
            >
              {reservation.status}
            </span>
          </p>

          <p><b>Time Left:</b> {timeLeft} sec</p>

          <button
            style={{ marginRight: "10px", color: "green" }}
            onClick={() => alert("✅ Confirmed")}
          >
            ✅ Confirm
          </button>

          <button
            style={{ color: "red" }}
            onClick={() => alert("❌ Cancelled")}
          >
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  )
}