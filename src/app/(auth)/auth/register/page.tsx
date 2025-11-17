import React from "react";
import RegisterPage from "@/features/auth/pages/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

const Register = () => {
  return <RegisterPage />;
};

export default Register;
