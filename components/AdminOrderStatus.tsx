"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function AdminOrderStatus({
  orderId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(currentStatus);

  async function updateStatus(newStatus: string) {
  console.log("STATUS CHANGED TO:", newStatus);

  setStatus(newStatus);

  await fetch(`/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  });
}

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs"
    >
      <option value="placed">Placed</option>
      <option value="packed">Packed</option>
      <option value="out_for_delivery">Out for delivery</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}