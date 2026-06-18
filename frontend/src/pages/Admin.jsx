import React, { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function Admin() {

  // =========================
  // STATES
  // =========================

  const [tab, setTab] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [messages, setMessages] = useState([]);

  const [analytics, setAnalytics] = useState(null);

  const [filter, setFilter] = useState("month");

  const [selectedRole, setSelectedRole] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [selectedDesign, setSelectedDesign] = useState(null);

  function formatRole(role) {

  if (role === "client") {
    return "Interior Designer";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "User";

}

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    async function load() {

      const token = localStorage.getItem("token");

      if (!token) return;

      let url = "";

      // USERS
      if (tab === "users") {

        url = "http://localhost:4000/api/admin/users";

      }

      // ORDERS
      else if (tab === "orders") {

        url = "http://localhost:4000/api/orders";

      }

      // DESIGNS
      else if (tab === "designs") {

        url = "http://localhost:4000/api/admin/designs";

      }

      // DASHBOARD
      else if (tab === "dashboard") {

        url =
          `http://localhost:4000/api/admin/analytics?filter=${filter}`;

      }
      // Messages
      else if (tab === "messages") {

        url = "http://localhost:4000/api/admin/messages";

      }

      const res = await fetch(url, {
        headers: {
          Authorization: token
        },
      });

      if (res.ok) {

        const data = await res.json();

        if (tab === "users") {

          setUsers(data);

        }

        else if (tab === "orders") {

          setOrders(data);

        }

        else if (tab === "designs") {

          setDesigns(data);

        }

        else if (tab === "dashboard") {

          setAnalytics(data);

        }
        else if (tab === "messages") {

          setMessages(data);

        }

      }

    }

    load();

  }, [tab, filter]);

  // =========================
  // DELETE USER
  // =========================

  async function deleteUser(id) {

    if (!window.confirm("Delete this user?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:4000/api/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token
        },
      }
    );

    if (res.ok) {

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );

    }

  }

  // =========================
  // DELETE DESIGN
  // =========================

  async function deleteDesign(id) {

    if (!window.confirm("Delete this design?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:4000/api/admin/designs/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token
        },
      }
    );

    if (res.ok) {

      setDesigns((prev) =>
        prev.filter((d) => d.id !== id)
      );

    }

  }

  // =========================
  // FILTER USERS
  // =========================

  const filteredUsers = users.filter(
    (u) =>
      selectedRole === "all" ||
      u.role === selectedRole
  );

  // =========================
  // UI
  // =========================

  return (

    <div className="bg-gray-100 min-h-screen p-8">

      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h2>

        {/* TABS */}
        <div className="flex gap-3 mb-6 flex-wrap">

          {[
            "dashboard",
            "users",
            "orders",
            "designs",
            "messages"
          ].map((t) => (

            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg transition ${
                tab === t
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 hover:bg-pink-400 hover:text-white"
              }`}
            >

              {t.toUpperCase()}

            </button>

          ))}

        </div>

        {/* ================================= */}
        {/* DASHBOARD */}
        {/* ================================= */}

        {tab === "dashboard" && analytics && (

          <>

            {/* FILTER */}
            <div className="flex justify-end mb-5">

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="border p-2 rounded-lg"
              >

                <option value="day">
                  Day
                </option>

                <option value="month">
                  Month
                </option>

                <option value="year">
                  Year
                </option>

              </select>

            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

              {/* REVENUE */}
              <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">

                <h4 className="text-lg">
                  Total Revenue
                </h4>

                <p className="text-3xl font-bold mt-2">
                  ${analytics.revenue || 0}
                </p>

              </div>

              {/* PROFIT */}
              <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">

                <h4 className="text-lg">
                  Total Profit
                </h4>

                <p className="text-3xl font-bold mt-2">
                  ${analytics.profit || 0}
                </p>

              </div>

              {/* ORDERS */}
              <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">

                <h4 className="text-lg">
                  Total Orders
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {analytics.totalOrders || 0}
                </p>

              </div>

              {/* USERS */}
              <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">

                <h4 className="text-lg">
                  Total Users
                </h4>

                <p className="text-3xl font-bold mt-2">
                  {analytics.totalUsers || 0}
                </p>

              </div>

            </div>

            {/* REVENUE CHART */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">

              <h3 className="text-xl font-bold mb-5">
                Revenue Analytics
              </h3>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <LineChart
                  data={analytics.salesChart}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="label" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  {/* REVENUE */}
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />

                  {/* PROFIT */}
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            {/* TOP DESIGNS */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">

              <h3 className="text-xl font-bold mb-5">
                Top Selling Designs
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={analytics.topDesigns}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="totalSales"
                    fill="#ec4899"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </>

        )}

        

        {/* ================================= */}
        {/* USERS */}
        {/* ================================= */}

        {tab === "users" && (

          <>

            <div className="flex justify-between mb-4">

              <h3 className="text-xl font-semibold">
                Users
              </h3>

              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value)
                }
                className="border p-2 rounded"
              >

                <option value="all">
                  All
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="client">
                  Interior Designer
                </option>

                <option value="user">
                  User
                </option>

              </select>

            </div>

            <table className="w-full border">

              <thead className="bg-gray-200">

                <tr>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((u) => (

                  <tr
                    key={u.id}
                    className="text-center border-t"
                  >

                    <td>{u.name}</td>

                    <td>{u.email}</td>

                    <td>{formatRole(u.role)}</td>

                    <td>

                      <button
                        onClick={() =>
                          setSelectedUser(u)
                        }
                        className="bg-blue-500 text-white px-2 py-1 m-1 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(u.id)
                        }
                        className="bg-red-500 text-white px-2 py-1 m-1 rounded"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </>

        )}

        {/* ================================= */}
        {/* ORDERS */}
        {/* ================================= */}

        {tab === "orders" && (

          <>

            <h3 className="text-xl font-semibold mb-4">
              Orders
            </h3>

            <table className="w-full border">

              <thead className="bg-gray-200">

                <tr>

                  <th>ID</th>

                  <th>User</th>

                  <th>Date</th>

                  <th>Total</th>

                </tr>

              </thead>

              <tbody>

                {orders.map((o) => (

                  <tr
                    key={o.id}
                    className="text-center border-t"
                  >

                    <td>{o.id}</td>

                    <td>
                      {o.userName || o.userId}
                    </td>

                    <td>
                      {new Date(
                        o.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>${o.total}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </>

        )}

        {/* ================================= */}
        {/* DESIGNS */}
        {/* ================================= */}

        {tab === "designs" && (

          <>

            <h3 className="text-xl font-semibold mb-4">
              Designs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {designs.map((d) => (

                <div
                  key={d.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden"
                >

                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">

                    <h4 className="font-bold text-lg">
                      {d.title}
                    </h4>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {d.description}
                    </p>

                    <p className="text-xs mt-2 text-gray-500">
                      By: {d.userName || d.userId}
                    </p>

                    <div className="flex justify-between mt-3">

                      <button
                        onClick={() =>
                          setSelectedDesign(d)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          deleteDesign(d.id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

      {/* ================================= */}
{/* ================================= */}
{/* MESSAGES */}
{/* ================================= */}

{tab === "messages" && (

  <div className="w-full">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

      <div>

        <h3 className="text-3xl font-bold text-gray-800">
          Customer Enquiries
        </h3>

        <p className="text-gray-500 mt-1">
          View and manage customer contact requests
        </p>

      </div>

      {/* TOTAL COUNT */}
      <div className="bg-pink-100 text-pink-700 px-5 py-3 rounded-xl shadow-sm">

        <p className="text-sm font-medium">
          Total Messages
        </p>

        <h4 className="text-2xl font-bold">
          {messages.length}
        </h4>

      </div>

    </div>

    {/* TABLE CONTAINER */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

      {/* TABLE HEADER */}
      <div className="px-6 py-4 border-b bg-gray-50">

        <h4 className="text-lg font-semibold text-gray-700">
          Recent Customer Messages
        </h4>

      </div>

      {/* RESPONSIVE TABLE */}
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">

            <tr>

              <th className="px-6 py-4 text-left font-semibold">
                Customer
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Contact
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Requirements
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-center font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {messages.length > 0 ? (

              messages.map((m) => (

                <tr
                  key={m.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* CUSTOMER */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-lg">

                        {m.name?.charAt(0).toUpperCase()}

                      </div>

                      <div>

                        <p className="font-semibold text-gray-800">
                          {m.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Customer Enquiry
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-5">

                    <div className="space-y-1">

                      <p className="text-gray-800 font-medium">
                        {m.email}
                      </p>

                      <p className="text-sm text-gray-500">
                        {m.phone}
                      </p>

                    </div>

                  </td>

                  {/* REQUIREMENTS */}
                  <td className="px-6 py-5 max-w-md">

                    <p className="text-gray-700 leading-relaxed line-clamp-3">

                      {m.requirements}

                    </p>

                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5">

                    <div>

                      <p className="text-gray-800 font-medium">

                        {new Date(
                          m.created_at
                        ).toLocaleDateString()}

                      </p>

                      <p className="text-sm text-gray-500">

                        {new Date(
                          m.created_at
                        ).toLocaleTimeString()}

                      </p>

                    </div>

                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-center">

                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Reply
                    </a>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-16 text-gray-500"
                >

                  <div className="flex flex-col items-center">

                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-3xl">

                      📭

                    </div>

                    <h4 className="text-lg font-semibold">
                      No Messages Found
                    </h4>

                    <p className="text-sm mt-1">
                      Customer enquiries will appear here
                    </p>

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>

)}

      {/* ================================= */}
      {/* USER MODAL */}
      {/* ================================= */}

      {selectedUser && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-96">

            <h3 className="text-xl font-bold mb-3">
              User Details
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {selectedUser.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedUser.email}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {formatRole(selectedUser.role)}
            </p>

            <button
              onClick={() =>
                setSelectedUser(null)
              }
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* ================================= */}
      {/* DESIGN MODAL */}
      {/* ================================= */}

      {selectedDesign && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white rounded-xl p-6 w-[400px]">

            <img
              src={selectedDesign.image}
              alt={selectedDesign.title}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="text-xl font-bold mt-3">
              {selectedDesign.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {selectedDesign.description}
            </p>

            <p className="text-sm mt-2">

              <strong>Uploader:</strong>{" "}

              {selectedDesign.userName ||
                selectedDesign.userId}

            </p>

            <p className="text-sm">

              <strong>Date:</strong>{" "}

              {new Date(
                selectedDesign.created_at
              ).toLocaleDateString()}

            </p>

            <button
              onClick={() =>
                setSelectedDesign(null)
              }
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}