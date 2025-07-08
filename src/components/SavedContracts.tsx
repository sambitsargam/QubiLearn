import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, Clock, FileText } from 'lucide-react';
import { ContractFormData } from './BuilderForm';

interface SavedContract {
  id: string;
  name: string;
  formData: ContractFormData;
  code: string;
  savedAt: string;
}

interface SavedContractsProps {
  currentFormData: ContractFormData;
  currentCode: string;
  onLoad: (formData: ContractFormData, code: string) => void;
}

const SavedContracts: React.FC<SavedContractsProps> = ({ 
  currentFormData, 
  currentCode, 
  onLoad 
}) => {
  const [savedContracts, setSavedContracts] = useState<SavedContract[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [contractName, setContractName] = useState('');

  useEffect(() => {
    loadSavedContracts();
  }, []);

  const loadSavedContracts = () => {
    const saved = localStorage.getItem('qubibuilder_saved_contracts');
    if (saved) {
      setSavedContracts(JSON.parse(saved));
    }
  };

  const saveContract = () => {
    if (!contractName.trim()) return;

    const newContract: SavedContract = {
      id: Date.now().toString(),
      name: contractName,
      formData: currentFormData,
      code: currentCode,
      savedAt: new Date().toISOString()
    };

    const updated = [...savedContracts, newContract];
    setSavedContracts(updated);
    localStorage.setItem('qubibuilder_saved_contracts', JSON.stringify(updated));
    
    setShowSaveModal(false);
    setContractName('');
  };

  const deleteContract = (id: string) => {
    const updated = savedContracts.filter(contract => contract.id !== id);
    setSavedContracts(updated);
    localStorage.setItem('qubibuilder_saved_contracts', JSON.stringify(updated));
  };

  const loadContract = (contract: SavedContract) => {
    onLoad(contract.formData, contract.code);
  };

  const downloadContract = (contract: SavedContract) => {
    const blob = new Blob([contract.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.name}.h`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Saved Contracts
          </h3>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Current</span>
          </button>
        </div>

        {savedContracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No saved contracts yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Save your current contract to access it later
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedContracts.map((contract) => (
              <div
                key={contract.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {contract.name}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(contract.savedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="capitalize">{contract.formData.contractType}</span>
                      <span>{contract.formData.functions.length} functions</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => loadContract(contract)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm px-3 py-1 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => downloadContract(contract)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteContract(contract.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Save Contract
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Name
                </label>
                <input
                  type="text"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="Enter contract name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveContract}
                  disabled={!contractName.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedContracts;