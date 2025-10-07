import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setEmailSent(true);
      } else {
        setError(response.data.message || 'Failed to generate new password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while generating new password.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="bg-green-100 p-8 rounded-lg mb-6">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Email Sent!</h1>
            <p className="text-green-700">{message}</p>
          </div>
          
          <p className="text-gray-600 mb-4">
            Please check your email and click the reset link to create a new password.
          </p>
          
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Forgot Password</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800 text-sm">
          Enter your email address and we'll generate a new password and send it to you.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate New Password'}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;