import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate('/register');
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
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
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/resend-otp', { userId });
      
      if (response.data.success) {
        setTimer(60);
        setCanResend(false);
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while resending OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Verify Your Email</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800 text-sm">
          We've sent a 6-digit verification code to your email address. Please enter it below to verify your account.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-2">Didn't receive the code?</p>
        {canResend ? (
          <button
            onClick={handleResendOTP}
            className="text-blue-600 hover:text-blue-800 font-medium"
            disabled={resendLoading}
          >
            {resendLoading ? 'Resending...' : 'Resend Code'}
          </button>
        ) : (
          <p className="text-gray-500">Resend in {timer}s</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPPage;