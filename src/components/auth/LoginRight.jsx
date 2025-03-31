import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginRight() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    if (!/^\d*$/.test(value)) return; // Only allow digits

    setCode(prevCode => {
      const newCode = [...prevCode];
      newCode[index] = value;
      return newCode;
    });

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        setCode(prevCode => {
          const newCode = [...prevCode];
          newCode[index - 1] = '';
          return newCode;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (fullCode !== '123456') {
      setError('Cod inexistent');
      setCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('code-0');
      if (firstInput) firstInput.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn({ code: fullCode });
      navigate('/identify');
    } catch (error) {
      setError('An unexpected error occurred');
      setCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('code-0');
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-[60%] bg-white p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif mb-2 text-gray-900">
            Introduceți codul
          </h2>
          <p className="text-base text-gray-500">
            Vă rugăm să introduceți codul de 6 cifre pentru a continua
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-medium border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-deep-purple focus:border-deep-purple
                  transition-colors"
                autoComplete="off"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-deep-purple text-white rounded-lg px-4 py-3 
              hover:bg-deep-purple-600 transition-all
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Se verifică...' : 'Continuă'}
          </button>
        </form>
      </div>
    </div>
  );
} 