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
      .catch(() => setProducts([]))
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

    try {
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
        setReservation(data)
        setTimeLeft(600)
      } else {
        alert("❌ Out of stock")
      }
    } catch (err) {
      setLoading(false)
      alert("⚠️ Something went wrong")
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
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Inventory Reservation System
      </h1>

      {/* ================= PRODUCTS ================= */}
      {!reservation && (
        <>
          <h2 style={{ marginTop: "20px" }}>Available Products</h2>

          {products.length === 0 && <p>No products available</p>}

          {products.map((item: any) => (
            <div
              key={item.product_id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                margin: "10px",
                borderRadius: "10px",
                width: "320px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <p><b>Product:</b> {item.product_id}</p>
              <p><b>Warehouse:</b> {item.warehouse_id}</p>

              <button
                onClick={() => handleReserve(item)}
                disabled={loading}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                {loading ? "Reserving..." : "Reserve"}
              </button>
            </div>
          ))}
        </>
      )}

      {/* ================= RESERVATION ================= */}
      {reservation && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            marginTop: "30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Reservation Page</h2>

          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ Reservation created successfully!
          </p>

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

          <div style={{ marginTop: "10px" }}>
            <button
              style={{
                marginRight: "10px",
                color: "green",
                cursor: "pointer",
              }}
              onClick={() => alert("✅ Confirmed")}
            >
              ✅ Confirm
            </button>

            <button
              style={{
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => alert("❌ Cancelled")}
            >
              ❌ Cancel
            </button>
          </div>

          {/* 🔥 BACK BUTTON */}
          <button
            onClick={() => setReservation(null)}
            style={{
              marginTop: "15px",
              padding: "8px",
              cursor: "pointer",
            }}
          >
            🔙 Back to Products
          </button>
        </div>
      )}
    </div>
  )
}