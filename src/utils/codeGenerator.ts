import { ContractFormData } from '../components/BuilderForm';

export const generateCppContract = (formData: ContractFormData): string => {
  const { contractName, contractType, variables, functions, constructorLogic } = formData;

  // Generate includes
  const includes = `#include <qpi.h>
#include <map>
#include <vector>
#include <string>

using namespace std;`;

  // Generate class declaration
  const classStart = `class ${contractName || 'MyContract'} {`;

  // Generate private variables
  const privateSection = variables.length > 0 ? `private:
${variables.map(v => `    ${v.type} ${v.name};`).join('\n')}` : '';

  // Generate constructor
  const constructor = constructorLogic ? `
    ${contractName || 'MyContract'}() {
        ${constructorLogic}
    }` : '';

  // Generate function implementations based on logic blocks
  const generateFunctionBody = (func: any): string => {
    const { logic, parameters } = func;
    
    switch (logic) {
      case 'Transfer tokens between accounts':
        return `        PublicKey from = getOrigin();
        if (balances[from] < amount) {
            return false;
        }
        balances[from] -= amount;
        balances[to] += amount;
        return true;`;
        
      case 'Check balance of account':
        return `        auto it = balances.find(account);
        return it != balances.end() ? it->second : 0;`;
        
      case 'Mint new tokens':
        return `        balances[to] += amount;
        totalSupply += amount;
        return true;`;
        
      case 'Burn existing tokens':
        return `        PublicKey from = getOrigin();
        if (balances[from] < amount) {
            return false;
        }
        balances[from] -= amount;
        totalSupply -= amount;
        return true;`;
        
      case 'Create new proposal':
        return `        Proposal proposal;
        proposal.title = title;
        proposal.description = description;
        proposal.deadline = getCurrentTick() + duration;
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.active = true;
        proposal.creator = getOrigin();
        proposals.push_back(proposal);
        return proposals.size() - 1;`;
        
      case 'Cast vote on proposal':
        return `        if (proposalId >= proposals.size()) {
            return false;
        }
        Proposal& proposal = proposals[proposalId];
        PublicKey voter = getOrigin();
        if (!proposal.active || hasVoted[proposalId][voter]) {
            return false;
        }
        hasVoted[proposalId][voter] = true;
        if (support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        return true;`;
        
      case 'Update oracle data':
        return `        if (getOrigin() != oracleOperator) {
            return false;
        }
        PriceData data;
        data.price = price;
        data.timestamp = getCurrentTick();
        data.valid = true;
        prices[symbol] = data;
        return true;`;
        
      case 'Validate input parameters':
        return `        if (${parameters.map(p => `${p.name} == 0`).join(' || ')}) {
            return false;
        }
        return true;`;
        
      case 'Emit event notification':
        return `        // Emit event (implementation depends on Qubic event system)
        emit("${func.name}", ${parameters.map(p => p.name).join(', ')});`;
        
      default:
        return `        // Custom logic implementation
        // TODO: Implement ${func.name} logic
        return true;`;
    }
  };

  // Generate public functions
  const publicSection = `public:${constructor}

${functions.map(func => {
    const params = func.parameters.map(p => `const ${p.type}& ${p.name}`).join(', ');
    const returnType = func.logic.includes('Check balance') ? 'uint64_t' : 
                      func.logic.includes('Create new proposal') ? 'uint32_t' : 'bool';
    
    return `    ${returnType} ${func.name}(${params}) {
${generateFunctionBody(func)}
    }`;
}).join('\n\n')}`;

  // Generate additional structs/types based on contract type
  const additionalTypes = contractType === 'Voting' ? `
struct Proposal {
    string title;
    string description;
    uint64_t deadline;
    uint64_t yesVotes;
    uint64_t noVotes;
    bool active;
    PublicKey creator;
};` : contractType === 'Oracle' ? `
struct PriceData {
    uint64_t price;
    uint64_t timestamp;
    bool valid;
};` : '';

  // Generate export macro
  const exportMacro = `
// Export the contract for Qubic runtime
${contractName?.toUpperCase() || 'CONTRACT'}_EXPORT(${contractName || 'MyContract'});`;

  // Combine all parts
  return `${includes}

${additionalTypes}

${classStart}
${privateSection}

${publicSection}
};

${exportMacro}`;
};

