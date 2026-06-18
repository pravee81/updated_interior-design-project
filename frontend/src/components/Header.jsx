import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isLoggedIn = !!token;

  const isAdminPage = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isClientPage = location.pathname === "/client";
  const isUserPage = location.pathname === "/user";
  const isCartPage = location.pathname === "/cart";
  const isDesignsPage = location.pathname === "/designs";
  const isServicesPage = location.pathname === "/services";
  const isContactPage = location.pathname === "/contact";

  const homePath =
    role === "admin"
      ? "/admin"
      : role === "client"
      ? "/client"
      : role === "user"
      ? "/user"
      : "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <header className="bg-red-50 text-red-800 sticky top-0 z-20 shadow">
      <div className="max-w-10xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* LOGO / BRAND */}
        <button
          onClick={() => navigate(homePath)}
          className="text-2xl font-bold text-coral whitespace-nowrap"
        >
          Home Deco Website
        </button>

        <div className="flex items-center gap-4 ml-auto">

          {/* HOME + SERVICES */}
          {(isHomePage || isServicesPage) && (
            <>
              <button
                onClick={() => navigate("/")}
                className="hover:text-coral"
              >
                Home
              </button>

              <Link
                to="/services"
                className="hover:text-coral"
              >
                Services
              </Link>

              {/* <Link
                to="/contact"
                className="hover:text-coral"
              >
                Contact
              </Link> */}

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="bg-coral text-white px-4 py-2 rounded-md"
                >
                  Login
                </Link>
              )}
            </>
          )}

          {/* ADMIN PAGE */}
          {isAdminPage && (
            <>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </>
          )}

          {/* CLIENT PAGE */}
          {isClientPage && (
            <>
              <Link
                to="/designs"
                className="hover:text-coral"
              >
                Designs
              </Link>

              <Link
                to="/contact"
                className="hover:text-coral"
              >
                Contact
              </Link>

              <Link
                to="/cart"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                🛒 DecoCart
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* USER PAGE */}
          {isUserPage && (
            <>
              <Link
                to="/contact"
                className="hover:text-coral"
              >
                Contact
              </Link>
              <Link
                to="/wishlist"
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
              >
                ❤️ Wishlist 
              </Link>

              <Link
                to="/cart"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                🛒 DecoCart
              </Link>
              

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* DESIGNS PAGE */}
          {isDesignsPage && (
            <button
              onClick={() => navigate("/client")}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <FiArrowLeft size={20} />
              Back
            </button>
          )}

          {/* CART PAGE */}
          {isCartPage && (
            <button
              onClick={() =>
                role === "client"
                  ? navigate("/client")
                  : navigate("/user")
              }
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <FiArrowLeft size={20} />
              Back
            </button>
          )}

          {/* CONTACT PAGE */}
          {isContactPage && (
            <button
              onClick={() =>
                role === "client"
                  ? navigate("/client")
                  : role === "user"
                  ? navigate("/user")
                  : navigate("/")
              }
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <FiArrowLeft size={20} />
              Back
            </button>
          )}

          {/* LOGIN PAGE */}
          {isLoginPage && !isLoggedIn && (
            <Link
              to="/login"
              className="bg-coral text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}