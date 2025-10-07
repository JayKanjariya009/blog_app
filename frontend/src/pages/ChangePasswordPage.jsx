import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [generateNew, setGenerateNew] = useState(false);
  
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!generateNew) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      
      if (currentPassword === newPassword) {
        setError('New password must be different from current password');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        generateNew
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data.message || 'Failed to change password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while changing password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Change Password</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        <label className="flex items-center">
          <input
            type="radio"
            name="changeMethod"
            checked={!generateNew}
            onChange={() => setGenerateNew(false)}
            className="mr-3"
          />
          <span className="text-gray-700">Change password manually</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="changeMethod"
            checked={generateNew}
            onChange={() => setGenerateNew(true)}
            className="mr-3"
          />
          <span className="text-gray-700">Generate new password and email it to me</span>
        </label>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!generateNew && (
          <>
            <div>
              <label htmlFor="currentPassword" className="block text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}
        
        {generateNew && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              A new random password will be generated and sent to your email address.
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          disabled={loading}
        >
          {loading ? (generateNew ? 'Generating...' : 'Changing...') : (generateNew ? 'Generate New Password' : 'Change Password')}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;