// Template-based generation for specific contract types
export const generateFromTemplate = (contractType: string, contractName: string): string => {
  const templates = {
    Token: `#include <qpi.h>

class ${contractName} {
private:
    uint64_t totalSupply;
    map<PublicKey, uint64_t> balances;
    
public:
    ${contractName}(uint64_t _totalSupply) : totalSupply(_totalSupply) {
        balances[getOrigin()] = _totalSupply;
    }
    
    uint64_t balanceOf(const PublicKey& account) const {
        auto it = balances.find(account);
        return it != balances.end() ? it->second : 0;
    }
    
    bool transfer(const PublicKey& to, uint64_t amount) {
        PublicKey from = getOrigin();
        if (balances[from] < amount) {
            return false;
        }
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }
    
    uint64_t getTotalSupply() const {
        return totalSupply;
    }
};

TOKEN_EXPORT(${contractName});`,

    Voting: `#include <qpi.h>

struct Proposal {
    string title;
    string description;
    uint64_t deadline;
    uint64_t yesVotes;
    uint64_t noVotes;
    bool active;
    PublicKey creator;
};

class ${contractName} {
private:
    vector<Proposal> proposals;
    map<uint32_t, map<PublicKey, bool>> hasVoted;
    
public:
    uint32_t createProposal(const string& title, const string& description, uint64_t duration) {
        Proposal proposal;
        proposal.title = title;
        proposal.description = description;
        proposal.deadline = getCurrentTick() + duration;
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.active = true;
        proposal.creator = getOrigin();
        proposals.push_back(proposal);
        return proposals.size() - 1;
    }
    
    bool vote(uint32_t proposalId, bool support) {
        if (proposalId >= proposals.size()) {
            return false;
        }
        Proposal& proposal = proposals[proposalId];
        PublicKey voter = getOrigin();
        if (!proposal.active || hasVoted[proposalId][voter]) {
            return false;
        }
        hasVoted[proposalId][voter] = true;
        if (support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        return true;
    }
    
    Proposal getProposal(uint32_t proposalId) const {
        if (proposalId < proposals.size()) {
            return proposals[proposalId];
        }
        return Proposal();
    }
};

VOTING_EXPORT(${contractName});`,

    Oracle: `#include <qpi.h>

struct PriceData {
    uint64_t price;
    uint64_t timestamp;
    bool valid;
};

class ${contractName} {
private:
    map<string, PriceData> prices;
    PublicKey oracleOperator;
    
public:
    ${contractName}(const PublicKey& _operator) : oracleOperator(_operator) {}
    
    bool updatePrice(const string& symbol, uint64_t price) {
        if (getOrigin() != oracleOperator) {
            return false;
        }
        PriceData data;
        data.price = price;
        data.timestamp = getCurrentTick();
        data.valid = true;
        prices[symbol] = data;
        return true;
    }
    
    PriceData getPrice(const string& symbol) const {
        auto it = prices.find(symbol);
        if (it != prices.end()) {
            return it->second;
        }
        return PriceData{0, 0, false};
    }
    
    bool isPriceValid(const string& symbol, uint64_t maxAge) const {
        auto it = prices.find(symbol);
        if (it != prices.end()) {
            uint64_t age = getCurrentTick() - it->second.timestamp;
            return it->second.valid && age <= maxAge;
        }
        return false;
    }
};

ORACLE_EXPORT(${contractName});`
  };

  return templates[contractType as keyof typeof templates] || templates.Token;
};