import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../navigations/Routes";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Basket count
  const [role, setRole] = useState("");

  const getCartCount = async () => {
    const userId = sessionStorage.getItem("userId"); // Fetch userId from sessionStorage
    if (!userId) return; // If no userId is found, return (no cart count to fetch)

    try {
      const response = await axios.get(
        `http://localhost:8081/view-cart?userId=${userId}`
      );
      setCartCount(response.data.cart?.products.length || 0); // Set cart count
    } catch (error) {
      console.log("Error fetching cart count", error);
    }
  };

  useEffect(() => {
    const userid = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("role");
    setIsLoggedIn(!!userid);
    setRole(userRole);
    // Fetch cart count when component loads
    if (userid) {
      getCartCount();
    }

    const handleCartUpdate = () => {
      getCartCount(); // Re-fetch the cart count whenever the cart is updated
    };

    window.addEventListener("cartUpdated", handleCartUpdate); // Listen for cart update event

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate); // Clean up event listener on unmount
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session variables
    setIsLoggedIn(false);
    setCartCount(0); // Reset cart count on logout
    navigate(ROUTES.login.name);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info shadow-sm">
      <a
        className="navbar-brand text-white"
        onClick={() => navigate(ROUTES.home.name)}
        style={{ cursor: "pointer" }}
      >
        <strong>Home </strong>
      </a>
      {role == "admin" ? (
        <>
          <a
            className="nav-link text-white "
            onClick={() => {
              navigate(ROUTES.universityAdmin.name);
            }}
            style={{ cursor: "pointer" }}
          >
            Universities Management
          </a>
        </>
      ) : role == "user" ? (
        <>
          <a
            className="nav-link text-white "
            onClick={() => {
              navigate(ROUTES.about.name);
            }}
            style={{ cursor: "pointer" }}
          >
            About
          </a>
          <a
            className="nav-link text-white "
            onClick={() => {
              navigate(ROUTES.contact.name);
            }}
            style={{ cursor: "pointer" }}
          >
            Contact
          </a>
          <a
            className="nav-link text-white "
            onClick={() => {
              navigate(ROUTES.support.name);
            }}
            style={{ cursor: "pointer" }}
          >
            Support
          </a>
        </>
      ) : null}

      <button
        className="btn btn-outline-light position-relative"
        onClick={() => navigate("/cart")}
      >
        <i className="fa fa-shopping-cart"></i>
        {cartCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "12px" }}
          >
            {cartCount}
          </span>
        )}
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-white">
                  {sessionStorage.getItem("name")} (
                  {sessionStorage.getItem("email")})
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button
                className="btn btn-light"
                onClick={() => navigate(ROUTES.login.name)}
              >
                Login
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
