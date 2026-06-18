import React, { useEffect, useState } from "react";

export default function WishlistPage() {

  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD WISHLIST
  // =========================

  useEffect(() => {

    loadWishlist();

  }, []);

  async function loadWishlist() {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

      const res = await fetch(
        "http://localhost:4000/api/wishlist",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {

        setWishlist(data);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  // =========================
  // REMOVE ITEM
  // =========================

  async function removeItem(id) {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch(
        `http://localhost:4000/api/wishlist/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.ok) {

        setWishlist((prev) =>
          prev.filter((item) => item.id !== id)
        );

      }

    } catch (error) {

      console.error(error);

    }

  }

  // =========================
  // MOVE TO CART
  // =========================

  async function moveToCart(item) {

    const token = localStorage.getItem("token");

    try {

      // ADD TO CART
      const cartRes = await fetch(
        "http://localhost:4000/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            designId: item.designId,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: 1,
          }),
        }
      );

      if (cartRes.ok) {

        // REMOVE FROM WISHLIST
        await fetch(
          `http://localhost:4000/api/wishlist/${item.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
            },
          }
        );

        setWishlist((prev) =>
          prev.filter((w) => w.id !== item.id)
        );

        alert("Moved to cart");

      }

    } catch (error) {

      console.error(error);

    }

  }

  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-pink-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-4xl font-bold text-gray-800">
                My Wishlist ❤️
              </h1>

              <p className="text-gray-500 mt-2">
                Save your favorite interior designs
              </p>

            </div>

            {/* COUNT */}
            <div className="bg-pink-100 text-pink-700 px-6 py-4 rounded-xl">

              <p className="text-sm font-medium">
                Wishlist Items
              </p>

              <h3 className="text-3xl font-bold">
                {wishlist.length}
              </h3>

            </div>

          </div>

        </div>

        {/* LOADING */}
        {loading && (

          <div className="text-center py-20 text-gray-500 text-lg">

            Loading wishlist...

          </div>

        )}

        {/* EMPTY */}
        {!loading && wishlist.length === 0 && (

          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">

            <div className="text-7xl mb-6">
              💔
            </div>

            <h2 className="text-3xl font-bold text-gray-700 mb-3">
              Wishlist is Empty
            </h2>

            <p className="text-gray-500">
              Start adding your favorite designs
            </p>

          </div>

        )}

        {/* WISHLIST GRID */}
        {!loading && wishlist.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {wishlist.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >

                {/* IMAGE */}
                <div className="h-64 overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h3 className="text-xl font-bold text-gray-800">

                    {item.title}

                  </h3>

                  <p className="text-pink-600 text-2xl font-bold mt-3">

                    ${item.price}

                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition"
                    >
                      Move to Cart
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-semibold transition"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}