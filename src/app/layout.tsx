import type { Metadata } from "next";
import { Roboto, Poppins, Rubik } from "next/font/google";
import "./globals.css";
import MainProvider from "@/shared/providers";
import ConditionalLayout from "./conditional-layout";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bank Saving System",
    template: "%s | Bank Saving System",
  },
  description: "Bank Saving System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${poppins.variable} ${rubik.variable} antialiased`}
      >
        <MainProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </MainProvider>
      </body>
    </html>
  );
}
