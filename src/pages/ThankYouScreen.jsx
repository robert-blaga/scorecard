import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ThankYouScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any remaining survey data
    localStorage.removeItem('survey_answers');
    localStorage.removeItem('survey_current_question');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-deep-purple/10 p-3">
            <CheckCircle className="h-12 w-12 text-deep-purple" />
          </div>
        </div>
        
        <h2 className="mt-6 text-3xl font-serif text-gray-900">
          Mulțumim pentru completarea chestionarului!
        </h2>
        
        <p className="text-sm text-gray-600">
          Răspunsurile tale au fost înregistrate cu succes. Poți închide această pagină în siguranță.
        </p>
      </div>
    </div>
  );
} 