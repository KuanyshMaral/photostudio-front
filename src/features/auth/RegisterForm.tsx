import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from './auth.api';
import type { RegisterRequest } from './auth.types';

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: { role: 'client' }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await registerApi(data);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">MWork PhotoStudio</div>
          <h2 className="auth-title">Create Client Account</h2>
          <p className="auth-sub">Sign up to get started</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label className="auth-label">
            <span className="visually-hidden">Name</span>
            <input
              className="auth-input"
              type="text"
              placeholder="Name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="auth-error">{errors.name.message}</p>}
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format'
                }
              })}
            />
            {errors.email && <p className="auth-error">{errors.email.message}</p>}
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Phone</span>
            <input
              className="auth-input"
              type="tel"
              placeholder="Phone"
              {...register('phone', { required: 'Phone is required' })}
            />
            {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Password</span>
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password must be at least 6 characters',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && <p className="auth-error">{errors.password.message}</p>}
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-links">
            <small>Already have an account? <Link to="/login">Sign in</Link></small>
            <small>Are you a Studio Owner? <Link to="/studio-register">Register as Studio</Link></small>
          </div>
        </footer>
      </div>
    </div>
  );
}