import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Download, RotateCcw, Settings } from 'lucide-react';
import { CodeTemplate } from '../types';
import { qubicRPC } from '../utils/qubicRpcSimulator';
import { useTheme } from '../contexts/ThemeContext';

interface CodeEditorProps {
  initialCode?: string;
  template?: CodeTemplate;
  onCodeChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '', 
  template, 
  onCodeChange 
}) => {
  const [code, setCode] = useState(initialCode || template?.code || '');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (template) {
      setCode(template.code);
    }
  }, [template]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
    
    // Auto-save to localStorage
    localStorage.setItem('editor_code', newCode);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployResult('');
    
    try {
      const result = await qubicRPC.deployContract(code, []);
      setDeployResult(`✅ Contract deployed! TX: ${result.txId}`);
      
      // Simulate contract interaction
      setTimeout(async () => {
        await qubicRPC.sendTransaction(code, 'initialize', []);
        setDeployResult(prev => prev + '\n🎉 Contract initialized successfully!');
      }, 2000);
      
    } catch (error) {
      setDeployResult(`❌ Deployment failed: ${error}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template?.name || 'contract'}.cpp`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    const resetCode = template?.code || '';
    setCode(resetCode);
    setDeployResult('');
    localStorage.removeItem('editor_code');
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
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {template?.name || 'Smart Contract Editor'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleReset}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleSave}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-4 h-4" />
              <span>{isDeploying ? 'Deploying...' : 'Deploy to Qubic'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Editor
          height="500px"
          language="cpp"
          value={code}
          onChange={handleCodeChange}
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          options={editorOptions}
        />
      </div>

      {deployResult && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {deployResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;