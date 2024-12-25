import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../../navigations/Routes";
import axios from "axios";
import Header from "../../../components/Header";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserProduct() {
  const query = useQuery();
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);

  // Fetch products by department
  function getProductsByDepartment() {
    try {
      axios
        .get("http://localhost:8081/product?departmentId=" + query.get("id"))
        .then((d) => {
          setProducts(d.data.prdData);
        });
    } catch (error) {
      console.log("unable to fetch data!!!");
    }
  }

  useEffect(() => {
    getProductsByDepartment();
  }, []);

  // Initialize DataTable when products are fetched
  useEffect(() => {
    if (products) {
      setTimeout(() => {
        $("#productContainer").DataTable(); // Initialize DataTable
      }, 0);
    }
  }, [products]);

  // Render products
  function renderProducts() {
    return products?.map((item) => {
      return (
        <tr key={item._id}>
          <td>
            <div className="row m-4">
              <div className="col-6 mx-auto">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={"http://localhost:8081/" + item.images[0]}
                    height="150px"
                    width="150px"
                    alt="Card image cap"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Name: {item.name}</h5>
                    <h5 className="card-title">
                      Description: {item.description}
                    </h5>
                    <h5 className="card-title">Price: {item.price}</h5>

                    <a
                      onClick={() => {
                        navigate(ROUTES.productDetail.name + "?id=" + item._id);
                      }}
                      className="btn btn-info text-white"
                    >
                      See Product Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <table
          id="productContainer"
          className="display table table-striped table-bordered"
        >
          <thead>
            <tr>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>{renderProducts()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default UserProduct;
