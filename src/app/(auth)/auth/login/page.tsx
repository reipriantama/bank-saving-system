import LoginPage from '@/features/auth/pages/login';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return (
    <LoginPage />
  );
};

export default Login;
