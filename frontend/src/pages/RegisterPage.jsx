import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register(username, email, password);
      console.log('Registration result:', result);
      
      if (result.success) {
        setUserId(result.userId);
        setShowOTP(true);
        setError('');
      } else {
        console.error('Registration failed:', result);
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOtpLoading(true);
    
    try {
      const response = await api.post('/auth/verify-otp', { userId, otp });
      
      if (response.data.success) {
        navigate('/login', { state: { message: 'Email verified successfully! Please log in.' } });
      } else {
        setError(response.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during verification.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <SEOHead {...SEO_CONFIGS.register} />
      <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">{showOTP ? 'Verify Your Email' : 'Create an Account'}</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {showOTP ? (
        <>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 text-sm">
              We've sent a 6-digit verification code to {email}. Please enter it below.
            </p>
          </div>
          
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                id="otp"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              disabled={otpLoading || otp.length !== 6}
            >
              {otpLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            id="username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>
        
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
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Login here
          </Link>
        </p>
      </div>
      </div>
    </>
  );
};

export default RegisterPage;