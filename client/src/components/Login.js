import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Forms.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the JWT token and username in localStorage
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("username", formData.username);

        setIsSuccess(true);
        setMessage("Login successful!");
        setTimeout(() => navigate("/game"), 2000); // Redirect to the game page
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Invalid username or password");
      }
    } catch (err) {
      setIsSuccess(false);
      console.error(err);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
      <div className="row align-items-center g-lg-5 py-5">
        {/* Left Column */}
        <div className="col-lg-7">
          <div className="d-flex flex-column align-items-center text-center">
            {/* Image */}
            <img className="logo mb-3" src="orange.png" alt="orange" />

            {/* Title and Text */}
            <div className="custom-styles">
              <h1 className="display-4 lh-1 mb-3">
                Welcome back to Tic-Tac-Toe!
              </h1>
              <p className="fs-4">
                Log in to continue playing your favorite games.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-10 mx-auto col-lg-5">
          <form
            onSubmit={handleSubmit}
            className="p-4 p-md-5 border rounded-3 bg-body-tertiary"
          >
            {/* Alert Message */}
            {message && (
              <div
                className={`alert ${
                  isSuccess ? "alert-success" : "alert-danger"
                } mt-3`}
                role="alert"
              >
                {message}
              </div>
            )}

            {/* Email Input */}
            <div className="form-floating mb-3">
              <input
                type="email"
                id="floatingInput"
                name="username"
                className="form-control"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>

            {/* Password Input */}
            <div className="form-floating mb-3">
              <input
                type="password"
                id="floatingPassword"
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            {/* Remember Me Checkbox */}
            <div className="form-check text-start my-3">
              <input
                className="form-check-input"
                type="checkbox"
                value="remember-me"
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Log in
            </button>
            <hr className="my-4" />
            <small className="text-body-secondary">
              New here?{" "}
              <a href="/signup" className="text-primary text-decoration-none">
                Sign up here
              </a>
              .
            </small>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
