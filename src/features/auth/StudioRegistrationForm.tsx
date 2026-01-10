import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudio } from './auth.api';
import toast from 'react-hot-toast';

const StudioRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    bin: '',
    address: '',
    contactPerson: '',
    documents: [] as File[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.companyName) newErrors.companyName = 'Company Name is required';
    } else if (currentStep === 2) {
      if (!formData.bin) newErrors.bin = 'BIN is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.contactPerson) newErrors.contactPerson = 'Contact Person is required';
    } else if (currentStep === 3) {
      if (formData.documents.length === 0) newErrors.documents = 'At least one document is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      setError(null);
      setLoading(true);
      try {
        await registerStudio(formData);
        toast.success('Studio registration submitted! We will review your documents.');
        navigate('/login');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Studio registration failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, documents: files });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">MWork PhotoStudio</div>
          <h2 className="auth-title">Studio Registration</h2>
          <p className="auth-sub">Create your studio account</p>
        </header>

        {/* Step Indicators */}
        <div className="step-indicators">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step-indicator ${step >= s ? 'active' : ''}`}>
              {s}
            </div>
          ))}
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <h3 className="step-title">Account Details</h3>
              <label className="auth-label">
                <span className="visually-hidden">Email</span>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="auth-error">{errors.email}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Password</span>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="auth-error">{errors.password}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Company Name</span>
                <input
                  className="auth-input"
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                {errors.companyName && <p className="auth-error">{errors.companyName}</p>}
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="step-title">Business Details</h3>
              <label className="auth-label">
                <span className="visually-hidden">BIN</span>
                <input
                  className="auth-input"
                  type="text"
                  name="bin"
                  placeholder="Business Identification Number"
                  value={formData.bin}
                  onChange={handleChange}
                />
                {errors.bin && <p className="auth-error">{errors.bin}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Address</span>
                <textarea
                  className="auth-input"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
                {errors.address && <p className="auth-error">{errors.address}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Contact Person</span>
                <input
                  className="auth-input"
                  type="text"
                  name="contactPerson"
                  placeholder="Contact Person"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
                {errors.contactPerson && <p className="auth-error">{errors.contactPerson}</p>}
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="step-title">Document Upload</h3>
              <label className="auth-label">
                <span className="visually-hidden">Documents</span>
                <input
                  className="auth-input"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                {errors.documents && <p className="auth-error">{errors.documents}</p>}
              </label>
              {formData.documents.length > 0 && (
                <div className="document-list">
                  <h4>Selected Documents:</h4>
                  <ul>
                    {formData.documents.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <div className="step-buttons">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="auth-button-secondary">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="auth-button">
                Next
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="auth-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            )}
          </div>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-links">
            <small>Already have an account? <Link to="/login">Sign in</Link></small>
            <small>Register as Client? <Link to="/register">Client Registration</Link></small>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudioRegistrationForm;