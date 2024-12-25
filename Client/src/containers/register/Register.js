import React, { useState, useEffect } from "react";
import axios from "axios";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryId: "",
    stateId: "",
    cityId: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  // Fetch countries on component load
  useEffect(() => {
    axios
      .get("http://localhost:8081/Controller/Location/countries")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const handleCountryChange = (e) => {
    setForm({ ...form, countryId: e.target.value, stateId: "", cityId: "" });
    axios
      .get(`http://localhost:8081/Controller/Location/states/${e.target.value}`)
      .then((response) => {
        setStates(response.data);
        setCities([]);
      });
  };

  const handleStateChange = (e) => {
    setForm({ ...form, stateId: e.target.value, cityId: "" });
    axios
      .get(`http://localhost:8081/Controller/Location/cities/${e.target.value}`)
      .then((response) => {
        setCities(response.data);
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!form.firstName) formErrors.firstName = "First name is required.";
    if (!form.lastName) formErrors.lastName = "Last name is required.";
    if (!form.email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      formErrors.email = "Invalid email address.";
    if (!form.password) formErrors.password = "Password is required.";
    else if (form.password.length < 6)
      formErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      formErrors.confirmPassword = "Passwords do not match.";
    if (!form.phone) formErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone))
      formErrors.phone = "Phone number must be 10 digits.";
    if (!form.gender) formErrors.gender = "Please select a gender.";
    if (!form.countryId) formErrors.countryId = "Please select a country.";
    if (!form.stateId) formErrors.stateId = "Please select a state.";
    if (!form.cityId) formErrors.cityId = "Please select a city.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    axios
      .post("http://localhost:8081/Controller/register", form)
      .then(() => {
        toastr.success("Registration successful!");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toastr.error(error.response.data.error);
        } else {
          toastr.error("Registration failed! Please try again.");
        }
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Register</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Gender</label>
                  <div className="form-check">
                    <input
                      className={`form-check-input ${
                        errors.gender ? "is-invalid" : ""
                      }`}
                      type="radio"
                      name="gender"
                      id="male"
                      value="Male"
                      checked={form.gender === "Male"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`form-check-input ${
                        errors.gender ? "is-invalid" : ""
                      }`}
                      type="radio"
                      name="gender"
                      id="female"
                      value="Female"
                      checked={form.gender === "Female"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="female">
                      Female
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`form-check-input ${
                        errors.gender ? "is-invalid" : ""
                      }`}
                      type="radio"
                      name="gender"
                      id="other"
                      value="Other"
                      checked={form.gender === "Other"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="other">
                      Other
                    </label>
                  </div>
                  {errors.gender && (
                    <div className="invalid-feedback d-block">
                      {errors.gender}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Country</label>
                  <select
                    name="countryId"
                    value={form.countryId}
                    onChange={handleCountryChange}
                    className={`form-control ${
                      errors.countryId ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.countryId && (
                    <div className="invalid-feedback">{errors.countryId}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>State</label>
                  <select
                    name="stateId"
                    value={form.stateId}
                    onChange={handleStateChange}
                    className={`form-control ${
                      errors.stateId ? "is-invalid" : ""
                    }`}
                    disabled={!states.length}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.stateId && (
                    <div className="invalid-feedback">{errors.stateId}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>City</label>
                  <select
                    name="cityId"
                    value={form.cityId}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.cityId ? "is-invalid" : ""
                    }`}
                    disabled={!cities.length}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.cityId && (
                    <div className="invalid-feedback">{errors.cityId}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary w-100"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
