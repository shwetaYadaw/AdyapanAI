import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Toaster } from 'react-hot-toast';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-gray-950 font-sans overflow-hidden">
      {/* Fixed Top Navbar */}
      <Navbar />

      {/* Scrollable Content */}
      <main className="flex-1 overflow-auto bg-white dark:bg-gray-950 w-full">
        {children}
      </main>

      <Toaster position="top-center" />
    </div>
  );
}
