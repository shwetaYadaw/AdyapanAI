import React, { useState } from 'react';
import { BookOpen, Code2, Brain, ArrowLeft } from 'lucide-react';
import CodingArenaDashboard from '../../features/admin/pages/CodingArenaDashboard';
import TcsNqtDashboard from '../../features/admin/pages/TcsNqtDashboard';
import AptitudeDashboard from '../../features/admin/pages/AptitudeDashboard';

type DashboardType = 'coding-arena' | 'tcs-nqt' | 'aptitude' | null;

export default function AdminProblemsPage() {
  const [activeTab, setActiveTab] = useState<DashboardType>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Header with unique gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Code2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold mb-2">Problems Management</h1>
              <p className="text-purple-100 text-lg">Add and manage questions directly to the database</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Selection Cards with unique styling */}
      {!activeTab && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Coding Arena Card - Cyan/Teal Theme */}
            <div
              onClick={() => setActiveTab('coding-arena')}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-cyan-400"
            >
              {/* Accent border on top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-t-2xl"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-cyan-400 to-teal-500 p-5 rounded-2xl">
                    <Code2 size={48} className="text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Coding Arena
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm leading-relaxed">
                Add DSA coding problems for top MNC companies
              </p>
              
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 p-5 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Create DSA problems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Add test cases
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Set difficulty levels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Manage topics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Company tags
                  </li>
                </ul>
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Add Coding Problems →
              </button>
            </div>

            {/* TCS NQT Card - Amber/Orange Theme */}
            <div
              onClick={() => setActiveTab('tcs-nqt')}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-amber-400"
            >
              {/* Accent border on top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-2xl"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-5 rounded-2xl">
                    <BookOpen size={48} className="text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Placement Prep
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm leading-relaxed">
                Add placement preparation coding questions for top MNC companies
              </p>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-5 rounded-xl border border-amber-200 dark:border-amber-800">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Placement coding questions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Input/Output format
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Sample test cases
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Topic categorization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Difficulty rating
                  </li>
                </ul>
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Add Placement Prep Questions →
              </button>
            </div>

            {/* Aptitude Card - Emerald/Green Theme */}
            <div
              onClick={() => setActiveTab('aptitude')}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-emerald-400"
            >
              {/* Accent border on top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-2xl"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 p-5 rounded-2xl">
                    <Brain size={48} className="text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Aptitude
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm leading-relaxed">
                Add general aptitude questions for all companies
              </p>
              
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Quantitative aptitude
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Verbal reasoning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Logical reasoning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Multiple choice format
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Detailed explanations
                  </li>
                </ul>
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Add Aptitude Questions →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Views */}
      {activeTab === 'coding-arena' && (
        <CodingArenaDashboard onBack={() => setActiveTab(null)} />
      )}

      {activeTab === 'tcs-nqt' && (
        <TcsNqtDashboard onBack={() => setActiveTab(null)} />
      )}

      {activeTab === 'aptitude' && (
        <AptitudeDashboard onBack={() => setActiveTab(null)} />
      )}
    </div>
  );
}
