import React, { useState } from 'react';
import JobFunctionSelection from './identification/RoleSelection';
import CompanyIdentification from './identification/CompanyIdentification';
import NameIdentification from './identification/NameIdentification';
import DataProcessing from './identification/DataProcessing';
import { supabase } from '../lib/supabase';

// Function options for the role selection
const FUNCTION_OPTIONS = [
  { id: 'ceo', title: 'CEO' },
  { id: 'manager', title: 'Manager' },
  { id: 'team_lead', title: 'Team Lead' },
  { id: 'developer', title: 'Developer' },
  { id: 'designer', title: 'Designer' },
  { id: 'other', title: 'Other' }
];

// Generic email domains to check against
const GENERIC_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com'
];

// Generic company names to check against
const GENERIC_COMPANY_NAMES = [
  'company',
  'business',
  'enterprise',
  'corporation',
  'inc',
  'llc',
  'ltd',
  'limited'
];

export default function UserIdentification({ onComplete, sessionData }) {
  // Form states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    business_email: '',
    job_function: '',
    gdprConsent: false,
    marketingConsent: false
  });

  // Validation states
  const [errors, setErrors] = useState({
    full_name: '',
    company_name: '',
    business_email: '',
    submitError: ''
  });

  const [loading, setLoading] = useState(false);

  const validateName = (field, value) => {
    if (!value.trim()) {
      return `${field} is required`;
    }
    if (value.trim().length < 2) {
      return `${field} must be at least 2 characters long`;
    }
    if (!/^[a-zA-Z\s-']+$/.test(value)) {
      return `${field} can only contain letters, spaces, hyphens, and apostrophes`;
    }
    return '';
  };

  const validateCompanyName = (value) => {
    if (!value.trim()) {
      return 'Company name is required';
    }
    if (value.trim().length < 2) {
      return 'Company name must be at least 2 characters long';
    }
    const lowerValue = value.toLowerCase();
    if (GENERIC_COMPANY_NAMES.some(generic => lowerValue.includes(generic))) {
      return 'Please provide your specific company name';
    }
    return '';
  };

  const validateCompanyEmail = (value) => {
    if (!value.trim()) {
      return 'Company email is required';
    }
    
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }

    // Parse email parts
    const emailParts = value.split('@');
    const localPart = emailParts[0];
    const domain = emailParts[1].toLowerCase();

    // Validate email parts
    if (localPart.length < 2 || domain.length < 4 || !domain.includes('.')) {
      return 'Please enter a valid email address';
    }

    // Check for generic email domains
    if (GENERIC_EMAIL_DOMAINS.includes(domain)) {
      const messages = [
        "Would you mind using your company email? It helps us better tailor our services to your organization ✨",
        "We noticed you're using a personal email - your company email would help us serve you better 💫",
        "Your company email would be perfect here - it helps us understand your business needs better ✉️",
        "A small suggestion: using your company email allows us to provide a more personalized experience 💡"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        const fullNameError = validateName('full_name', formData.full_name);
        setErrors(prev => ({
          ...prev,
          full_name: fullNameError
        }));
        return !fullNameError;

      case 2:
        const companyNameError = validateCompanyName(formData.company_name);
        const companyEmailError = validateCompanyEmail(formData.business_email);
        setErrors(prev => ({
          ...prev,
          company_name: companyNameError,
          business_email: companyEmailError
        }));
        return !companyNameError && !companyEmailError;

      case 3:
        return formData.job_function !== '';

      case 4:
        return true;

      default:
        return true;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    if (validateStep() && step < 4) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(prev => ({ ...prev, submitError: '' }));

    // Validate email again before submission
    const emailError = validateCompanyEmail(formData.business_email);
    if (emailError && !GENERIC_EMAIL_DOMAINS.includes(formData.business_email.split('@')[1].toLowerCase())) {
      setErrors(prev => ({
        ...prev,
        submitError: emailError
      }));
      setLoading(false);
      return;
    }

    if (formData.gdprConsent) {
      try {
        console.log('Starting submission process...', { sessionData });

        // Prepare the survey answers JSONB structure with safety checks
        const surveyData = {
          surveys: {
            [sessionData?.scorecardId || 'unknown']: {
              completed_at: new Date().toISOString(),
              answers: sessionData?.answers ? 
                Object.entries(sessionData.answers).reduce((acc, [questionId, answer]) => {
                  acc[questionId] = {
                    value: answer,
                    score: sessionData?.results?.scores?.[questionId] || null
                  };
                  return acc;
                }, {}) : {},
              overall_results: {
                total_score: sessionData?.results?.totalScore || null,
                interpretation: sessionData?.results?.interpretation || null,
                recommendations: sessionData?.results?.recommendations || []
              }
            }
          }
        };

        console.log('Saving user data with survey answers:', surveyData);

        // Create user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            full_name: formData.full_name,
            company_name: formData.company_name,
            business_email: formData.business_email,
            job_function: formData.job_function,
            registration_date: new Date().toISOString(),
            survey_answers: surveyData
          })
          .select()
          .single();

        if (userError) {
          throw new Error(userError.message);
        }

        // Add notification to localStorage
        try {
          const savedNotifications = localStorage.getItem('notifications') || '[]';
          const notifications = JSON.parse(savedNotifications);
          
          const newNotification = {
            id: Date.now(),
            type: 'new_user',
            title: 'New User Registration',
            message: `${formData.full_name} from ${formData.company_name} has completed the survey`,
            read: false,
            created_at: new Date().toISOString()
          };

          const updatedNotifications = [newNotification, ...notifications].slice(0, 5);
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        } catch (err) {
          console.error('Error saving notification:', err);
        }
        
        // Save to localStorage as backup
        try {
          localStorage.setItem('user_name', formData.full_name);
          localStorage.setItem('company_name', formData.company_name);
          localStorage.setItem('company_email', formData.business_email);
          localStorage.setItem('function', formData.job_function);
          localStorage.setItem('marketing_consent', formData.marketingConsent ? 'true' : 'false');
          
          if (formData.job_function === 'other' && formData.job_function) {
            localStorage.setItem('custom_function', formData.job_function);
          }
          console.log('Backup data saved to localStorage');
        } catch (storageError) {
          console.warn('Failed to save backup to localStorage:', storageError);
        }
        
        // Call the completion handler with the form data
        console.log('Calling completion handler...');
        onComplete(formData);
        console.log('Submission process completed successfully');
      } catch (error) {
        console.error('Error saving user data:', error);
        setErrors(prev => ({
          ...prev,
          submitError: error.message || 'An unexpected error occurred. Please try again.'
        }));
      } finally {
        setLoading(false);
      }
    } else {
      console.warn('Submission attempted without GDPR consent');
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    const progress = (step / 4) * 100;
    return (
      <div className="px-5 pt-4">
        <div className="relative">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-deep-purple transition-all duration-500"
            />
          </div>
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${step >= stepNumber ? 'bg-deep-purple text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-5">
            <NameIdentification
              fullName={formData.full_name}
              onFullNameChange={(value) => handleInputChange('full_name', value)}
              onConfirm={handleNext}
              error={errors.full_name}
            />
          </div>
        );

      case 2:
        return (
          <div className="p-5">
            <CompanyIdentification
              companyName={formData.company_name}
              companyEmail={formData.business_email}
              onCompanyNameChange={(value) => handleInputChange('company_name', value)}
              onCompanyEmailChange={(value) => handleInputChange('business_email', value)}
              onBack={handleBack}
              onConfirm={handleNext}
              errors={errors}
            />
          </div>
        );

      case 3:
        return (
          <div className="p-5">
            <JobFunctionSelection
              role={formData.job_function}
              onSelect={(role, customValue) => {
                if (role === 'other') {
                  handleInputChange('job_function', customValue);
                } else {
                  handleInputChange('job_function', role);
                }
              }}
              onBack={handleBack}
              onConfirm={handleNext}
            />
          </div>
        );

      case 4:
        return (
          <DataProcessing
            gdprConsent={formData.gdprConsent}
            marketingConsent={formData.marketingConsent}
            onGdprConsentChange={(value) => handleInputChange('gdprConsent', value)}
            onMarketingConsentChange={(value) => handleInputChange('marketingConsent', value)}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-100">
      {renderProgressBar()}
      {renderStep()}
    </div>
  );
} 
