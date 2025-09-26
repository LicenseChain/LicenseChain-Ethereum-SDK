export interface EthereumConfig {
  network: 'mainnet' | 'goerli' | 'sepolia' | 'polygon' | 'arbitrum' | 'optimism' | 'custom';
  privateKey?: string;
  walletProvider?: any;
  rpcUrl?: string;
  chainId?: number;
  gasPrice?: string;
  gasLimit?: number;
  confirmations?: number;
}

export interface DeployOptions {
  name: string;
  symbol: string;
  baseURI: string;
  maxSupply?: number;
  royaltyRecipient?: string;
  royaltyFee?: number; // Basis points (0-10000)
}

export interface MintOptions {
  to: string;
  tokenId: number;
  metadata: LicenseMetadata;
  expiresAt?: number;
}

export interface LicenseMetadata {
  software: string;
  version: string;
  features: string[];
  expiresAt?: number;
  customData?: Record<string, any>;
}

export interface LicenseInfo {
  tokenId: number;
  owner: string;
  metadata: LicenseMetadata;
  isValid: boolean;
  expiresAt?: number;
  createdAt: number;
}

export interface TransactionResult {
  hash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  name: string;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  totalCost: string;
}

export interface BatchMintOptions {
  to: string;
  tokenId: number;
  metadata: LicenseMetadata;
  expiresAt?: number;
}

export interface MultiSigConfig {
  requiredSignatures: number;
  signers: string[];
  delay?: number; // seconds
}

export interface RoleConfig {
  minterRole: string;
  adminRole: string;
  revokerRole: string;
}

export interface UpgradeConfig {
  implementation: string;
  proxyAdmin?: string;
  initData?: string;
}

export interface LicenseVerificationResult {
  isValid: boolean;
  reason?: string;
  expiresAt?: number;
  features?: string[];
}

export interface ContractInfo {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  maxSupply?: number;
  owner: string;
  isPaused: boolean;
}

export interface EventFilter {
  fromBlock?: number | 'latest';
  toBlock?: number | 'latest';
  topics?: string[];
}

export interface LicenseTransferEvent {
  from: string;
  to: string;
  tokenId: number;
  blockNumber: number;
  transactionHash: string;
}

export interface LicenseMintEvent {
  to: string;
  tokenId: number;
  metadata: LicenseMetadata;
  blockNumber: number;
  transactionHash: string;
}

export interface LicenseRevokeEvent {
  tokenId: number;
  blockNumber: number;
  transactionHash: string;
}

export type LicenseEvent = LicenseTransferEvent | LicenseMintEvent | LicenseRevokeEvent;

export interface ContractDeploymentResult {
  address: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  contractInfo: ContractInfo;
}

export interface LicenseQueryOptions {
  owner?: string;
  tokenId?: number;
  isValid?: boolean;
  fromBlock?: number;
  toBlock?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'tokenId' | 'createdAt' | 'expiresAt';
  sortOrder?: 'asc' | 'desc';
}

export interface LicenseListResult {
  licenses: LicenseInfo[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
