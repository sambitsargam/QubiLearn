import React, { useState } from 'react';
import { Brain, Wand2, Loader2, Lightbulb, Code, Zap } from 'lucide-react';
import { createOpenAIService, getOpenAIApiKey } from '../utils/openai';
import { ContractFormData } from './BuilderForm';

interface AIContractGeneratorProps {
  onGenerate: (formData: ContractFormData, code: string) => void;
}

interface ContractIdea {
  title: string;
  description: string;
  example: string;
}

const AIContractGenerator: React.FC<AIContractGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);

  const contractIdeas: ContractIdea[] = [
    {
      title: "Decentralized Marketplace",
      description: "A marketplace where users can list items for sale and others can purchase them",
      example: "Create a marketplace contract where sellers can list products with prices, buyers can purchase items, and the contract handles escrow and payments"
    },
    {
      title: "Staking Rewards System",
      description: "A contract that allows users to stake tokens and earn rewards over time",
      example: "Build a staking contract where users can deposit tokens, earn rewards based on time staked, and withdraw their stake plus rewards"
    },
    {
      title: "Multi-Signature Wallet",
      description: "A wallet that requires multiple signatures to execute transactions",
      example: "Create a multi-sig wallet contract that requires 2 out of 3 signatures to approve transactions, with owner management"
    },
    {
      title: "Lottery System",
      description: "A fair lottery where users can buy tickets and winners are selected randomly",
      example: "Design a lottery contract where users buy tickets, a random winner is selected, and prizes are distributed automatically"
    },
    {
      title: "Subscription Service",
      description: "A contract for managing recurring subscription payments",
      example: "Build a subscription contract where users can subscribe to services, pay monthly fees, and access is managed automatically"
    },
    {
      title: "Reputation System",
      description: "A system to track and manage user reputation scores",
      example: "Create a reputation contract where users can rate each other, reputation scores are calculated, and high-reputation users get benefits"
    }
  ];

  const generateContract = async () => {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) {
      alert('Please set your OpenAI API key in the AI Chat settings first.');
      return;
    }

    if (!prompt.trim()) {
      alert('Please describe the contract you want to create.');
      return;
    }

    setIsGenerating(true);

    try {
      const openAIService = createOpenAIService(apiKey);
      
      const systemPrompt = `You are an expert Qubic smart contract developer. Generate a complete smart contract specification based on the user's description.

Return your response in the following JSON format:
{
  "contractName": "ContractName",
  "contractType": "Token|Voting|Oracle",
  "description": "Brief description of what this contract does",
  "variables": [
    {"type": "uint64_t", "name": "variableName"}
  ],
  "functions": [
    {
      "name": "functionName",
      "parameters": [{"type": "uint64_t", "name": "paramName"}],
      "logic": "Brief description of what this function does",
      "isPublic": true
    }
  ],
  "constructorLogic": "// Constructor initialization code",
  "cppCode": "Complete C++ contract code following Qubic standards"
}

Guidelines:
- Use appropriate Qubic C++ syntax
- Include proper error handling
- Use uint64_t for numbers, PublicKey for addresses
- Include maps for key-value storage
- Follow Qubic naming conventions
- Make the contract secure and efficient`;

      const response = await openAIService.sendMessage([
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create a Qubic smart contract for: ${prompt}`
        }
      ]);

      // Try to parse JSON from response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const contractSpec = JSON.parse(jsonMatch[0]);
          
          // Convert to our form data format
          const formData: ContractFormData = {
            contractName: contractSpec.contractName || 'AIGeneratedContract',
            contractType: contractSpec.contractType || 'Token',
            variables: contractSpec.variables || [],
            functions: contractSpec.functions || [],
            constructorLogic: contractSpec.constructorLogic || '// AI generated constructor'
          };

          const cppCode = contractSpec.cppCode || generateFallbackCode(formData);
          
          onGenerate(formData, cppCode);
          setPrompt('');
          
        } else {
          throw new Error('Could not parse AI response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        
        // Fallback: create a basic contract based on keywords
        const fallbackFormData = createFallbackContract(prompt);
        const fallbackCode = generateFallbackCode(fallbackFormData);
        onGenerate(fallbackFormData, fallbackCode);
        setPrompt('');
      }
      
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate contract. Please try again or check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createFallbackContract = (description: string): ContractFormData => {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('token') || lowerDesc.includes('coin') || lowerDesc.includes('currency')) {
      return {
        contractName: 'AIToken',
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
        constructorLogic: '// Initialize token supply'
      };
    } else if (lowerDesc.includes('vote') || lowerDesc.includes('proposal') || lowerDesc.includes('governance')) {
      return {
        contractName: 'AIVoting',
        contractType: 'Voting',
        variables: [
          { type: 'vector<Proposal>', name: 'proposals' },
          { type: 'map<uint32_t, map<PublicKey, bool>>', name: 'hasVoted' }
        ],
        functions: [
          {
            name: 'createProposal',
            parameters: [
              { type: 'string', name: 'title' },
              { type: 'uint64_t', name: 'duration' }
            ],
            logic: 'Create new proposal',
            isPublic: true
          }
        ],
        constructorLogic: '// Initialize voting system'
      };
    } else {
      return {
        contractName: 'AIContract',
        contractType: 'Token',
        variables: [
          { type: 'uint64_t', name: 'value' },
          { type: 'PublicKey', name: 'owner' }
        ],
        functions: [
          {
            name: 'setValue',
            parameters: [
              { type: 'uint64_t', name: 'newValue' }
            ],
            logic: 'Custom logic',
            isPublic: true
          }
        ],
        constructorLogic: '// Initialize contract'
      };
    }
  };

  const generateFallbackCode = (formData: ContractFormData): string => {
    return `#include <qpi.h>

class ${formData.contractName} {
private:
${formData.variables.map(v => `    ${v.type} ${v.name};`).join('\n')}

public:
    ${formData.contractName}() {
        ${formData.constructorLogic}
    }

${formData.functions.map(func => {
    const params = func.parameters.map(p => `const ${p.type}& ${p.name}`).join(', ');
    return `    bool ${func.name}(${params}) {
        // ${func.logic}
        return true;
    }`;
}).join('\n\n')}
};

${formData.contractName.toUpperCase()}_EXPORT(${formData.contractName});`;
  };

  const useIdea = (idea: ContractIdea) => {
    setPrompt(idea.example);
    setShowIdeas(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Contract Generator
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Describe your contract idea and let AI generate it for you
            </p>
          </div>
        </div>

        {/* Contract Ideas */}
        <div className="mb-6">
          <button
            onClick={() => setShowIdeas(!showIdeas)}
            className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm mb-3"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showIdeas ? 'Hide' : 'Show'} Contract Ideas</span>
          </button>

          {showIdeas && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {contractIdeas.map((idea, index) => (
                <div
                  key={index}
                  onClick={() => useIdea(idea)}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {idea.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {idea.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe Your Contract
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a marketplace contract where users can list items for sale, set prices, and buyers can purchase items with automatic escrow..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Be specific about functionality, user interactions, and data storage needs
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateContract}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Contract...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Smart Contract</span>
            </>
          )}
        </button>

        {/* Features */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">
            ✨ AI Generator Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-600 dark:text-purple-400">
            <div className="flex items-center space-x-2">
              <Code className="w-3 h-3" />
              <span>Complete C++ code generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3" />
              <span>Qubic-optimized contracts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3" />
              <span>Smart variable detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wand2 className="w-3 h-3" />
              <span>Auto function generation</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-3">
          <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            💡 Tips for Better Results
          </h5>
          <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Be specific about what data needs to be stored</li>
            <li>• Mention user roles and permissions</li>
            <li>• Describe the main functions users will call</li>
            <li>• Include any special business logic or rules</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIContractGenerator;