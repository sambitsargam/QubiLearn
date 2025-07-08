import React, { useState, useEffect } from 'react';
import { Play, Save, Download, RotateCcw, Settings, FileText, Folder } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodeTemplate } from '../types';
import { qubicRPC } from '../utils/qubicRpcSimulator';
import { useTheme } from '../contexts/ThemeContext';
import templatesData from '../data/templates.json';

const CodeLab: React.FC = () => {
  const [code, setCode] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem('codelab_code');
    if (savedCode) {
      setCode(savedCode);
    } else if (templatesData.length > 0) {
      setSelectedTemplate(templatesData[0] as CodeTemplate);
      setCode(templatesData[0].code);
    }
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    localStorage.setItem('codelab_code', newCode);
  };

  const handleTemplateSelect = (template: CodeTemplate) => {
    setSelectedTemplate(template);
    setCode(template.code);
    setShowTemplates(false);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployResult('');
    
    try {
      const result = await qubicRPC.deployContract(code, []);
      setDeployResult(`✅ Contract deployed successfully!\nTransaction ID: ${result.txId}\nGas Used: ${result.gasUsed}`);
      
      setTimeout(async () => {
        await qubicRPC.sendTransaction(code, 'initialize', []);
        setDeployResult(prev => prev + '\n🎉 Contract initialized and ready for use!');
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
    a.download = `${selectedTemplate?.name || 'contract'}.cpp`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (selectedTemplate) {
      setCode(selectedTemplate.code);
    } else {
      setCode('');
    }
    setDeployResult('');
    localStorage.removeItem('codelab_code');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Code Laboratory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write, test, and deploy Qubic smart contracts with our integrated development environment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Templates
                  </h3>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Folder className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {showTemplates && (
                <div className="p-4 space-y-3">
                  {templatesData.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template as CodeTemplate)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Editor Header */}
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedTemplate?.name || 'Smart Contract Editor'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
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

              {/* Editor */}
              <div className="relative">
                <Editor
                  height="600px"
                  language="cpp"
                  value={code}
                  onChange={handleCodeChange}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={editorOptions}
                />
              </div>

              {/* Output */}
              {deployResult && (
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {deployResult}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Quick Deploy
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Deploy your contract to the Qubic testnet
                </p>
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                >
                  Deploy Now
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Save Project
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Download your contract as a .cpp file
                </p>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Download
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Reset Code
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Reset to the original template
                </p>
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLab;