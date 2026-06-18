import React, { useEffect, useState, useMemo } from "react";
/**
 * Helper: build 18 items (3 pages x 6) per category by repeating the given URLs.
 */
function expandItems(urls, titlePrefix, priceBase, startId) {
  const out = [];
  const count = 18; // 3 pages * 6 per page
  for (let i = 0; i < count; i++) {
    const url = urls[i % urls.length];
    out.push({
      id: startId + i,
      title: `${titlePrefix} ${i + 1}`,
      price: priceBase + ((i % 6) * 5), // a little variation
      image: url,
      rating: 4 + (i % 2 === 0 ? 0 : 1), // 4 or 5 stars
    });
  }
  return out;
}

export default function UserPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Wall Designs");
  const [page, setPage] = useState(0); // 0-based
  const [wishlist, setWishlist] = useState([]);
  const [designs, setDesigns] = useState([]);
   useEffect(() => {

    loadWishlist();

  }, []);

  useEffect(() => {

    fetch("http://localhost:4000/api/designs")
      .then((r) => r.json())
      .then((data) => {

        setDesigns(data);

      });

  }, []);

  const categories = [
  ...new Set(
    designs.map((d) => d.category)
  )
];

  function onSelectCategory(cat) {
    setSelectedCategory(cat);
    setPage(0);
    setDrawerOpen(false);
  }

  const pageSize = 6;
  const items = designs.filter(
  (d) => d.category === selectedCategory
  );
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = page * pageSize;
  const visible = items.slice(start, start + pageSize);

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

  }

}

  async function toggleWishlist(item) {

  const token = localStorage.getItem("token");

  if (!token) {

    return alert("Please login first");

  }

  try {

    const alreadyExists = wishlist.some(
      (w) => w.designId === item.id
    );

    // REMOVE
    if (alreadyExists) {

      const existingItem = wishlist.find(
        (w) => w.designId === item.id
      );

      const res = await fetch(
        `http://localhost:4000/api/wishlist/${existingItem.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

            if (res.ok) {

              setWishlist((prev) =>
                prev.filter((w) => w.id !== existingItem.id)
              );

            }

          }

          // ADD
          else {

            const res = await fetch(
              "http://localhost:4000/api/wishlist",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  designId: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                }),
              }
            );

            if (res.ok) {

              loadWishlist();

            }

          }

        } catch (error) {

          console.error(error);

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
          title: item.title,
          price: item.price,
          image: item.image || "",
          quantity: 1,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) alert(`${item.title} added to cart`);
      else alert(j.message || "Failed to add to cart");
    } catch {
      alert("Error adding to cart");
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 text-gray-900 flex flex-col">
      {/* Header */}
         <div className="bg-pink-700 text-white text-center py-3 text-2xl font-bold">
          User Dashboard
        </div>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-md hover:bg-pink-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="2" rx="1" fill="#111827" />
              <rect x="3" y="11" width="18" height="2" rx="1" fill="#111827" />
              <rect x="3" y="16" width="18" height="2" rx="1" fill="#111827" />
            </svg>
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-pink-700">
            {selectedCategory}
          </h1>

          <div className="w-10" />
        </div>
      </header>

      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed z-40 inset-y-0 left-0 w-72 bg-white shadow-xl border-r border-pink-100 animate-[slideIn_.2s_ease]">
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <span className="font-semibold text-pink-700">Categories</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded hover:bg-pink-100"
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="p-3 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    selectedCategory === cat
                      ? "bg-pink-600 text-white"
                      : "bg-pink-100 hover:bg-pink-200 text-pink-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>
        </>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden flex flex-col"
              >
                {/* Fixed-size image container */}
                <div className="w-full aspect-[4/3] bg-pink-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="font-semibold text-gray-800">{item.title}</div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.round(item.rating || 4);
                      return (
                        <svg
                          key={i}
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          fill={filled ? "#f59e0b" : "#e5e7eb"}
                        >
                          <path d="M10 15l-4.33 2.276 1.06-4.99-3.73-3.3 5.04-.44L10 4l1.96 4.546 5.04.44-3.73 3.3 1.06 4.99z" />
                        </svg>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-pink-700 font-bold">
                      ${item.price}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(item)}
                        className={`p-2 rounded-full border transition ${
                          wishlist.some((w) => w.designId === item.id)
                            ? "border-red-500 bg-red-50"
                            : "border-pink-200 bg-white hover:bg-red-50"
                        }`}
                        title="Add to Wishlist"
                        aria-label="Add to Wishlist"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={wishlist.some((w) => w.designId === item.id) ? "#ef4444" : "none"}
                          stroke={wishlist.some((w) => w.designId === item.id) ? "#ef4444" : "#ef4444"}
                          strokeWidth="2"
                        >
                          <path d="M12.1 21.35l-1.1-1.01C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.9 11.84l-1 1.01z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`px-4 py-2 rounded-md border ${
                page === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-pink-100 text-pink-800 border-pink-200"
              }`}
            >
              Prev
            </button>
            <span className="text-pink-700 font-medium">
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={`px-4 py-2 rounded-md border ${
                page >= totalPages - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-pink-100 text-pink-800 border-pink-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%);} to { transform: translateX(0);} }
      `}</style>
    </div>
  );
}
