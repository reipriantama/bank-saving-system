"use client";

import { Suspense } from "react";
import HomePage from "@/features/home/pages/home-page";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
