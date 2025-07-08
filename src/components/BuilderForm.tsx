import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Code, Settings } from 'lucide-react';

export interface ContractVariable {
  type: string;
  name: string;
}

export interface ContractFunction {
  name: string;
  parameters: Array<{ type: string; name: string }>;
  logic: string;
  isPublic: boolean;
}

export interface ContractFormData {
  contractName: string;
  contractType: 'Token' | 'Voting' | 'Oracle';
  variables: ContractVariable[];
  functions: ContractFunction[];
  constructorLogic: string;
}

interface BuilderFormProps {
  formData: ContractFormData;
  onChange: (data: ContractFormData) => void;
}

const BuilderForm: React.FC<BuilderFormProps> = ({ formData, onChange }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const contractTypes = [
    { value: 'Token', label: 'Token Contract', description: 'ERC20-style token with transfers and balances' },
    { value: 'Voting', label: 'Voting System', description: 'Decentralized voting with proposals and ballots' },
    { value: 'Oracle', label: 'Oracle Contract', description: 'External data feed integration' }
  ];

  const variableTypes = [
    'uint64_t', 'int64_t', 'string', 'bool', 'PublicKey',
    'map<string, uint64_t>', 'map<PublicKey, uint64_t>', 'vector<string>'
  ];

  const logicBlocks = [
    'Transfer tokens between accounts',
    'Check balance of account',
    'Mint new tokens',
    'Burn existing tokens',
    'Create new proposal',
    'Cast vote on proposal',
    'Update oracle data',
    'Validate input parameters',
    'Emit event notification',
    'Custom logic'
  ];

  const addVariable = () => {
    const newVariable: ContractVariable = { type: 'uint64_t', name: '' };
    onChange({
      ...formData,
      variables: [...formData.variables, newVariable]
    });
  };

  const removeVariable = (index: number) => {
    const newVariables = formData.variables.filter((_, i) => i !== index);
    onChange({
      ...formData,
      variables: newVariables
    });
  };

  const updateVariable = (index: number, field: keyof ContractVariable, value: string) => {
    const newVariables = [...formData.variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    onChange({
      ...formData,
      variables: newVariables
    });
  };

  const addFunction = () => {
    const newFunction: ContractFunction = {
      name: '',
      parameters: [],
      logic: '',
      isPublic: true
    };
    onChange({
      ...formData,
      functions: [...formData.functions, newFunction]
    });
  };

  const removeFunction = (index: number) => {
    const newFunctions = formData.functions.filter((_, i) => i !== index);
    onChange({
      ...formData,
      functions: newFunctions
    });
  };

  const updateFunction = (index: number, field: keyof ContractFunction, value: any) => {
    const newFunctions = [...formData.functions];
    newFunctions[index] = { ...newFunctions[index], [field]: value };
    onChange({
      ...formData,
      functions: newFunctions
    });
  };

  const addParameter = (functionIndex: number) => {
    const newFunctions = [...formData.functions];
    newFunctions[functionIndex].parameters.push({ type: 'uint64_t', name: '' });
    onChange({
      ...formData,
      functions: newFunctions
    });
  };

  const removeParameter = (functionIndex: number, paramIndex: number) => {
    const newFunctions = [...formData.functions];
    newFunctions[functionIndex].parameters = newFunctions[functionIndex].parameters.filter((_, i) => i !== paramIndex);
    onChange({
      ...formData,
      functions: newFunctions
    });
  };

  const updateParameter = (functionIndex: number, paramIndex: number, field: 'type' | 'name', value: string) => {
    const newFunctions = [...formData.functions];
    newFunctions[functionIndex].parameters[paramIndex] = {
      ...newFunctions[functionIndex].parameters[paramIndex],
      [field]: value
    };
    onChange({
      ...formData,
      functions: newFunctions
    });
  };

  const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contract Builder</h2>
      </div>

      <div className="space-y-6">
        {/* Contract Name */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contract Name
            </label>
            <Tooltip content="The name of your smart contract class">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <input
            type="text"
            value={formData.contractName}
            onChange={(e) => onChange({ ...formData, contractName: e.target.value })}
            placeholder="e.g., MyToken"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Contract Type */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contract Type
            </label>
            <Tooltip content="Choose a template that matches your contract's purpose">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <select
            value={formData.contractType}
            onChange={(e) => onChange({ ...formData, contractType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          >
            {contractTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {contractTypes.find(t => t.value === formData.contractType)?.description}
          </p>
        </div>

        {/* Variables */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Variables
              </label>
              <Tooltip content="State variables that store data in your contract">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <button
              onClick={addVariable}
              className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Variable</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.variables.map((variable, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <select
                  value={variable.type}
                  onChange={(e) => updateVariable(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white text-sm"
                >
                  {variableTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={variable.name}
                  onChange={(e) => updateVariable(index, 'name', e.target.value)}
                  placeholder="Variable name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white text-sm"
                />
                <button
                  onClick={() => removeVariable(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Functions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Functions
              </label>
              <Tooltip content="Public functions that can be called on your contract">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <button
              onClick={addFunction}
              className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Function</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.functions.map((func, funcIndex) => (
              <div key={funcIndex} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={func.name}
                    onChange={(e) => updateFunction(funcIndex, 'name', e.target.value)}
                    placeholder="Function name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white text-sm mr-3"
                  />
                  <button
                    onClick={() => removeFunction(funcIndex)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Parameters */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Parameters</span>
                    <button
                      onClick={() => addParameter(funcIndex)}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700"
                    >
                      + Add Parameter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {func.parameters.map((param, paramIndex) => (
                      <div key={paramIndex} className="flex items-center space-x-2">
                        <select
                          value={param.type}
                          onChange={(e) => updateParameter(funcIndex, paramIndex, 'type', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-600 dark:text-white text-xs"
                        >
                          {variableTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={param.name}
                          onChange={(e) => updateParameter(funcIndex, paramIndex, 'name', e.target.value)}
                          placeholder="Parameter name"
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-600 dark:text-white text-xs"
                        />
                        <button
                          onClick={() => removeParameter(funcIndex, paramIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logic */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Function Logic
                  </label>
                  <select
                    value={func.logic}
                    onChange={(e) => updateFunction(funcIndex, 'logic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white text-sm"
                  >
                    <option value="">Select logic block...</option>
                    {logicBlocks.map((logic) => (
                      <option key={logic} value={logic}>{logic}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constructor Logic */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Constructor Logic (Optional)
            </label>
            <Tooltip content="Code that runs when the contract is deployed">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <textarea
            value={formData.constructorLogic}
            onChange={(e) => onChange({ ...formData, constructorLogic: e.target.value })}
            placeholder="// Initialize contract state..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
          />
        </div>

        {/* Learn More Links */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            📚 Learn More
          </h4>
          <div className="space-y-1 text-xs">
            <a href="https://docs.qubic.org/developers" target="_blank" rel="noopener noreferrer" className="block text-blue-600 dark:text-blue-400 hover:underline">
              Qubic Developer Documentation
            </a>
            <a href="https://github.com/qubic/integration" target="_blank" rel="noopener noreferrer" className="block text-blue-600 dark:text-blue-400 hover:underline">
              Qubic Integration Examples
            </a>
            <a href="https://docs.qubic.org/api/rpc" target="_blank" rel="noopener noreferrer" className="block text-blue-600 dark:text-blue-400 hover:underline">
              Qubic RPC API Reference
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderForm;