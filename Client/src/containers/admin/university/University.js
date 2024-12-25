import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
// import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Swal from "sweetalert2";
import swal from "sweetalert";

import ROUTES from "../../../navigations/Routes";
function University() {
  const [universityId, setUnversityId] = useState(null);
  const [universities, setUniversities] = useState(null);
  const [form, setForm] = useState({ name: "", image: null });
  const [formError, setFormError] = useState({ name: "", image: "" });
  const navigate = useNavigate();

  //UseEffect
  useEffect(() => {
    getAllUniversities();
  }, []);
  //Change Handler
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //RestForm
  function resetForm() {
    setForm({ name: "", image: null });
  }
  function saveUniversity() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      axios
        .post("http://localhost:8081/university", formData, {
          "content-type": "multipart/form-data",
        })
        .then(() => {
          swal("University Created", {
            icon: "success",
          });
          getAllUniversities();
          resetForm();
        });
    } catch (error) {
      swal("Error!", "Fail to Submit Data", "error");
    }
  }
  //Update
  function updateUniversity() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("id", universityId);
      axios
        .put("http://localhost:8081/university", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          swal("University Updated", {
            icon: "success",
          });
          getAllUniversities();
          resetForm();
        });
    } catch (error) {
      swal("Fail to submit data!!!", "error");
    }
  }
  function deleteUniversity(id) {
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
          .delete("http://localhost:8081/university", { data: { id: id } })
          .then((d) => {
            Swal.fire("Deleted!", d.data.message, "success");
            getAllUniversities();
            resetForm();
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete data.", "error");
          });
      }
    });
  }

  function getAllUniversities() {
    try {
      axios.get("http://localhost:8081/university").then((d) => {
        setUniversities(d.data.univData);
        //DataTable
        setTimeout(() => {
          $("#univtable").DataTable();
        }, 0);
      });
    } catch (error) {
      alert("Fail to submit data");
    }
  }
  //Save Code
  function onUniversitySubmit() {
    let errors = false;
    let error = { name: "", image: "" };
    if (form.name.trim().length == 0) {
      error = true;
      error = { ...error, image: "Pl select image" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      universityId ? updateUniversity() : saveUniversity();
    }
  }
  //Render function
  function renderUniversities() {
    return universities?.map((item) => {
      return (
        <tr>
          <td>
            <img
              src={"http://localhost:8081/" + item.image}
              height="100"
              width="200"
            />
          </td>

          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                navigate(
                  ROUTES.departmentAdmin.name +
                    "?universityId=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              <i className="fa fa-plus"></i>&nbsp; Add Department
            </button>
          </td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => {
                setUnversityId(item._id);
                setForm({ ...form, name: item.name });
              }}
            >
              <i className="fa fa-edit"></i>&nbsp;Edit
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteUniversity(item._id);
              }}
            >
              <i className="fa fa-trash">&nbsp; Delete</i>
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
        <div class="card text-center mx-auto">
          <div class="card-header bg-info text-white">
            {universityId ? "Edit University" : "New University"}
          </div>

          <div className="card-body">
            <div className="form-group row">
              <label className="col-4">University Name</label>
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="University Name"
                  value={form.name}
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4">University Image</label>
              <div className="col-8">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    let file = e.target.files[0];
                    setForm({ ...form, image: file });
                  }}
                />
                <p className="text-danger">{formError.image}</p>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            <button
              className="btn btn-info"
              onClick={() => {
                onUniversitySubmit();
              }}
            >
              {universityId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="border p-2 m-2">
        <table
          id="univtable"
          className="table table-bordered table-striped table-active"
        >
          <thead>
            <tr>
              <th>University Image</th>
              <th>University Name</th>
              <th>Add Department</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderUniversities()}</tbody>
        </table>
      </div>
    </>
  );
}

export default University;
