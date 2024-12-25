import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ProductDetails() {
  const query = useQuery();
  const navigate = useNavigate();
  const [productDet, setProductDet] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Basket count

  const getProductDetail = () => {
    axios
      .get(`http://localhost:8081/productDetail?id=${query.get("id")}`)
      .then((d) => setProductDet(d.data.prdData))
      .catch(() => console.log("Unable to fetch data!!"));
  };

  const getCartCount = () => {
    const userId = sessionStorage.getItem("userId"); // Fetch userId from sessionStorage
    if (!userId) return; // If no userId is found, return (no cart count to fetch)

    axios
      .get(`http://localhost:8081/vvie-cart?userId=${userId}`)
      .then((response) => {
        setCartCount(response.data.cart?.products.length || 0);
      })
      .catch(() => console.log("Error fetching cart count"));
  };

  const addToCart = async () => {
    try {
      const userId = sessionStorage.getItem("userId"); // Fetch userId from sessionStorage
      if (!userId) {
        Swal.fire("Please log in to add products to your cart.", {
          icon: "success",
        });
        navigate(ROUTES.login.name);
        return; // If no user is logged in, exit the function
      }

      // Add product to cart API call
      await axios.post("http://localhost:8081/add-to-cart", {
        userId: userId, // Use dynamic userId from sessionStorage
        productId: productDet._id,
        quantity: 1,
      });
      setCartCount((prevCount) => prevCount + 1); // Update cart count
      Swal.fire("Product added to cart!", {
        icon: "success",
      });
      window.dispatchEvent(new Event("cartUpdated")); // Dispatch event here
    } catch (error) {
      Swal.fire("Error adding to cart:");
    }
  };

  useEffect(() => {
    getProductDetail();
    getCartCount(); // Fetch initial cart count on mount
  }, []); // Empty dependency array ensures it runs only once on component mount
  return (
    <div>
      <Header basketCount={cartCount} />
      <div className="row p-4 m-2 justify-content-center">
        {productDet && (
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg">
              <img
                className="card-img-top"
                src={`http://localhost:8081/${productDet.images}`}
                alt="Product image"
                height="300px"
                style={{ objectFit: "cover", width: "100%" }}
              />
              <div className="card-body">
                <h5 className="card-title font-weight-bold">
                  {productDet.name}
                </h5>
                <p className="card-text text-muted">
                  <strong>Description:</strong>{" "}
                  {productDet.description || "No description available."}
                </p>
                <p className="card-text text-success">
                  <strong>Price:</strong> ${productDet.price.toFixed(2)}
                </p>
                <p className="card-text">
                  <strong>Quantity Available:</strong> {productDet.qty}
                </p>
                <button
                  onClick={addToCart}
                  className="btn btn-primary text-white btn-block"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
