import React, { useRef, useState } from 'react';
import { X, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface TcsBulkImportModalProps {
  onImport: (questions: any[]) => Promise<void>;
  onClose: () => void;
}

export default function TcsBulkImportModal({ onImport, onClose }: TcsBulkImportModalProps) {
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

      let questions: any[];
      try {
        const data = JSON.parse(jsonText);
        questions = Array.isArray(data) ? data : data.questions || [data];
      } catch (err) {
        toast.error('Invalid JSON format');
        return;
      }

      if (questions.length === 0) {
        toast.error('No questions found in the JSON');
        return;
      }

      setLoading(true);
      await onImport(questions);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import TCS NQT Questions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Importing...' : 'Import Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
