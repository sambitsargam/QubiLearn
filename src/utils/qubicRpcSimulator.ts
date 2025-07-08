import { v4 as uuidv4 } from 'uuid';

export interface TransactionResult {
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockHeight: number;
  gasUsed: number;
  message: string;
}

export interface EntityData {
  id: string;
  balance: number;
  contractCode?: string;
  state: Record<string, any>;
}

export interface SBTMintResult {
  tokenId: string;
  recipient: string;
  metadata: Record<string, any>;
  status: 'minted' | 'failed';
}

export class QubicRPCSimulator {
  private static instance: QubicRPCSimulator;
  private transactions: TransactionResult[] = [];
  private entities: Map<string, EntityData> = new Map();
  private currentBlock = 1000;

  private constructor() {}

  static getInstance(): QubicRPCSimulator {
    if (!QubicRPCSimulator.instance) {
      QubicRPCSimulator.instance = new QubicRPCSimulator();
    }
    return QubicRPCSimulator.instance;
  }

  async sendTransaction(contractCode: string, functionName: string, params: any[]): Promise<TransactionResult> {
    const txId = uuidv4();
    const gasUsed = Math.floor(Math.random() * 1000) + 100;
    
    // Simulate transaction processing
    const result: TransactionResult = {
      txId,
      status: 'pending',
      blockHeight: this.currentBlock,
      gasUsed,
      message: `Transaction sent to Qubic network. Function: ${functionName}`
    };

    this.transactions.push(result);
    
    // Simulate confirmation after delay
    setTimeout(() => {
      result.status = Math.random() > 0.1 ? 'confirmed' : 'failed';
      result.message = result.status === 'confirmed' 
        ? `Transaction confirmed in block ${this.currentBlock}`
        : 'Transaction failed during execution';
      this.currentBlock++;
    }, 2000);

    console.log('🚀 Qubic Transaction Sent:', {
      txId,
      function: functionName,
      params,
      gasUsed,
      blockHeight: this.currentBlock
    });

    return result;
  }

  async getEntity(entityId: string): Promise<EntityData | null> {
    // Simulate entity lookup
    if (this.entities.has(entityId)) {
      return this.entities.get(entityId)!;
    }

    // Create mock entity data
    const mockEntity: EntityData = {
      id: entityId,
      balance: Math.floor(Math.random() * 1000000),
      state: {
        initialized: true,
        lastUpdated: Date.now(),
        version: '1.0.0'
      }
    };

    this.entities.set(entityId, mockEntity);
    
    console.log('📄 Entity Data Retrieved:', mockEntity);
    return mockEntity;
  }

  async mintSBT(recipient: string, badgeType: string, metadata: Record<string, any>): Promise<SBTMintResult> {
    const tokenId = uuidv4();
    
    const result: SBTMintResult = {
      tokenId,
      recipient,
      metadata: {
        ...metadata,
        badgeType,
        mintedAt: Date.now(),
        blockchain: 'Qubic',
        soulbound: true
      },
      status: 'minted'
    };

    // Store in localStorage for persistence
    const existingSBTs = JSON.parse(localStorage.getItem('qubic_sbts') || '[]');
    existingSBTs.push(result);
    localStorage.setItem('qubic_sbts', JSON.stringify(existingSBTs));

    console.log('🏆 SBT Minted:', result);
    return result;
  }

  async deployContract(contractCode: string, constructor_args: any[]): Promise<TransactionResult> {
    const contractId = uuidv4();
    const txId = uuidv4();
    
    const result: TransactionResult = {
      txId,
      status: 'pending',
      blockHeight: this.currentBlock,
      gasUsed: Math.floor(Math.random() * 5000) + 1000,
      message: `Contract deployment initiated. Contract ID: ${contractId}`
    };

    // Store contract entity
    const contractEntity: EntityData = {
      id: contractId,
      balance: 0,
      contractCode,
      state: {
        deployed: true,
        deployedAt: Date.now(),
        constructor_args
      }
    };

    this.entities.set(contractId, contractEntity);
    this.transactions.push(result);

    // Simulate deployment confirmation
    setTimeout(() => {
      result.status = 'confirmed';
      result.message = `Contract deployed successfully at ${contractId}`;
      this.currentBlock++;
    }, 3000);

    console.log('📦 Contract Deployment:', {
      contractId,
      txId,
      codeSize: contractCode.length,
      args: constructor_args
    });

    return result;
  }

  getTransactionHistory(): TransactionResult[] {
    return [...this.transactions];
  }

  getCurrentBlock(): number {
    return this.currentBlock;
  }

  async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }
}

export const qubicRPC = QubicRPCSimulator.getInstance();