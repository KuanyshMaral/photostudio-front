import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { login } from "./auth.api";
import type { LoginRequest } from "./auth.types";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: LoginRequest = { email, password };
      const res = await login(data);
      authLogin(res.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">MWork PhotoStudio</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-sub">Sign in to continue to your account</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            <span className="visually-hidden">Email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Password</span>
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <footer className="auth-footer">
          <small>Don't have an account? <Link to="/register">Sign up</Link></small>
        </footer>
      </div>
    </div>
  );
}
