import { NetworkConfig } from './types';

/**
 * Get network configuration
 */
export function getNetworkConfig(
  network: string, 
  rpcUrl?: string, 
  chainId?: number
): NetworkConfig {
  const configs: Record<string, NetworkConfig> = {
    mainnet: {
      chainId: 1,
      rpcUrl: rpcUrl || 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
      explorerUrl: 'https://etherscan.io',
      name: 'Ethereum Mainnet'
    },
    goerli: {
      chainId: 5,
      rpcUrl: rpcUrl || 'https://eth-goerli.g.alchemy.com/v2/YOUR_KEY',
      explorerUrl: 'https://goerli.etherscan.io',
      name: 'Goerli Testnet'
    },
    sepolia: {
      chainId: 11155111,
      rpcUrl: rpcUrl || 'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY',
      explorerUrl: 'https://sepolia.etherscan.io',
      name: 'Sepolia Testnet'
    },
    polygon: {
      chainId: 137,
      rpcUrl: rpcUrl || 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY',
      explorerUrl: 'https://polygonscan.com',
      name: 'Polygon Mainnet'
    },
    arbitrum: {
      chainId: 42161,
      rpcUrl: rpcUrl || 'https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY',
      explorerUrl: 'https://arbiscan.io',
      name: 'Arbitrum One'
    },
    optimism: {
      chainId: 10,
      rpcUrl: rpcUrl || 'https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY',
      explorerUrl: 'https://optimistic.etherscan.io',
      name: 'Optimism'
    }
  };

  if (network === 'custom' && chainId && rpcUrl) {
    return {
      chainId,
      rpcUrl,
      explorerUrl: 'https://etherscan.io', // Default explorer
      name: 'Custom Network'
    };
  }

  const config = configs[network];
  if (!config) {
    throw new Error(`Unsupported network: ${network}`);
  }

  return config;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate token ID
 */
export function isValidTokenId(tokenId: number): boolean {
  return Number.isInteger(tokenId) && tokenId > 0;
}

/**
 * Validate license metadata
 */
export function validateLicenseMetadata(metadata: any): boolean {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }

  const required = ['software', 'version', 'features'];
  return required.every(field => metadata.hasOwnProperty(field));
}

/**
 * Format gas price
 */
export function formatGasPrice(gasPrice: string | number): string {
  if (typeof gasPrice === 'string') {
    return gasPrice;
  }
  return gasPrice.toString();
}

/**
 * Calculate gas cost
 */
export function calculateGasCost(gasLimit: string, gasPrice: string): string {
  const limit = BigInt(gasLimit);
  const price = BigInt(gasPrice);
  const cost = limit * price;
  return cost.toString();
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | bigint): string {
  const weiBigInt = typeof wei === 'string' ? BigInt(wei) : wei;
  const ether = weiBigInt / BigInt(10 ** 18);
  const remainder = weiBigInt % BigInt(10 ** 18);
  return `${ether}.${remainder.toString().padStart(18, '0')}`;
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string | number): string {
  const etherStr = typeof ether === 'number' ? ether.toString() : ether;
  const [integer, decimal] = etherStr.split('.');
  const decimalPadded = (decimal || '').padEnd(18, '0').slice(0, 18);
  return `${integer}${decimalPadded}`;
}

/**
 * Generate random token ID
 */
export function generateTokenId(): number {
  return Math.floor(Math.random() * 1000000) + 1;
}

/**
 * Generate role hash
 */
export function generateRoleHash(role: string): string {
  return `0x${Buffer.from(role, 'utf8').toString('hex').padStart(64, '0')}`;
}

/**
 * Parse transaction receipt
 */
export function parseTransactionReceipt(receipt: any) {
  return {
    hash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status === 1 ? 'confirmed' : 'failed',
    logs: receipt.logs
  };
}

/**
 * Get event signature
 */
export function getEventSignature(eventName: string): string {
  const signatures: Record<string, string> = {
    'LicenseMinted': '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    'LicenseTransferred': '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    'LicenseRevoked': '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
    'RoleGranted': '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
    'RoleRevoked': '0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b'
  };
  
  return signatures[eventName] || '';
}

/**
 * Decode event data
 */
export function decodeEventData(eventName: string, data: string, topics: string[]) {
  // This would use ethers.js to decode the event data
  // For now, returning a placeholder
  return {
    eventName,
    data,
    topics
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Timeout wrapper
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    })
  ]);
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(config: any): boolean {
  const required = ['chainId', 'rpcUrl', 'explorerUrl', 'name'];
  return required.every(field => config.hasOwnProperty(field));
}

/**
 * Get default gas limit for operation
 */
export function getDefaultGasLimit(operation: string): number {
  const limits: Record<string, number> = {
    'mint': 200000,
    'transfer': 100000,
    'revoke': 100000,
    'batchMint': 500000,
    'deploy': 2000000,
    'upgrade': 1000000
  };
  
  return limits[operation] || 100000;
}

/**
 * Format error message
 */
export function formatErrorMessage(error: any): string {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Unknown error occurred';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const retryableErrors = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'RPC_ERROR'
  ];
  
  return retryableErrors.some(code => 
    error.code === code || error.message?.includes(code)
  );
}
