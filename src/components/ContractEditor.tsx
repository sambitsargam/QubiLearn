import React from 'react';
import { RotateCcw, Download, Copy, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';

interface ContractEditorProps {
  code: string;
  onChange: (code: string) => void;
  onReset: () => void;
  contractName: string;
}

const ContractEditor: React.FC<ContractEditorProps> = ({ 
  code, 
  onChange, 
  onReset, 
  contractName 
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName || 'contract'}.cpp`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on' as const,
    folding: true,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all' as const,
    readOnly: false,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {contractName || 'Generated Contract'}.cpp
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onReset}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Reset to Generated"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download .cpp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <Editor
          height="500px"
          language="cpp"
          value={code}
          onChange={(value) => onChange(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          options={editorOptions}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>C++ • Qubic Smart Contract</span>
          <span>{code.split('\n').length} lines • {code.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default ContractEditor;