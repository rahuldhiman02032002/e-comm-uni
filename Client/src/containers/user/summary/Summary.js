import React, { useEffect, useState } from "react";
import axios from "axios";

function Summary() {
  const [userDetails, setUserDetails] = useState(null);
  const selectedProducts =
    JSON.parse(sessionStorage.getItem("selectedProductsDetails")) || [];
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      // Fetch user details
      axios
        .post(
          `http://localhost:8081/Controller/getuserdetails?userId=${userId}`
        )
        .then((response) => {
          setUserDetails(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [userId]);

  // Calculate the grand total
  const grandTotal = selectedProducts.reduce(
    (sum, product) => sum + product.totalPrice,
    0
  );

  const handlePlaceOrder = () => {
    // Add logic to handle order placement
    alert("Order placed successfully!");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Order Summary</h2>

      {userDetails && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h4>User Details</h4>
          </div>
          <div className="card-body">
            <p>
              <strong>Name:</strong> {userDetails.firstName}{" "}
              {userDetails.lastName}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Phone:</strong> {userDetails.phone}
            </p>
            <p>
              <strong>Address:</strong> {userDetails.address}
            </p>
            <p>
              <strong>Country:</strong> {userDetails.country}
            </p>
            <p>
              <strong>State:</strong> {userDetails.state}
            </p>
            <p>
              <strong>City:</strong> {userDetails.city}
            </p>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h4>Selected Products</h4>
        </div>
        <div className="card-body">
          {selectedProducts.length === 0 ? (
            <p>No products selected.</p>
          ) : (
            <div className="row">
              {selectedProducts.map((product) => (
                <div className="col-md-4 mb-3" key={product.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p>
                        <strong>Price:</strong> ${product.price}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {product.quantity}
                      </p>
                      <p>
                        <strong>Total:</strong> ${product.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body text-center m-2 p-2">
          <h3>Grand Total: ${grandTotal}</h3>
          <button
            className="btn btn-primary btn-lg mt-3"
            data-bs-toggle="modal"
            data-bs-target="#placeOrderModal"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Modal for Order Confirmation */}
      <div
        className="modal fade"
        id="placeOrderModal"
        tabIndex="-1"
        aria-labelledby="placeOrderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeOrderModalLabel">
                Confirm Order
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to place this order for ${grandTotal}?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                data-bs-dismiss="modal"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
