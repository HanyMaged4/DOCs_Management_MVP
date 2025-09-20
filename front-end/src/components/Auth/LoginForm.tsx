import React, { useState } from "react";
import { signInSchema } from "../../API/DTOs/signin.dto";
import { signUpSchema } from "../../API/DTOs/signup.dto";
import { signUpAPI,signInAPI } from "../../API/auth";
import "./LoginForm.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { token } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  if (token) {
    navigate("/");
  }

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
  const [loginApiError, setLoginApiError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  // Signup form state
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "", sec_password: "" });
  const [signupErrors, setSignupErrors] = useState<{ [key: string]: string }>({});
  const [signupApiError, setSignupApiError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const { login } = useAuth();

  // Handlers for login form
  const handleLoginChange = (e: { target: { name: string; value: string; }; }) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    const { [e.target.name]: removed, ...rest } = loginErrors;
    setLoginErrors(rest);
  };
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginApiError("");
    const result = signInSchema.safeParse(loginForm);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setLoginErrors(fieldErrors);
      return;
    }
    setLoginLoading(true);
    try {
      let data = await signInAPI(result.data);
      console.log(data);
      login(data.access_token);
      navigate("/");
    } catch (err) {
      setLoginApiError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handlers for signup form
  const handleSignupChange = (e: { target: { name: string; value: string; }; }) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    const { [e.target.name]: removed, ...rest } = signupErrors;
    setSignupErrors(rest);
  };
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupApiError("");
    const result = signUpSchema.safeParse(signupForm);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setSignupErrors(fieldErrors);
      return;
    }
    setSignupLoading(true);
    try {
      let data = await signUpAPI(result.data);
      login(data.access_token);
      navigate("/");
    } catch (err) {
      setSignupApiError("Signup failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="auth-bg-container">
      {!isSignup ? (
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <h2 className="login-title">Login</h2>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
            />
            {loginErrors.email && <div className="login-error">{loginErrors.email}</div>}
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
            />
            {loginErrors.password && <div className="login-error">{loginErrors.password}</div>}
          </div>
          <button className="login-button" type="submit" disabled={loginLoading}>
            {loginLoading ? "Logging in..." : "Login"}
          </button>
          {loginApiError && <div className="login-error">{loginApiError}</div>}
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSignupSubmit}>
          <h2 className="login-title">Sign Up</h2>
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              className="login-input"
              type="text"
              name="username"
              value={signupForm.username}
              onChange={handleSignupChange}
            />
            {signupErrors.username && <div className="login-error">{signupErrors.username}</div>}
          </div>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              name="email"
              value={signupForm.email}
              onChange={handleSignupChange}
            />
            {signupErrors.email && <div className="login-error">{signupErrors.email}</div>}
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              name="password"
              value={signupForm.password}
              onChange={handleSignupChange}
            />
            {signupErrors.password && <div className="login-error">{signupErrors.password}</div>}
          </div>
          <div className="login-field">
            <label className="login-label">Secondary Password (optional)</label>
            <input
              className="login-input"
              type="password"
              name="sec_password"
              value={signupForm.sec_password}
              onChange={handleSignupChange}
            />
            {signupErrors.sec_password && <div className="login-error">{signupErrors.sec_password}</div>}
          </div>
          <button className="login-button" type="submit" disabled={signupLoading}>
            {signupLoading ? "Signing up..." : "Sign Up"}
          </button>
          {signupApiError && <div className="login-error">{signupApiError}</div>}
        </form>
      )}
      <button
        type="button"
        className="login-button"
        style={{ margin: "1.5rem auto 0 auto", background: "#333", color: "#fff", display: "block", width: "fit-content" }}
        onClick={() => {
          setIsSignup((prev) => !prev);
          setLoginErrors({});
          setLoginApiError("");
          setSignupErrors({});
          setSignupApiError("");
        }}
      >
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}
