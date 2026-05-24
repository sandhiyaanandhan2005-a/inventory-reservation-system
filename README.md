# Inventory Reservation System

## 🚀 Overview
This project implements an inventory reservation system for multi-warehouse products.

Users can:
- View products and available stock
- Reserve items
- Confirm purchase
- Cancel reservation

---

## 🧠 How it works

### Reservation Flow
1. User clicks "Reserve"
2. Reservation is created with status = `pending`
3. Stock is temporarily reserved
4. Reservation expires after a fixed time

### Confirm
- Changes status to `confirmed`
- Stock is permanently deducted

### Release / Cancel
- Changes status to `released`
- Stock is returned

---

## ⚠️ Error Handling

- **409 Conflict** → Not enough stock
- **410 Gone** → Reservation expired

These are shown in UI alerts.

---

## ⏳ Expiry Handling

Reservations use `expires_at`.

Expired reservations are:
- Checked during API calls (lazy cleanup)
- Treated as invalid if expired

In production, this can be improved using:
- Cron jobs (Vercel Cron)
- Background workers

---

## 🛠️ Tech Stack

- Next.js (App Router)
- Supabase (PostgreSQL)
- JavaScript

---

## ▶️ Run Locally

```bash
npm install
npm run dev