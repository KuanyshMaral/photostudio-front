import React, { useState } from 'react';
import { registerStudio } from './auth.api';
import type { StudioRegisterRequest } from './auth.types';

const StudioRegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudioRegisterRequest>({
    email: '',
    password: '',
    companyName: '',
    bin: '',
    address: '',
    contactPerson: '',
    documents: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      try {
        await registerStudio(formData);
        alert('Registration successful!');
        // Redirect or something
      } catch (error) {
        alert('Registration failed: ' + (error as Error).message);
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
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Studio Registration</h2>
      <div className="mb-4">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          {errors.companyName && <p className="text-red-500">{errors.companyName}</p>}
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Business Details</h3>
          <input
            type="text"
            name="bin"
            placeholder="BIN"
            value={formData.bin}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          {errors.bin && <p className="text-red-500">{errors.bin}</p>}
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChange={handleChange}
            className="w-full p-2 border mb-2"
          />
          {errors.contactPerson && <p className="text-red-500">{errors.contactPerson}</p>}
        </div>
      )}
      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border mb-2"
          />
          {errors.documents && <p className="text-red-500">{errors.documents}</p>}
          <ul>
            {formData.documents.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={handleBack} className="px-4 py-2 bg-gray-500 text-white rounded">
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default StudioRegistrationForm;