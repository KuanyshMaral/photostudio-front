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
      authLogin(res.token, res.user);
      toast.success('Вход выполнен успешно!');
      
      // Redirect based on user role
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else if (res.user?.role === 'studio_owner') {
        navigate('/owner');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка входа. Проверьте учетные данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">StudioBooking</div>
          <h2 className="auth-title">Добро пожаловать</h2>
          <p className="auth-sub">Войдите в свой аккаунт для продолжения</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            <span className="visually-hidden">Email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Пароль</span>
            <input
              className="auth-input"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <footer className="auth-footer">
          <small>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></small>
        </footer>
      </div>
    </div>
  );
}
