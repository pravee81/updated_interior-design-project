import React, { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Import images
import img1 from "../images/665a776f-b4bd-4a87-a6ed-b2afe4df0896.jpg";
import img2 from "../images/94cf7983-115b-4ab6-a590-4a0c6cd56825.jpg";
import img3 from "../images/8437f646-609b-4323-8ac4-b474096f173f.jpg";
import img4 from "../images/a214fb00-af77-4b0a-b7cd-c462de70d7d3.jpg";
import img5 from "../images/AdobeStock_267566919_Preview.jpeg";
import img7 from "../images/1fa3ba3c-6acb-454f-90b4-9e7201e84131.jpg";
import img8 from "../images/2ab1c20e-f539-458c-b2a6-ab67ea6674b7.jpg";

const IMAGES = [
  { id: 1, title: "Design 1", price: 50, src: img1 },
  { id: 2, title: "Design 2", price: 60, src: img2 },
  { id: 3, title: "Design 3", price: 45, src: img3 },
  { id: 4, title: "Design 4", price: 70, src: img4 },
  { id: 5, title: "Design 5", price: 55, src: img5 },
  { id: 6, title: "Design 6", price: 80 },
  { id: 7, title: "Design 7", price: 65, src: img7 },
  { id: 8, title: "Design 8", price: 75, src: img8 },
];

export default function Client() {
  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 6; // Show 6 per page

  function nextPage() {
    if (startIndex + pageSize < IMAGES.length) {
      setStartIndex((prev) => prev + pageSize);
    }
  }

  function prevPage() {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - pageSize);
    }
  }

  async function addToCart(item) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to add to cart");

    try {
      const res = await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          designId: item.id,
          quantity: 1,
          price: item.price,
          title: item.title,
          image: item.src || "",
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) alert(`${item.title} added to cart`);
      else alert(j.message || "Failed to add to cart");
    } catch (err) {
      alert("Error adding to cart");
    }
  }

  const visibleImages = IMAGES.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen bg-pink-100 text-black p-6 flex flex-col">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-pink-600">Interior Designer Dashboard</h1>
        <p className="mt-2 text-gray-700">
          Welcome! Browse and add designs to your cart.
        </p>
      </header>

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
        {visibleImages.map((img) => (
          <div
            key={img.id}
            className="bg-white text-black rounded shadow-lg p-4 flex flex-col"
          >
            <div className="w-full h-56 bg-pink-50 rounded mb-3 flex items-center justify-center overflow-hidden">
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">{img.title}</h3>

            {/* Rating in gold */}
            <div className="flex mb-3">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={index < 4 ? "#FFD700" : "#d1d5db"}
                  className="w-5 h-5 mr-1"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15l-3.802 2.01 1.464-4.535-3.604-2.78 4.472-.352L10 2l1.47 4.342 4.47.352-3.604 2.78 1.464 4.535L10 15z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="text-pink-700 font-bold">${img.price}</div>
              <button
                onClick={() => addToCart(img)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevPage}
          disabled={startIndex === 0}
          className={`p-3 rounded-full transition ${
            startIndex === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          <FiArrowLeft size={24} color="white" />
        </button>

        <button
          onClick={nextPage}
          disabled={startIndex + pageSize >= IMAGES.length}
          className={`p-3 rounded-full transition ${
            startIndex + pageSize >= IMAGES.length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          <FiArrowRight size={24} color="white" />
        </button>
      </div>
    </div>
  );
}
