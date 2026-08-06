import { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Toaster } from 'react-hot-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fafafa] dark:bg-gray-950 text-gray-900 dark:text-white font-sans selection:bg-primary-500/30">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main App Shell */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Sticky Top Navbar inside the shell */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent bg-gray-50/50 dark:bg-gray-950/50">
          <div className="w-full max-w-7xl  py-8 h-full min-h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white !shadow-xl !rounded-2xl !border !border-gray-100 dark:!border-gray-800 !text-sm !font-medium',
          duration: 4000,
        }}
      />
    </div>
  );
}
