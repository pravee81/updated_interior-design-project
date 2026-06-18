import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Designs from './pages/Designs';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Client from './pages/Client';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Services from './pages/Services';
import UserPage from './pages/User';
import WishlistPage from "./pages/WishlistPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<UserPage />} /> 
          <Route path="/client" element={<Client />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/wishlist" element={<WishlistPage />}/>
        </Routes>
      </main>
      <footer className="bg-white py-4 text-center text-sm text-gray-600">
        © Interior-design Demo
      </footer>
    </div>
  );
}
