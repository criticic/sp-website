'use client';
import { useState, useEffect } from 'react';
import { FaClock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function TOTPDisplay() {
  const [totp, setTotp] = useState<string>('');
  const [showTotp, setShowTotp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotp = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/qr-token');
        if (response.ok) {
          const data = await response.json();
          setTotp(data.totp);
        }
      } catch (error) {
        console.error('Failed to fetch TOTP:', error);
      } finally {
        setLoading(false);
      }
    };

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = 30 - (now % 30);
      setTimeLeft(timeLeft);
      
      // Refresh TOTP when timer resets
      if (timeLeft === 30) {
        fetchTotp();
      }
    };

    // Initial fetch
    fetchTotp();
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-blue-700 mt-2">Generating TOTP...</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-blue-800">TOTP Code</h3>
        <div className="flex items-center space-x-2">
          <FaClock className="text-blue-600" />
          <span className="text-sm font-mono text-blue-700">{timeLeft}s</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-2xl text-blue-900">
            {showTotp ? totp : '••••••'}
          </span>
          <button
            onClick={() => setShowTotp(!showTotp)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showTotp ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="w-16 bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>
      
      <p className="text-xs text-blue-700 mt-2">
        Show this code to security for verification
      </p>
    </div>
  );
}
