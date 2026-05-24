import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req) {
  try {
    const { product_id, warehouse_id, quantity } = await req.json();

    if (!product_id || !warehouse_id || !quantity) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { data: inventory, error: invError } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", product_id)
      .eq("warehouse_id", warehouse_id)
      .single();
    console.log("INPUT:", product_id, warehouse_id);
    console.log("INVENTORY:", inventory);

    if (invError || !inventory) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    const available = inventory.total_stock - inventory.reserved_stock;

    if (quantity > available) {
      return NextResponse.json(
        { error: "Not enough stock" },
        { status: 409 }
      );
    }

    const { error: updateError } = await supabase
      .from("inventory")
      .update({
        reserved_stock: inventory.reserved_stock + quantity,
      })
      .eq("product_id", product_id)
      .eq("warehouse_id", warehouse_id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to reserve stock" },
        { status: 500 }
      );
    }

    const { data: reservation, error: resError } = await supabase
      .from("reservations")
      .insert({
        product_id,
        warehouse_id,
        quantity,
        status: "pending",
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      })
      .select()
      .single();

    if (resError) {
      return NextResponse.json(
        { error: "Reservation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reservation });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}