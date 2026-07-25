import { ReactNode, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Toaster } from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleSidebar } from '../../../features/ui/uiSlice';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden px-2 xs:px-3 sm:px-4 py-2 xs:py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 xs:gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 xs:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        <span className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white">Menu</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Main Content Area - responsive padding for all screen sizes */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50 dark:bg-gray-950">
          <div className="w-full h-full">
            <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-3 xs:py-4 sm:py-5 md:py-6 lg:py-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-white !shadow-card !rounded-xl !border !border-gray-100 dark:!border-gray-800',
          duration: 4000,
        }}
      />
    </div>
  );
}
