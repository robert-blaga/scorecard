import React from 'react';
import LoginLeft from '../components/auth/LoginLeft';
import LoginRight from '../components/auth/LoginRight';

export default function LoginScreen() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <LoginLeft />
      <LoginRight />
    </div>
  );
} 