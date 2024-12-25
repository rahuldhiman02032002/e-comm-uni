import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import University from "../university/University";
import axios from "axios";
import { map } from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";
import Swal from "sweetalert2";
import { success } from "toastr";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Department() {
  const navigate = useNavigate();
  const query = useQuery();
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: null,
    university: query.get("universityId"),
  });
  const [formError, setFormError] = useState({ name: "", image: "" });
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  function getDepartmentsByUniversity() {
    try {
      axios
        .get(
          "http://localhost:8081/department?universityId=" +
            query.get("universityId")
        )
        .then((d) => {
          setDepartments(d.data.depData);
          //DataTable
          setTimeout(() => {
            $("#deptable").DataTable();
          }, 0);
        });
    } catch (error) {
      alert("Fail to submit data");
    }
  }
  useEffect(() => {
    getDepartmentsByUniversity();
  }, []);

  function saveDepartment() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", query.get("universityId"));
      axios
        .post("http://localhost:8081/department", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          Swal.fire("Department Created", {
            icon: "success",
          });
          getDepartmentsByUniversity();
          resetForm();
        });
    } catch (error) {
      Swal.fire("Fail to submit data");
    }
  }
  function resetForm() {
    setForm({ name: "", image: null, university: query.get("universityId") });
  }
  function updateDepartment() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", query.set("universityId"));
      formData.append("id", departmentId);
      axios
        .put("http://localhost:8081/department", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          Swal.fire("Update Department", {
            icon: "success",
          });
          getDepartmentsByUniversity();
          resetForm();
        });
    } catch (error) {
      Swal.fire("Fail to submit data");
    }
  }
  function deleteDepartment(id) {
    // SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete("http://localhost:8081/department", { data: { id: id } })
            .then((d) => {
              // Success alert
              Swal.fire("Deleted!", d.data.message, "success");
              getDepartmentsByUniversity();
              resetForm();
            })
            .catch(() => {
              // Error alert
              Swal.fire("Error!", "Failed to delete data.", "error");
            });
        } catch (error) {
          // Error alert in case of unexpected issues
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  }

  function onDepartmentSubmit() {
    let errors = false;
    let error = { name: "", image: "" };
    if (form.name.trim().length == 0) {
      errors = true;
      error = { ...error, name: "Department Name Empty" };
    }
    if (form.image == null) {
      errors = true;
      error = { ...error, image: "Department Image Empty" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      departmentId ? updateDepartment() : saveDepartment();
    }
  }
  function renderDepartments() {
    return departments?.map((item) => {
      return (
        <tr>
          <td>
            <img
              src={"http://localhost:8081/" + item.image}
              height={150}
              width={200}
            />
          </td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                navigate(
                  ROUTES.productAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              <i className="fa fa-plus"></i>&nbsp;Add Product
            </button>
          </td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => {
                setDepartmentId(item._id);
                setForm({ ...form, name: item.name });
              }}
            >
              <i className="fa fa-edit"></i>&nbsp; Edit
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteDepartment(item._id);
              }}
            >
              <i className="fa fa-trash"></i>&nbsp; Delete
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
            {departmentId ? "Edit Department" : "New Department"}
          </div>
          <div class="card-body">
            <div className="form-group row">
              <label className="col-4">University Name</label>
              <div className="col-8">
                <input
                  type="text"
                  value={query.get("name")}
                  disabled
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4">Department Name</label>
              <div className="col-8">
                <input
                  type="text"
                  value={form.name}
                  name="name"
                  placeholder="Department Name"
                  className="form-control"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4">Department Image</label>
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
                onDepartmentSubmit();
              }}
            >
              {departmentId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="border p-2 m-2">
        <table id="deptable" className="table table-borderd table-active">
          <thead>
            <tr>
              <th>Department Image</th>
              <th>Department Name</th>
              <th>Add Product</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderDepartments()}</tbody>
        </table>
      </div>
    </>
  );
}

export default Department;
