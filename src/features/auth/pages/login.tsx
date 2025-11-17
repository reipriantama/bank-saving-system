"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import Link from "next/link";
import { FormInput } from "@/shared/components/forms/form-input";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import useLogin from "../hooks/use-login";
import PATHS from "@/shared/routes";
export default function LoginPage() {
  const { onSubmit, form, loading } = useLogin();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { isDirty },
    control,
  } = form;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center flex flex-col items-center space-y-8 mb-[70px]">
        <div className="font-poppins font-bold text-6xl text-[#44444F]">
          Sign In
        </div>
        <p className="text-base text-[#92929D]">
          Just sign in if you have an account in here. Enjoy our Website
        </p>
      </div>
      <Card className="w-full max-w-md mb-5">
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="email"
                type="email"
                control={control}
                label="Email"
                placeholder="Masukkan email Anda"
                required
              />

              <FormInput
                name="password"
                type={showPassword ? "text" : "password"}
                control={control}
                label="Password"
                placeholder="Masukkan password Anda"
                required
                iconRight={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                }
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-[#696974] cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-[#50B5FF]">
                  Lupa password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading || !isDirty}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 items-center text-center text-sm">
        <p className="text-sm text-[#0062FF]">
          Don&apos;t have account?{" "}
          <Link href={PATHS.PUBLIC.REGISTER} className="font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
