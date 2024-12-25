import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import ROUTES from "../../navigations/Routes";
import Header from "../../components/Header";

function Login() {
  const [form, setform] = useState({
    email: "",
    password: "",
  });
  const [formError, setformError] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = () => {
    try {
      axios
        .post("http://localhost:8081/Controller/login", form)
        .then((response) => {
          if (response.status === 200) {
            const { id, email, role } = response.data.user;

            // Ensure correct session storage keys
            sessionStorage.setItem("userId", id);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("role", role);

            toastr.success("Login Successful!!");
            navigate(ROUTES.home.name); // Navigate to home page
          } else {
            toastr.error("Invalid credentials");
          }
        })
        .catch((error) => {
          // Handle error response from API
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            toastr.error(error.response.data.error);
          } else {
            toastr.error("An error occurred during login");
          }
        });
    } catch (error) {
      toastr.error("Failed to submit data!!!");
    }
  };

  const onLoginUser = () => {
    let errors = false;
    let error = {
      email: "",
      password: "",
    };

    if (form.email.trim().length === 0) {
      errors = true;
      error.email = "Email cannot be empty!!";
    }
    if (form.password.trim().length === 0) {
      errors = true;
      error.password = "Password cannot be empty!!";
    }

    if (errors) {
      setformError(error);
    } else {
      setformError(error);
      loginUser();
    }
  };

  return (
    <div>
      <Header />
      <div className="container d-flex p-2 justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ width: "400px" }}>
          <h3 className="card-title text-center text-primary mb-4">Login</h3>
          <div className="card-body">
            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                className="form-control"
                onChange={changeHandler}
              />
              <p className="text-danger">{formError.email}</p>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-control"
                onChange={changeHandler}
              />
              <p className="text-danger">{formError.password}</p>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                onLoginUser();
              }}
            >
              Login
            </button>
          </div>
          <div className="card-footer text-center">
            <p className="mb-1">Don't have an account?</p>
            <button
              className="btn btn-link"
              onClick={() => navigate(ROUTES.register.name)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
