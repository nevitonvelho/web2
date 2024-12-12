'use client';
import type { Metadata } from "next";

import '@/app/globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="en">
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
