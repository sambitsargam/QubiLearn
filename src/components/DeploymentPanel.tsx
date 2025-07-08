import React, { useState } from 'react';
import { Rocket, CheckCircle, XCircle, Clock, ExternalLink, Copy } from 'lucide-react';
import { qubicRPC } from '../utils/qubicRpcSimulator';

interface DeploymentPanelProps {
  code: string;
  contractName: string;
}

interface DeploymentResult {
  success: boolean;
  txId: string;
  address: string;
  gasUsed: number;
  timestamp: number;
  encodedData: string;
}

const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ code, contractName }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDeploymentLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const simulateDeployment = async () => {
    if (!code.trim()) {
      addLog('❌ Error: No contract code to deploy');
      return;
    }

    setIsDeploying(true);
    setDeploymentLog([]);
    setDeploymentResult(null);

    try {
      addLog('🚀 Starting deployment process...');
      addLog('📝 Encoding contract code...');
      
      // Encode the contract code
      const encodedData = btoa(code);
      
      addLog('✅ Contract code encoded successfully');
      addLog('🔗 Connecting to Qubic network...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('📡 Submitting transaction to Qubic computors...');
      
      // Use the RPC simulator
      const result = await qubicRPC.deployContract(code, []);
      
      addLog(`✅ Transaction submitted: ${result.txId}`);
      addLog('⏳ Waiting for confirmation...');
      
      // Simulate confirmation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedAddress = `QUBIC_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create deployment payload in Qubic format
      const deploymentPayload = {
        address: simulatedAddress,
        data: encodedData,
        timestamp: Date.now(),
        gasLimit: 1000000,
        gasPrice: 1,
        nonce: Math.floor(Math.random() * 1000000)
      };

      console.log('🔗 Qubic Deployment Payload:', deploymentPayload);
      
      addLog(`🎉 Contract deployed successfully!`);
      addLog(`📍 Contract Address: ${simulatedAddress}`);
      addLog(`⛽ Gas Used: ${result.gasUsed}`);
      
      setDeploymentResult({
        success: true,
        txId: result.txId,
        address: simulatedAddress,
        gasUsed: result.gasUsed,
        timestamp: Date.now(),
        encodedData
      });

      // Initialize the contract
      addLog('🔧 Initializing contract...');
      await qubicRPC.sendTransaction(code, 'initialize', []);
      addLog('✅ Contract initialized and ready for use!');
      
    } catch (error) {
      addLog(`❌ Deployment failed: ${error}`);
      setDeploymentResult({
        success: false,
        txId: '',
        address: '',
        gasUsed: 0,
        timestamp: Date.now(),
        encodedData: ''
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Deploy to Qubic
          </h3>
        </div>

        {/* Deployment Button */}
        <div className="mb-6">
          <button
            onClick={simulateDeployment}
            disabled={isDeploying || !code.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isDeploying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Deploy Contract</span>
              </>
            )}
          </button>
          
          {!code.trim() && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Generate contract code first to enable deployment
            </p>
          )}
        </div>

        {/* Deployment Log */}
        {deploymentLog.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Deployment Log
            </h4>
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-1 font-mono text-sm">
                {deploymentLog.map((log, index) => (
                  <div key={index} className="text-green-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deployment Result */}
        {deploymentResult && (
          <div className={`rounded-lg p-4 ${
            deploymentResult.success 
              ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {deploymentResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <h4 className={`font-medium ${
                deploymentResult.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {deploymentResult.success ? 'Deployment Successful!' : 'Deployment Failed'}
              </h4>
            </div>

            {deploymentResult.success && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700 dark:text-green-300 font-medium">Transaction ID:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs font-mono">
                        {deploymentResult.txId.substring(0, 16)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(deploymentResult.txId)}
                        className="text-green-600 dark:text-green-400 hover:text-green-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-green-700 dark:text-green-300 font-medium">Contract Address:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs font-mono">
                        {deploymentResult.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(deploymentResult.address)}
                        className="text-green-600 dark:text-green-400 hover:text-green-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-green-700 dark:text-green-300 font-medium">Gas Used:</span>
                    <div className="mt-1">
                      <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs font-mono">
                        {deploymentResult.gasUsed.toLocaleString()}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-green-700 dark:text-green-300 font-medium">Deployed At:</span>
                    <div className="mt-1">
                      <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded text-xs font-mono">
                        {new Date(deploymentResult.timestamp).toLocaleString()}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-300 font-medium text-sm">
                      Next Steps:
                    </span>
                    <a
                      href="https://docs.qubic.org/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 text-sm"
                    >
                      <span>View Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <ul className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Test your contract functions</li>
                    <li>• Monitor transaction status</li>
                    <li>• Integrate with your application</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Network Info */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Network Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Network:</span> Qubic Testnet
            </div>
            <div>
              <span className="font-medium">Gas Price:</span> 1 QUBIC
            </div>
            <div>
              <span className="font-medium">Block Time:</span> ~1 second
            </div>
            <div>
              <span className="font-medium">Confirmation:</span> 1 block
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPanel;