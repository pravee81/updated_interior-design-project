import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    requirements: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error" | ""

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessageType("success");
        setMessage(data.message || "Message sent successfully!");
        setFormData({ name: "", phone: "", email: "", requirements: "" });
      } else {
        setMessageType("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4">
      {/* Centered container: 60% width, 70% height */}
      <div className="w-[60vw] h-[70vh] bg-white rounded-2xl shadow-lg border border-pink-100 flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
            Contact Us
          </h2>
          {message && (
            <p
              className={`mt-4 text-center text-sm sm:text-base font-medium ${
                messageType === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Form (scrollable if content overflows) */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto space-y-5"
          >
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Your phone (optional)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 font-medium">
                Requirements
              </label>
              <textarea
                name="requirements"
                placeholder="Tell us what you need…"
                value={formData.requirements}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
              />
            </div>

            {/* Submit centered */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="px-8 py-3 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
