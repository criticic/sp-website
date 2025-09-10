'use client';

import { useState, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { FaQrcode, FaKeyboard, FaUser, FaGraduationCap, FaHome, FaTint, FaMapMarkerAlt, FaCamera, FaStop, FaCameraRetro } from 'react-icons/fa';
import Image from 'next/image';

// You'll need to install: npm install @yudiel/react-qr-scanner

interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  course: string;
  hostelName: string;
  roomNumber: string;
  bloodGroup: string;
  photoPath: string;
}

interface ScanResult {
  id: string;
  rollNumber: string;
  name: string;
  branch: string;
  timestamp: string; // API returns ISO string, not Date object
  status: 'SUCCESS' | 'MANUAL' | 'FAILURE';
  student?: {
    id: string;
    name: string;
    rollNumber: string;
    branch: string;
    course?: string;
    hostelName?: string;
    roomNumber?: string;
    bloodGroup?: string;
    photoPath?: string;
  };
}

export default function ScannerPage() {
  const [activeMode, setActiveMode] = useState<'qr' | 'totp' | 'manual'>('qr');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  // QR Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string>('');
  const [preferredCamera, setPreferredCamera] = useState<'front' | 'back'>('back');
  
  // TOTP Manual Entry state
  const [rollNumber, setRollNumber] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  
  // Manual Entry state
  const [manualRollNumber, setManualRollNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [manualStudentProfile, setManualStudentProfile] = useState<StudentProfile | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScanSuccess = useCallback(async (result: any) => {
    try {
      setLoading(true);
      const qrData = result[0]?.rawValue || result;
      
      const response = await fetch('/api/scanner/qr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData }),
      });

      const apiResult = await response.json();
      
      if (response.ok) {
        toast.success(`Scan successful: ${apiResult.student.name}`);
        setScanResults(prev => [apiResult, ...prev]);
      } else {
        toast.error(apiResult.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      toast.error('Failed to process scan');
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScanError = useCallback((error: any) => {
    console.warn('QR Scan Error:', error);
    setScannerError(`Scanner error: ${error?.message || 'Unknown error'}`);
  }, []);

  const startScanner = () => {
    setIsScanning(true);
    setScannerError('');
  };

  const stopScanner = () => {
    setIsScanning(false);
  };

  const toggleCamera = () => {
    setPreferredCamera(prev => prev === 'back' ? 'front' : 'back');
    toast.info(`Switched to ${preferredCamera === 'back' ? 'front' : 'back'} camera`);
  };

  const handleTotpEntry = async () => {
    if (!rollNumber || !totpCode) {
      toast.error('Please fill in both roll number and TOTP code');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/scanner/totp-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber, totpCode }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(`TOTP scan successful: ${result.student.name}`);
        setScanResults(prev => [result, ...prev]);
        setRollNumber('');
        setTotpCode('');
        setStudentProfile(null);
      } else {
        toast.error(result.error || 'TOTP verification failed');
      }
    } catch {
      toast.error('Failed to verify TOTP');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfile = async () => {
    if (!rollNumber) {
      toast.error('Please enter a roll number first');
      return;
    }

    try {
      const response = await fetch(`/api/student/profile-by-roll?rollNumber=${rollNumber}`);
      if (response.ok) {
        const data = await response.json();
        setStudentProfile(data.student);
        toast.success('Student profile loaded');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Student not found');
        setStudentProfile(null);
      }
    } catch {
      toast.error('Failed to fetch student profile');
      setStudentProfile(null);
    }
  };

  const handleManualEntry = async () => {
    if (!manualRollNumber) {
      toast.error('Please enter a roll number');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/scanner/manual-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: manualRollNumber, notes }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(`Manual entry successful: ${result.student.name}`);
        setScanResults(prev => [result, ...prev]);
        setManualRollNumber('');
        setNotes('');
        setManualStudentProfile(null);
      } else {
        toast.error(result.error || 'Manual entry failed');
      }
    } catch {
      toast.error('Failed to create manual entry');
    } finally {
      setLoading(false);
    }
  };

  const fetchManualStudentProfile = async () => {
    if (!manualRollNumber) {
      toast.error('Please enter a roll number first');
      return;
    }

    try {
      const response = await fetch(`/api/student/profile-by-roll?rollNumber=${manualRollNumber}`);
      if (response.ok) {
        const data = await response.json();
        setManualStudentProfile(data.student);
        toast.success('Student profile loaded');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Student not found');
        setManualStudentProfile(null);
      }
    } catch {
      toast.error('Failed to fetch student profile');
      setManualStudentProfile(null);
    }
  };

  const StudentProfileCard = ({ student }: { student: StudentProfile }) => (
    <div className="bg-gray-50 border rounded-lg p-4 mt-4">
      <h3 className="font-semibold text-gray-800 mb-3">Student Profile</h3>
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {student.photoPath ? (
            <Image
              src={`/api/student/photo/${student.id}`}
              alt={student.name || 'Student'}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-400 text-xl" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{student.name}</h4>
          <p className="text-blue-600 font-medium">{student.rollNumber}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <FaGraduationCap className="text-blue-500" />
              <span>{student.course}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaUser className="text-green-500" />
              <span className="text-xs">{student.branch}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaHome className="text-purple-500" />
              <span>{student.hostelName}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-orange-500" />
              <span>{student.roomNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaTint className="text-red-500" />
              <span>{student.bloodGroup}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Scanner Dashboard</h1>
        
        {/* Mode Selection */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveMode('qr')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                activeMode === 'qr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <FaQrcode className="mr-2" />
              QR Scanner
            </button>
            <button
              onClick={() => setActiveMode('totp')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                activeMode === 'totp'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <FaKeyboard className="mr-2" />
              TOTP Entry
            </button>
            <button
              onClick={() => setActiveMode('manual')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                activeMode === 'manual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <FaUser className="mr-2" />
              Manual Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner/Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeMode === 'qr' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
                
                {/* Scanner Error Display */}
                {scannerError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-800 font-medium">Scanner Error</p>
                        <p className="text-red-600 text-sm">{scannerError}</p>
                      </div>
                      <button
                        onClick={() => setScannerError('')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {!isScanning ? (
                    <button
                      onClick={startScanner}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <FaCamera className="mr-2" />
                      Start Scanner
                    </button>
                  ) : (
                    <button
                      onClick={stopScanner}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaStop className="mr-2" />
                      Stop Scanner
                    </button>
                  )}
                  
                  <button
                    onClick={toggleCamera}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    title={`Switch to ${preferredCamera === 'back' ? 'front' : 'back'} camera`}
                  >
                    <FaCameraRetro className="mr-2" />
                    {preferredCamera === 'back' ? 'Back' : 'Front'} Camera
                  </button>
                </div>
                
                {/* Scanner Component */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  {isScanning ? (
                    <Scanner
                      onScan={onScanSuccess}
                      onError={onScanError}
                      constraints={{
                        facingMode: preferredCamera === 'back' ? 'environment' : 'user',
                        aspectRatio: { ideal: 1 }
                      }}
                      formats={[
                        'qr_code',
                        'micro_qr_code',
                        'rm_qr_code',
                        'maxi_code',
                        'pdf417',
                        'aztec',
                        'data_matrix',
                        'matrix_codes',
                        'dx_film_edge',
                        'databar',
                        'databar_expanded',
                        'codabar',
                        'code_39',
                        'code_93',
                        'code_128',
                        'ean_8',
                        'ean_13',
                        'itf',
                        'linear_codes',
                        'upc_a',
                        'upc_e'
                      ]}
                      classNames={{
                        container: 'w-full max-w-md mx-auto',
                        video: 'w-full h-auto rounded-lg'
                      }}
                      scanDelay={500}
                      allowMultiple={false}
                    />
                  ) : (
                    <div className="w-full max-w-md mx-auto h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                      <div className="text-center text-white">
                        <FaQrcode className="mx-auto text-4xl mb-2 opacity-50" />
                        <p className="opacity-75">Scanner stopped</p>
                        <p className="text-sm opacity-50 mt-1">Click &quot;Start Scanner&quot; to begin</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scanner Status */}
                {isScanning && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-green-600">✓ Scanner Active</p>
                      <p>Point your camera at a QR code to scan</p>
                      <p>Make sure the QR code is well-lit and clearly visible</p>
                      <p className="text-xs mt-2 text-gray-500">
                        Using {preferredCamera} camera • Supports multiple formats
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading Indicator */}
                {loading && (
                  <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Processing scan...</p>
                  </div>
                )}
              </div>
            )}

            {activeMode === 'totp' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">TOTP Manual Entry</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter roll number"
                      />
                      <button
                        onClick={fetchStudentProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Load Profile
                      </button>
                    </div>
                  </div>

                  {studentProfile && <StudentProfileCard student={studentProfile} />}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TOTP Code (from student)
                    </label>
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter 6-digit TOTP code from student"
                      maxLength={6}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Ask the student to show you their TOTP code
                    </p>
                  </div>

                  <button
                    onClick={handleTotpEntry}
                    disabled={loading || !rollNumber || !totpCode}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify TOTP'}
                  </button>
                </div>
              </div>
            )}

            {activeMode === 'manual' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Manual Entry</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={manualRollNumber}
                        onChange={(e) => setManualRollNumber(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter roll number"
                      />
                      <button
                        onClick={fetchManualStudentProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Load Profile
                      </button>
                    </div>
                  </div>

                  {manualStudentProfile && <StudentProfileCard student={manualStudentProfile} />}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Add any additional notes"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleManualEntry}
                    disabled={loading || !manualRollNumber}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Add Manual Entry'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Scans Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Scans</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No scans yet</p>
              ) : (
                scanResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      result.status === 'SUCCESS'
                        ? 'bg-green-50 border-green-500'
                        : result.status === 'MANUAL'
                        ? 'bg-purple-50 border-purple-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{result.name}</h3>
                        <p className="text-sm text-gray-600">
                          {result.rollNumber} • {result.branch}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            result.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-800'
                              : result.status === 'MANUAL'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}