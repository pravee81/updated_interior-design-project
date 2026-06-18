import React, { useEffect, useState } from 'react';
import img1 from '../images/665a776f-b4bd-4a87-a6ed-b2afe4df0896.jpg';
import img2 from '../images/94cf7983-115b-4ab6-a590-4a0c6cd56825.jpg';
import img3 from '../images/8437f646-609b-4323-8ac4-b474096f173f.jpg';
import img4 from '../images/a214fb00-af77-4b0a-b7cd-c462de70d7d3.jpg';
import img5 from '../images/AdobeStock_267566919_Preview.jpeg';
import img7 from '../images/1fa3ba3c-6acb-454f-90b4-9e7201e84131.jpg';
import img8 from '../images/2ab1c20e-f539-458c-b2a6-ab67ea6674b7.jpg';

const localDesigns = [
  { id: 101, title: 'Design A', authorId: 'John', price: 40, image: img1, description: 'Local design A' },
  { id: 102, title: 'Design B', authorId: 'Sarah', price: 50, image: img2, description: 'Local design B' },
  { id: 103, title: 'Design C', authorId: 'Mike', price: 60, image: img3, description: 'Local design C' },
  { id: 104, title: 'Design D', authorId: 'Anna', price: 70, image: img4, description: 'Local design D' },
  { id: 105, title: 'Design E', authorId: 'Tom', price: 55, image: img5, description: 'Local design E' },
  { id: 106, title: 'Design F', authorId: 'Lily', price: 80, image: img7, description: 'Local design F' },
  { id: 107, title: 'Design G', authorId: 'Chris', price: 75, image: img8, description: 'Local design G' },
];

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    title: '',
    authorId: '',
    createdAt: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });

  const [page, setPage] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    fetch('http://localhost:4000/api/designs')
      .then((r) => r.json())
      .then((data) => setDesigns([...localDesigns, ...(Array.isArray(data) ? data : [])]))
      .catch(() => setDesigns(localDesigns));
  }, []);

  const visibleDesigns = designs.slice(page * pageSize, (page + 1) * pageSize);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login');

    try {
      const res = await fetch('http://localhost:4000/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(form)
      });
      const newDesign = await res.json();
      if (res.ok) {
        setDesigns((prev) => [newDesign, ...prev]);
        setForm({ title: '', authorId: '', createdAt: '', price: '', description: '', image: '' });
        setFormVisible(false);
        alert('Design uploaded');
      } else {
        alert(newDesign.message || 'Upload failed');
      }
    } catch {
      alert('Server error');
    }
  }

  return (
    <div className="p-6 bg-pink-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-700">Designs</h2>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Upload Your Design
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6 max-w-xl ml-auto">
          <div className="grid grid-cols-1 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border px-3 py-2 rounded" />
            <input name="authorId" value={form.authorId} onChange={handleChange} placeholder="Author Name" required className="border px-3 py-2 rounded" />
            <input name="createdAt" value={form.createdAt} onChange={handleChange} placeholder="Created At (YYYY-MM-DD)" required className="border px-3 py-2 rounded" />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded"
            >

              <option value="">
                Select Category
              </option>

              <option value="Living Room">
                Living Room
              </option>

              <option value="Bedroom">
                Bedroom
              </option>

              <option value="Wardrobe">
                Wardrobe
              </option>

              <option value="Dining Room">
                Dining Room
              </option>

              <option value="Pooja Room">
                Pooja Room
              </option>

              <option value="Balcony">
                Balcony
              </option>

              <option value="Wall Designs">
                Wall Designs
              </option>

            </select>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="border px-3 py-2 rounded" />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required className="border px-3 py-2 rounded" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border px-3 py-2 rounded" rows={3} />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Submit Design
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {visibleDesigns.map((d) => (
          <div key={d.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border-2 border-pink-200">
            <img src={d.image} alt={d.title} className="w-full h-72 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg text-pink-700">{d.title}</h3>
              <p className="text-sm text-gray-600">By {d.authorId}</p>
              <p className="text-sm text-gray-500 mb-2">{d.description}</p>

              {/* Gold rating stars */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={index < 4 ? "#FFD700" : "#d1d5db"} // Gold color
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

              <div className="text-lg font-semibold text-red-600 mt-auto">$ {d.price}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          &lt; Back
        </button>
        <button
          onClick={() => setPage((p) => ((p + 1) * pageSize < designs.length ? p + 1 : p))}
          disabled={(page + 1) * pageSize >= designs.length}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
