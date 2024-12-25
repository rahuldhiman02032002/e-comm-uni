import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom"; // For navigation
import Header from "../../../components/Header";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const userId = sessionStorage.getItem("userId"); // Get the userId from sessionStorage
  const [selectedProducts, setSelectedProducts] = useState([]); // To track selected products
  const navigate = useNavigate(); // Hook for navigation

  // Fetch cart products
  const fetchCartProducts = async () => {
    if (!userId) {
      console.error("User is not logged in");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8081/view-cart?userId=${userId}` // Pass userId from sessionStorage
      );
      setCartProducts(response.data.cart.products);
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartProducts();
    }
  }, [userId]);

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put("http://localhost:8081/quantity", {
        userId,
        productId,
        quantity,
      });
      fetchCartProducts();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete("http://localhost:8081/delete-cart-item", {
        data: { userId, productId },
      });
      fetchCartProducts();
      window.dispatchEvent(new Event("cartUpdated")); // Dispatch event here
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle the selection of products
  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        // Deselect the product if it's already selected
        return prevSelectedProducts.filter((id) => id !== productId);
      } else {
        // Select the product if it's not selected
        return [...prevSelectedProducts, productId];
      }
    });
  };

  // Handle the click on "Summary" button
  // Handle the click on "Summary" button
  const handleSummaryClick = () => {
    const selectedProductDetails = cartProducts
      .filter((product) => selectedProducts.includes(product.productId._id))
      .map((product) => ({
        id: product.productId._id,
        name: product.productId.name,
        price: product.productId.price,
        quantity: product.quantity,
        totalPrice: product.productId.price * product.quantity,
      }));

    // Store selected products' details in sessionStorage
    sessionStorage.setItem(
      "selectedProductsDetails",
      JSON.stringify(selectedProductDetails)
    );

    // Redirect to Summary page
    navigate("/summary");
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2>Your Cart</h2>
        {cartProducts.length === 0 ? (
          <p>No products in the cart.</p>
        ) : (
          <div className="row">
            {cartProducts.map((product) => (
              <div className="col-md-4" key={product.productId._id}>
                <div className="card">
                  <img
                    className="card-img-top"
                    src={`http://localhost:8081/${product.productId.images}`}
                    alt={product.productId.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.productId.name}</h5>
                    <p>Price: ${product.productId.price}</p>
                    <p>Total: ${product.productId.price * product.quantity}</p>

                    {/* Checkbox for product selection */}
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedProducts.includes(
                          product.productId._id
                        )}
                        onChange={() =>
                          handleProductSelection(product.productId._id)
                        }
                      />
                      <label className="form-check-label">Select</label>
                    </div>

                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-secondary me-2"
                        onClick={() =>
                          updateQuantity(
                            product.productId._id,
                            product.quantity - 1
                          )
                        }
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        className="btn btn-secondary ms-2"
                        onClick={() =>
                          updateQuantity(
                            product.productId._id,
                            product.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger mt-3"
                      onClick={() => deleteProduct(product.productId._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Summary Button */}
        <button
          className="btn btn-primary mt-4"
          onClick={handleSummaryClick}
          disabled={selectedProducts.length === 0}
        >
          Go to Summary
        </button>
      </div>
    </div>
  );
}

export default Cart;