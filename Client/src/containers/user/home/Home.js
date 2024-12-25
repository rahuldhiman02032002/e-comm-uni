import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";

function Home() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);

  function getUniversities() {
    try {
      axios.get("http://localhost:8081/university").then((d) => {
        setUniversities(d.data.univData);
        setTimeout(() => {
          $("#univertable").DataTable(); // Initialize DataTable
        }, 0);
      });
    } catch (error) {
      console.log("Unable to access data");
    }
  }

  useEffect(() => {
    getUniversities();
  }, []);

  function renderUniversities() {
    if (!universities || universities.length === 0) {
      return <div>Not Found</div>; // Show "Not Found" if no universities
    }

    return universities.map((item, index) => (
      <tr key={index}>
        <td>
          <div className="row m-4">
            <div className="col-6 mx-auto">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src={"http://localhost:8081/" + item.image}
                  height="250"
                  alt="University"
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{item.name}</h5>
                  <button
                    onClick={() =>
                      navigate(ROUTES.departmentUser.name + "?id=" + item._id)
                    }
                    className="btn btn-primary text-white"
                  >
                    View Departments
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
        <table id="univertable" className="display">
          <thead>
            <tr>
              <th>Universities</th>
            </tr>
          </thead>
          <tbody>
            {renderUniversities()}{" "}
            {/* Render each university as a single row */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
