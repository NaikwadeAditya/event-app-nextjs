import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event You Mustn't miss",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className=" flex flex-col min-h-screen">

        <Navbar />
        
        {/*  */}
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
              <LightRays
                  raysOrigin="top-center-offset"
                  raysColor="#5dfeca"
                  raysSpeed={0.5}
                  lightSpread={0.9}
                  rayLength={1.4}
                  followMouse={true}
                  mouseInfluence={0.02}
                  noiseAmount={0.0}
                  distortion={0.01}
              />
          </div>

          <main>
            {children}
          </main>
      </body>
    </html>
  );
}
