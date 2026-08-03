import React, { useRef, useState } from 'react';
import { X, Upload, Download } from 'lucide-react';
import { Problem } from '../types/problem';
import toast from 'react-hot-toast';

interface BulkImportModalProps {
  onImport: (problems: Problem[]) => Promise<void>;
  onClose: () => void;
}

export default function BulkImportModal({ onImport, onClose }: BulkImportModalProps) {
  const [loading, setLoading] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonText(content);
        toast.success('File loaded successfully');
      } catch (err) {
        toast.error('Failed to read file');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    try {
      if (!jsonText.trim()) {
        toast.error('Please paste JSON or upload a file');
        return;
      }

      let problems: Problem[];
      try {
        const data = JSON.parse(jsonText);
        problems = Array.isArray(data) ? data : data.problems || [data];
      } catch (err) {
        toast.error('Invalid JSON format');
        return;
      }

      if (problems.length === 0) {
        toast.error('No problems found in the JSON');
        return;
      }

      setLoading(true);
      await onImport(problems);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: "Sample Problem",
        difficulty: "easy",
        statement: "Problem description here",
        constraints: "1 <= n <= 1000",
        inputFormat: "Input description",
        outputFormat: "Output description",
        referenceSolution: "solution code",
        topics: "arrays",
        companies: "Google, Amazon",
        tags: "arrays, easy",
        category: "arrays",
        testCases: [
          {
            input: "sample input",
            expectedOutput: "expected output",
            isHidden: false,
            explanation: "This is a sample test case"
          }
        ]
      }
    ];

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'problems-template.json';
    link.click();
    toast.success('Template downloaded');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import Problems</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to import:</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>Prepare a JSON file with problems array</li>
              <li>Download the template to see the correct format</li>
              <li>Each problem must have: title, difficulty, statement, referenceSolution</li>
              <li>Test cases are optional but recommended</li>
            </ul>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Upload JSON File or Paste JSON:
            </label>
            <div className="space-y-3">
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Upload size={20} />
                  Choose File
                </button>
              </div>

              {/* Divider */}
              <div className="text-center text-gray-500 dark:text-gray-400">OR</div>

              {/* Paste JSON */}
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='Paste your JSON here... or click "Choose File" above'
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Download size={20} />
              Download Template
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading || !jsonText.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Importing...' : 'Import Problems'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
