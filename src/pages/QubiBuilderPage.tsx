import React, { useState, useEffect } from 'react';
import { Blocks, Wand2, Code, Brain } from 'lucide-react';
import BuilderForm, { ContractFormData } from '../components/BuilderForm';
import ContractEditor from '../components/ContractEditor';
import DeploymentPanel from '../components/DeploymentPanel';
import SavedContracts from '../components/SavedContracts';
import AIContractGenerator from '../components/AIContractGenerator';
import { generateCppContract, generateFromTemplate } from '../utils/codeGenerator';

const QubiBuilderPage: React.FC = () => {
  const [formData, setFormData] = useState<ContractFormData>({
    contractName: 'MyContract',
    contractType: 'Token',
    variables: [
      { type: 'uint64_t', name: 'totalSupply' },
      { type: 'map<PublicKey, uint64_t>', name: 'balances' }
    ],
    functions: [
      {
        name: 'transfer',
        parameters: [
          { type: 'PublicKey', name: 'to' },
          { type: 'uint64_t', name: 'amount' }
        ],
        logic: 'Transfer tokens between accounts',
        isPublic: true
      }
    ],
    constructorLogic: '// Initialize contract state\nbalances[getOrigin()] = totalSupply;'
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [editedCode, setEditedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'builder' | 'ai-generator' | 'saved'>('builder');

  useEffect(() => {
    // Generate initial code
    const code = generateCppContract(formData);
    setGeneratedCode(code);
    setEditedCode(code);
  }, []);

  useEffect(() => {
    // Regenerate code when form data changes
    const code = generateCppContract(formData);
    setGeneratedCode(code);
    setEditedCode(code);
  }, [formData]);

  const handleFormChange = (newFormData: ContractFormData) => {
    setFormData(newFormData);
  };

  const handleCodeChange = (code: string) => {
    setEditedCode(code);
  };

  const handleReset = () => {
    setEditedCode(generatedCode);
  };

  const handleLoadContract = (loadedFormData: ContractFormData, loadedCode: string) => {
    setFormData(loadedFormData);
    setEditedCode(loadedCode);
    setGeneratedCode(loadedCode);
    setActiveTab('builder');
  };

  const generateFromTemplateHandler = () => {
    const templateCode = generateFromTemplate(formData.contractType, formData.contractName);
    setGeneratedCode(templateCode);
    setEditedCode(templateCode);
  };

  const handleAIGenerate = (aiFormData: ContractFormData, aiCode: string) => {
    setFormData(aiFormData);
    setGeneratedCode(aiCode);
    setEditedCode(aiCode);
    setActiveTab('builder'); // Switch to builder tab to show the generated contract
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg">
              <Blocks className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                QubiBuilder
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                No-code smart contract generator for Qubic blockchain
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={generateFromTemplateHandler}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Use Template</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Code className="w-4 h-4" />
              <span>Visual Builder → C++ Code → Deploy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Builder Form & Saved Contracts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-tl-xl ${
                    activeTab === 'builder'
                      ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-b-2 border-purple-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Builder
                </button>
                <button
                  onClick={() => setActiveTab('ai-generator')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'ai-generator'
                      ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-b-2 border-purple-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  AI Generator
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-tr-xl ${
                    activeTab === 'saved'
                      ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-b-2 border-purple-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Saved
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'builder' && (
              <BuilderForm formData={formData} onChange={handleFormChange} />
            )}
            
            {activeTab === 'ai-generator' && (
              <AIContractGenerator onGenerate={handleAIGenerate} />
            )}
            
            {activeTab === 'saved' && (
              <SavedContracts
                currentFormData={formData}
                currentCode={editedCode}
                onLoad={handleLoadContract}
              />
            )}
          </div>

          {/* Right Column - Code Editor & Deployment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Editor */}
            <ContractEditor
              code={editedCode}
              onChange={handleCodeChange}
              onReset={handleReset}
              contractName={formData.contractName}
            />

            {/* Deployment Panel */}
            <DeploymentPanel
              code={editedCode}
              contractName={formData.contractName}
            />
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            QubiBuilder Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-800 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Generation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate complete contracts from natural language descriptions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-800 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Blocks className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Visual Builder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create smart contracts using an intuitive form-based interface
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Code Generation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See your contract code generated in real-time as you build
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QubiBuilderPage;