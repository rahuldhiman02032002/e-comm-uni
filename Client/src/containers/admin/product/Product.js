import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Product() {
  const query = useQuery();
  const [productId, setProductId] = useState(null);
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState({
    name: "",
    images: null,
    departmentId: query.get("id"),
    description: "",
    qty: 10,
    price: 0,
  });
  const [formError, setFormError] = useState({
    name: "",
    images: "",
    description: "",
    qty: "",
    price: "",
  });
  function getProductsByDepartment() {
    try {
      axios
        .get("http://localhost:8081/product?departmentId=" + query.get("id"))
        .then((d) => {
          setProducts(d.data.prdData);
          setTimeout(() => {
            $("#prdtable").DataTable();
          }, 0);
        });
    } catch (error) {
      alert("Unable to Access API!!!");
    }
  }
  useEffect(() => {
    getProductsByDepartment();
  }, []);
  function saveProduct() {
    try {
      const formData = new FormData();
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          formData.append("images", form.images[i]);
        }
      }
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("qty", form.qty);
      formData.append("departmentId", query.get("id"));

      axios
        .post("http://localhost:8081/product", formData) // No need for manual content-type
        .then((response) => {
          Swal.fire({
            title: "Product Created",
            icon: "success",
          });
          getProductsByDepartment();
          resetForm();
        })
        .catch((error) => {
          Swal.fire({
            title: "Failed to Create Product",
            text: error.message,
            icon: "error",
          });
        });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred",
        icon: "error",
      });
    }
  }

  function resetForm() {
    setForm({
      name: "",
      images: null,
      departmentId: query.get("id"),
      description: "",
      qty: 10,
      price: 0,
    });
  }
  function updateProduct() {
    try {
      const formData = new FormData();
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i], form.images[i].name);
      }
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("qty", form.qty);
      formData.append("departmentId", query.get("id"));
      formData.append("id", productId);
      axios
        .put("http://localhost:8081/product", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          Swal.fire("Update Product", {
            icon: "success",
          });
          getProductsByDepartment();
          resetForm();
        });
    } catch (error) {
      Swal.fire("Fail to submit");
    }
  }
  function deleteProduct(id) {
    // Simple SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("http://localhost:8081/product", { data: { id: id } })
          .then((d) => {
            Swal.fire("Deleted!", d.data.message, "success");
            getProductsByDepartment();
            resetForm();
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete data.", "error");
          });
      }
    });
  }
  function onProductSubmit() {
    let errors = false;
    let error = { name: "", images: "", description: "", qty: "", price: "" };
    if (form.name.trim().length == 0) {
      errors = true;
      error = { ...error, name: "Product name Empty" };
    }
    if (form.description.trim().length == 0) {
      error = true;
      error = { ...error, description: "Product Description Empty" };
    }
    if (form.qty == "" || form.qty == 0) {
      error = true;
      error = { ...error, qty: "Please Select QTY" };
    }
    if (form.price == "" || form.price == 0) {
      error = true;
      error = { ...error, price: "Please Enter Price" };
    }
    if (form.images == null) {
      error = true;
      error = { ...error, images: "Please Select Image" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      productId ? updateProduct() : saveProduct();
    }
  }
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  function renderProducts() {
    return products?.map((item) => {
      return (
        <tr>
          <td>
            <img
              src={"http://localhost:8081/" + item.images}
              height="150px"
              width="150px"
            />
          </td>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td>{item.price}</td>
          <td>{item.qty}</td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setProductId(item._id);
                setForm({
                  ...form,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  qty: item.qty,
                });
              }}
            >
              <i className="fa fa-edit"></i>&nbsp;Edit
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteProduct(item._id);
              }}
            >
              <i className="fa fa-trash"></i>&nbsp;Delete
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <>
      <Header />
      <div className="row p-2 m-2">
        <div className="card text-center mx-auto">
          <div className="card-header bg-info text-white">
            {productId ? "Edit Product" : "New Product"}
          </div>

          <div className="card-body">
            {/* Department Name */}
            <div className="form-group row">
              <label className="col-4">Department Name</label>
              <div className="col-8">
                <input
                  type="text"
                  value={query.get("name")}
                  disabled
                  className="form-control"
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>

            {/* Product Name */}
            <div className="form-group row">
              <label className="col-4">Product Name</label>
              <div className="col-8">
                <input
                  type="text"
                  value={form.name}
                  name="name"
                  placeholder="Product Name"
                  className="form-control"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>

            {/* Product Image */}
            <div className="form-group row">
              <label className="col-4">Product Image</label>
              <div className="col-8">
                <input
                  type="file"
                  multiple
                  className="form-control"
                  onChange={(e) => {
                    let file = e.target.files;
                    setForm({ ...form, images: file });
                  }}
                />
                <p className="text-danger">{formError.images}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="form-group row">
              <label className="col-4">Quantity</label>
              <div className="col-8">
                <input
                  type="number"
                  value={form.qty}
                  name="qty"
                  placeholder="Quantity"
                  className="form-control"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.qty}</p>
              </div>
            </div>

            {/* Price */}
            <div className="form-group row">
              <label className="col-4">Price</label>
              <div className="col-8">
                <input
                  type="number"
                  value={form.price}
                  name="price"
                  placeholder="Price"
                  className="form-control"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.price}</p>
              </div>
            </div>

            {/* Description */}
            <div className="form-group row">
              <label className="col-4">Description</label>
              <div className="col-8">
                <textarea
                  value={form.description}
                  name="description"
                  placeholder="Product Description"
                  className="form-control"
                  onChange={changeHandler}
                ></textarea>
                <p className="text-danger">{formError.description}</p>
              </div>
            </div>
          </div>

          <div className="card-footer text-muted">
            <button
              className="btn btn-info"
              onClick={() => {
                onProductSubmit();
              }}
            >
              {productId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="border p-2 m-2">
        <table
          id="prdtable"
          className="table table-bordered table-striped table-active"
        >
          <thead>
            <tr>
              <th>Images</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderProducts()}</tbody>
        </table>
      </div>
    </>
  );
}

export default Product;
