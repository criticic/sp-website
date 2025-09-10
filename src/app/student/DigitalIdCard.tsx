'use client';
import { profile, user } from "@/db/schema";
import { FaUser, FaGraduationCap, FaHome, FaTint, FaMapMarkerAlt, FaClock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import Image from "next/image";

type Student = typeof profile.$inferSelect & typeof user.$inferSelect;

interface DigitalIdCardProps {
  student: Student;
}

export default function DigitalIdCard({ student }: DigitalIdCardProps) {
  const [totp, setTotp] = useState<string>('');
  const [showTotp, setShowTotp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/qr-token');
        if (response.ok) {
          const data = await response.json();
          setTotp(data.totp);
          setQrData(data.token);
        } else {
          toast.error('Could not load QR Code and TOTP. Please try refreshing.');
        }
      } catch (error) {
        console.error('Failed to fetch QR token and TOTP:', error);
        toast.error('Could not load QR Code and TOTP. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = 30 - (now % 30);
      setTimeLeft(timeLeft);
      
      // Refresh data when timer resets
      if (timeLeft === 30) {
        fetchData();
      }
    };

    // Initial fetch
    fetchData();
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Digital ID</h1>
        <p className="text-blue-600 font-semibold">IIT (BHU) Varanasi</p>
      </div>

      {/* Student Photo */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {student.photoPath ? (
            <Image
              src={student.photoPath}
              alt={student.name || 'Student'}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-400 text-3xl" />
          )}
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-3 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
          <p className="text-blue-600 font-semibold">{student.rollNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-blue-500" />
            <div>
              <p className="text-gray-500">Course</p>
              <p className="font-semibold">{student.course}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-green-500" />
            <div>
              <p className="text-gray-500">Branch</p>
              <p className="font-semibold text-xs">{student.branch}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaHome className="text-purple-500" />
            <div>
              <p className="text-gray-500">Hostel</p>
              <p className="font-semibold">{student.hostelName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-orange-500" />
            <div>
              <p className="text-gray-500">Room</p>
              <p className="font-semibold">{student.roomNumber}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <FaTint className="text-red-500" />
            <div>
              <p className="text-gray-500">Blood Group</p>
              <p className="font-semibold">{student.bloodGroup}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="relative flex flex-col items-center justify-center w-48 h-48 bg-white rounded-lg shadow-inner">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-2 text-gray-500">Loading QR...</p>
            </div>
          ) : qrData ? (
            <>
              <QRCodeSVG value={qrData} size={160} />
            </>
          ) : (
            <p className="text-red-500 text-sm text-center">Failed to load QR Code.</p>
          )}
        </div>
      </div>

      {/* TOTP Display */}
      {loading ? (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-blue-700 mt-2">Generating TOTP...</p>
        </div>
      ) : (
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
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        QR Code refreshes every 30 seconds for security
      </p>
    </div>
  );
}
