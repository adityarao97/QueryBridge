import React, { useState } from 'react';
import { User, Lock, Mail, Building } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (userData: { name: string; email: string; password: string; companyName: string; description: string; searchDescription: string; apiStructure: string }) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [apiStructure, setApiStructure] = useState('{ "query": "string" }');
  
  const [step, setStep] = useState(1);
  const [passwordError, setPasswordError] = useState('');

  const handleNext = () => {
    if (!name || !email || !password || !passwordConfirm) {
      return;
    }
    
    if (password !== passwordConfirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !description || !searchDescription || !apiStructure) {
      return;
    }
    
    await onRegister({
      name,
      email,
      password,
      companyName,
      description,
      searchDescription,
      apiStructure
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Registration</h2>
        <p className="text-gray-600 mt-1">Create an account to manage your company search</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between">
          <div className={`flex-1 border-t-4 ${step >= 1 ? 'border-blue-500' : 'border-gray-200'} pt-1`}>
            <p className={`text-xs ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Account Details</p>
          </div>
          <div className="w-6"></div>
          <div className={`flex-1 border-t-4 ${step >= 2 ? 'border-blue-500' : 'border-gray-200'} pt-1`}>
            <p className={`text-xs ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Company Information</p>
          </div>
        </div>
      </div>

      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password-confirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  className={`pl-10 block w-full border rounded-md shadow-sm py-2 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    passwordError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={!name || !email || !password || !passwordConfirm}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !name || !email || !password || !passwordConfirm
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of your company"
              ></textarea>
            </div>

            <div>
              <label htmlFor="search-description" className="block text-sm font-medium text-gray-700 mb-1">
                Search Description
              </label>
              <textarea
                id="search-description"
                value={searchDescription}
                onChange={(e) => setSearchDescription(e.target.value)}
                required
                rows={2}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="How users should search your content"
              ></textarea>
            </div>

            <div>
              <label htmlFor="api-structure" className="block text-sm font-medium text-gray-700 mb-1">
                API Structure (JSON)
              </label>
              <textarea
                id="api-structure"
                value={apiStructure}
                onChange={(e) => setApiStructure(e.target.value)}
                required
                rows={3}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder='{ "query": "string" }'
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Define the structure of your search API in JSON format.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || !companyName || !description || !searchDescription || !apiStructure}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || !companyName || !description || !searchDescription || !apiStructure
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/admin/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;