"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { FormInput } from "@/shared/components/forms/form-input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import PATHS from "@/shared/routes";
import useRegister from "../hooks/use-register";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const COUNTRY_PHONE_PREFIX: Record<string, string> = {
  id: "+62",
  us: "+1",
  sg: "+65",
};

export default function RegisterPage() {
  const { onSubmit, form, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState("+62");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (country && COUNTRY_PHONE_PREFIX[country]) {
      setPhonePrefix(COUNTRY_PHONE_PREFIX[country]);
    }
  }, [country]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    value = value.replace(/^0+/, "");

    setPhoneNumber(value);
  };

  const handlePhoneNumberPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const numbersOnly = pastedText.replace(/\D/g, "").replace(/^0+/, "");
    setPhoneNumber(numbersOnly);
  };

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = form;

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center flex flex-col items-center space-y-4 mb-[40px]">
          <h1 className="font-poppins font-bold text-6xl text-[#44444F]">
            Register
          </h1>
          <p className="text-base text-[#92929D]">
            Let&apos;s Sign up first for enter into Square Website. Uh She Up!
          </p>
        </div>

        <Card className="w-full shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm text-muted-foreground"
                  >
                    First Name
                  </Label>
                  <FormInput
                    name="name"
                    placeholder="First Name"
                    control={control}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm text-muted-foreground"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Phone Number & Country Row */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-1 space-y-2">
                  <Input
                    id="phonePrefix"
                    value={phonePrefix}
                    readOnly
                    disabled
                    className="w-full bg-transparent"
                  />
                </div>
                <div className="col-span-5 space-y-2">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    onPaste={handlePhoneNumberPaste}
                    className="w-full"
                  />
                </div>
                <div className="col-span-6 space-y-2">
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="Your Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Indonesia</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Email Row */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm text-muted-foreground"
                >
                  Mail Address
                </Label>
                <FormInput
                  name="email"
                  type="email"
                  placeholder="Mail Address"
                  control={control}
                  required
                />
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm text-muted-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <FormInput
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      control={control}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm_password"
                    className="text-sm text-muted-foreground"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <FormInput
                      name="confirm_password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      control={control}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm text-muted-foreground"
                >
                  Tell us about yourself
                </Label>
                <Textarea
                  id="description"
                  placeholder="Hello my name..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Link href={PATHS.PUBLIC.LOGIN} className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-gray-100 hover:bg-gray-200"
                  >
                    Login
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading || !isDirty}
                >
                  {loading ? "Memproses..." : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
