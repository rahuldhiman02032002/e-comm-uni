import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserDepartment() {
  const query = useQuery();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  function getDepartments() {
    try {
      axios
        .get("http://localhost:8081/department?universityId=" + query.get("id"))
        .then((response) => {
          setDepartments(response.data.depData);
          setTimeout(() => {
            $("#departmentTable").DataTable(); // Initialize DataTable
          }, 0);
        });
    } catch (error) {
      console.log("Unable to fetch departments:", error);
    }
  }

  useEffect(() => {
    getDepartments();
  }, []);

  function renderDepartments() {
    if (!departments || departments.length === 0) {
      return (
        <tr>
          <td colSpan="1" className="text-center">
            No Departments Found
          </td>
        </tr>
      );
    }

    return departments.map((item, index) => (
      <tr key={index}>
        <td>
          <div className="row m-4">
            <div className="col-6 mx-auto">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src={"http://localhost:8081/" + item.image}
                  height="250"
                  alt="Department"
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{item.name}</h5>
                  <button
                    onClick={() =>
                      navigate(ROUTES.productUser.name + "?id=" + item._id)
                    }
                    className="btn btn-primary text-white"
                  >
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <table id="departmentTable" className="display">
          <thead>
            <tr>
              <th>Departments</th>
            </tr>
          </thead>
          <tbody>
            {renderDepartments()} {/* Render each department as a single row */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDepartment;
