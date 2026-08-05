import React, { useRef } from 'react';
import {
  Bold, Italic, Underline, Type, List, Code, Image as ImageIcon, Grid3X3 as TableIcon
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertList = (type: 'ul' | 'ol') => {
    document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
    editorRef.current?.focus();
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter code:');
    if (code) {
      const html = `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      document.execCommand('insertHTML', false, html);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      document.execCommand('insertImage', false, url);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-300 dark:border-gray-600 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Bold"
        >
          <Bold size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Italic"
        >
          <Italic size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Underline"
        >
          <Underline size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600" />

        <button
          type="button"
          onClick={() => insertList('ul')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Bullet List"
        >
          <List size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => insertList('ol')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Numbered List"
        >
          <Type size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600" />

        <button
          type="button"
          onClick={insertCodeBlock}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Code Block"
        >
          <Code size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
          title="Insert Image"
        >
          <ImageIcon size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[200px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none prose dark:prose-invert max-w-none"
        data-placeholder={placeholder}
        style={{
          fontSize: '16px',
          lineHeight: '1.5',
        }}
      />
    </div>
  );
}
