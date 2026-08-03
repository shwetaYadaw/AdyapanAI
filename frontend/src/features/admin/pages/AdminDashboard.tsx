import React, { useState } from 'react';
import { BookOpen, Code2, Brain } from 'lucide-react';
import CodingArenaDashboard from './CodingArenaDashboard';
import TcsNqtDashboard from './TcsNqtDashboard';
import AptitudeDashboard from './AptitudeDashboard';

type DashboardType = 'coding-arena' | 'tcs-nqt' | 'aptitude' | null;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardType>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage coding problems and placement preparation questions</p>
        </div>
      </div>

      {/* Tab Selection */}
      {!activeTab && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coding Arena Card */}
            <div
              onClick={() => setActiveTab('coding-arena')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                  <Code2 size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                Coding Arena
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Manage coding interview problems for top MNC companies
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✅ Create DSA problems</li>
                  <li>✅ Manage test cases</li>
                  <li>✅ Track solutions</li>
                  <li>✅ Version history</li>
                  <li>✅ Analytics & insights</li>
                </ul>
              </div>
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                Manage Coding Arena
              </button>
            </div>

            {/* TCS NQT Card */}
            <div
              onClick={() => setActiveTab('tcs-nqt')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg">
                  <BookOpen size={40} className="text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                TCS NQT
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Manage TCS placement preparation questions
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✅ TCS Coding problems</li>
                  <li>✅ Quantitative aptitude</li>
                  <li>✅ Verbal reasoning</li>
                  <li>✅ Technical questions</li>
                  <li>✅ Performance tracking</li>
                </ul>
              </div>
              <button className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition">
                Manage TCS NQT
              </button>
            </div>

            {/* Aptitude Card */}
            <div
              onClick={() => setActiveTab('aptitude')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                  <Brain size={40} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                Aptitude
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Manage general aptitude questions for all companies
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✅ Quantitative aptitude</li>
                  <li>✅ Verbal reasoning</li>
                  <li>✅ Logical reasoning</li>
                  <li>✅ Multiple companies</li>
                  <li>✅ Performance tracking</li>
                </ul>
              </div>
              <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
                Manage Aptitude
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
