import React, { useEffect, useState } from "react";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState(null);

  async function load() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to view cart");

    const res = await fetch("http://localhost:4000/api/cart", {
      headers: { Authorization: token },
    });

    if (res.ok) {
      const j = await res.json();
      setItems(j || []);

      let t = 0;
      (j || []).forEach(
        (it) => (t += parseFloat(it.price) * it.quantity)
      );
      setTotal(t);
      setOrderId(null);
    } else {
      setItems([]);
      setTotal(0);
      setOrderId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ✅ REMOVE ITEM
  async function removeItem(id) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const res = await fetch(
      `http://localhost:4000/api/cart/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: token },
      }
    );

    if (res.ok) {
      load(); // refresh cart
    } else {
      alert("Failed to remove item");
    }
  }

  // ✅ UPDATE QUANTITY (increase/decrease)
  async function updateQuantity(id, newQty) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    if (newQty < 1) return removeItem(id); // auto remove if 0

    const res = await fetch(
      `http://localhost:4000/api/cart/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ quantity: newQty }),
      }
    );

    if (res.ok) {
      load();
    } else {
      alert("Failed to update quantity");
    }
  }

  async function checkout() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to checkout");

    const res = await fetch(
      "http://localhost:4000/api/cart/checkout",
      {
        method: "POST",
        headers: { Authorization: token },
      }
    );

    const j = await res.json().catch(() => ({}));

    if (res.ok) {
      alert("Order placed #" + j.orderId);
      setOrderId(j.orderId);
      load();
    } else {
      alert(j.message || "Failed");
    }
  }

  return (
    <div className="w-4/5 mx-auto space-y-4 p-6 bg-pink-100 rounded shadow min-h-[60vh]">
      <h2 className="text-3xl font-semibold text-pink-800">
        Your Cart
      </h2>

      <div className="bg-white p-6 rounded shadow">
        {items.length === 0 ? (
          <div className="text-gray-600">
            Your cart is empty
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 border-b pb-3"
              >
                <img
                  src={it.image}
                  alt={it.title}
                  className="w-24 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <div className="font-semibold">
                    {it.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    ${it.price} each
                  </div>

                  {/* ✅ Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(it.id, it.quantity - 1)
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{it.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(it.id, it.quantity + 1)
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="font-bold">
                  $
                  {(
                    parseFloat(it.price) * it.quantity
                  ).toFixed(2)}
                </div>

                {/* ✅ Remove Button */}
                <button
                  onClick={() => removeItem(it.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total + Checkout */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-semibold text-pink-900">
                Total: ${total.toFixed(2)}
              </div>

              <button
                onClick={checkout}
                className="bg-pink-700 text-white px-5 py-2 rounded hover:bg-pink-800 transition"
              >
                Checkout
              </button>
            </div>

            {orderId && (
              <div className="mt-4 p-3 bg-pink-200 text-pink-800 rounded">
                Order placed successfully! Order ID:{" "}
                <strong>{orderId}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}