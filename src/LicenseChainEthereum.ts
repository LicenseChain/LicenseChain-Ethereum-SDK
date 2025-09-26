import { ethers, Wallet, JsonRpcProvider, Web3Provider } from 'ethers';
import { LicenseContract } from './LicenseContract';
import { EthereumConfig, DeployOptions, NetworkConfig, ContractDeploymentResult } from './types';
import { LicenseChainError, ErrorCodes } from './errors';
import { getNetworkConfig } from './utils';

export class LicenseChainEthereum {
  private provider: JsonRpcProvider | Web3Provider;
  private wallet?: Wallet;
  private config: EthereumConfig;
  private networkConfig: NetworkConfig;

  constructor(config: EthereumConfig) {
    this.config = config;
    this.networkConfig = getNetworkConfig(config.network, config.rpcUrl, config.chainId);
    
    // Initialize provider
    if (config.walletProvider) {
      this.provider = new Web3Provider(config.walletProvider);
    } else if (config.rpcUrl) {
      this.provider = new JsonRpcProvider(config.rpcUrl);
    } else {
      throw new LicenseChainError(
        ErrorCodes.CONFIGURATION_ERROR,
        'Either walletProvider or rpcUrl must be provided'
      );
    }

    // Initialize wallet if private key is provided
    if (config.privateKey) {
      this.wallet = new Wallet(config.privateKey, this.provider);
    }
  }

  /**
   * Deploy a new license contract
   */
  async deployLicenseContract(options: DeployOptions): Promise<LicenseContract> {
    if (!this.wallet) {
      throw new LicenseChainError(
        ErrorCodes.UNAUTHORIZED,
        'Wallet not initialized. Private key or wallet provider required.'
      );
    }

    try {
      // Deploy the contract
      const contractFactory = new ethers.ContractFactory(
        this.getLicenseContractABI(),
        this.getLicenseContractBytecode(),
        this.wallet
      );

      const contract = await contractFactory.deploy(
        options.name,
        options.symbol,
        options.baseURI,
        options.maxSupply || 0,
        options.royaltyRecipient || ethers.ZeroAddress,
        options.royaltyFee || 0
      );

      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      return new LicenseContract(contractAddress, this.wallet, this.config);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Deploy a multi-signature license contract
   */
  async deployMultiSigLicenseContract(
    options: DeployOptions & { requiredSignatures: number; signers: string[] }
  ): Promise<LicenseContract> {
    if (!this.wallet) {
      throw new LicenseChainError(
        ErrorCodes.UNAUTHORIZED,
        'Wallet not initialized. Private key or wallet provider required.'
      );
    }

    try {
      const contractFactory = new ethers.ContractFactory(
        this.getMultiSigLicenseContractABI(),
        this.getMultiSigLicenseContractBytecode(),
        this.wallet
      );

      const contract = await contractFactory.deploy(
        options.name,
        options.symbol,
        options.baseURI,
        options.maxSupply || 0,
        options.royaltyRecipient || ethers.ZeroAddress,
        options.royaltyFee || 0,
        options.requiredSignatures,
        options.signers
      );

      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      return new LicenseContract(contractAddress, this.wallet, this.config);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Deploy an upgradeable license contract
   */
  async deployUpgradeableLicenseContract(
    options: DeployOptions & { implementation: string }
  ): Promise<LicenseContract> {
    if (!this.wallet) {
      throw new LicenseChainError(
        ErrorCodes.UNAUTHORIZED,
        'Wallet not initialized. Private key or wallet provider required.'
      );
    }

    try {
      const contractFactory = new ethers.ContractFactory(
        this.getUpgradeableLicenseContractABI(),
        this.getUpgradeableLicenseContractBytecode(),
        this.wallet
      );

      const contract = await contractFactory.deploy(
        options.implementation,
        options.name,
        options.symbol,
        options.baseURI,
        options.maxSupply || 0,
        options.royaltyRecipient || ethers.ZeroAddress,
        options.royaltyFee || 0
      );

      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      return new LicenseContract(contractAddress, this.wallet, this.config);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get an existing contract instance
   */
  async getContract(address: string): Promise<LicenseContract> {
    if (!ethers.isAddress(address)) {
      throw LicenseChainError.invalidAddress(address);
    }

    if (!this.wallet) {
      throw new LicenseChainError(
        ErrorCodes.UNAUTHORIZED,
        'Wallet not initialized. Private key or wallet provider required.'
      );
    }

    return new LicenseContract(address, this.wallet, this.config);
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice?.toString() || '0';
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get network information
   */
  getNetworkConfig(): NetworkConfig {
    return this.networkConfig;
  }

  /**
   * Get current block number
   */
  async getCurrentBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get license contract ABI
   */
  private getLicenseContractABI(): any[] {
    return [
      "constructor(string memory name, string memory symbol, string memory baseURI, uint256 maxSupply, address royaltyRecipient, uint96 royaltyFee)",
      "function name() public view returns (string memory)",
      "function symbol() public view returns (string memory)",
      "function totalSupply() public view returns (uint256)",
      "function maxSupply() public view returns (uint256)",
      "function owner() public view returns (address)",
      "function mintLicense(address to, uint256 tokenId, string memory metadata) public",
      "function verifyLicense(uint256 tokenId) public view returns (bool)",
      "function getLicenseMetadata(uint256 tokenId) public view returns (string memory)",
      "function transferLicense(address from, address to, uint256 tokenId) public",
      "function revokeLicense(uint256 tokenId) public",
      "function batchMintLicenses(address[] memory tos, uint256[] memory tokenIds, string[] memory metadatas) public",
      "function grantRole(bytes32 role, address account) public",
      "function revokeRole(bytes32 role, address account) public",
      "function hasRole(bytes32 role, address account) public view returns (bool)",
      "function pause() public",
      "function unpause() public",
      "function isPaused() public view returns (bool)",
      "event LicenseMinted(address indexed to, uint256 indexed tokenId, string metadata)",
      "event LicenseTransferred(address indexed from, address indexed to, uint256 indexed tokenId)",
      "event LicenseRevoked(uint256 indexed tokenId)",
      "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
      "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)"
    ];
  }

  /**
   * Get license contract bytecode
   */
  private getLicenseContractBytecode(): string {
    // This would contain the actual compiled bytecode
    // For now, returning a placeholder
    return "0x608060405234801561001057600080fd5b50600436106100a95760003560e01c8063...";
  }

  /**
   * Get multi-signature license contract ABI
   */
  private getMultiSigLicenseContractABI(): any[] {
    return [
      "constructor(string memory name, string memory symbol, string memory baseURI, uint256 maxSupply, address royaltyRecipient, uint96 royaltyFee, uint256 requiredSignatures, address[] memory signers)",
      "function submitTransaction(address destination, uint256 value, bytes memory data) public returns (uint256)",
      "function confirmTransaction(uint256 transactionId) public",
      "function executeTransaction(uint256 transactionId) public",
      "function getConfirmationCount(uint256 transactionId) public view returns (uint256)",
      "function isConfirmed(uint256 transactionId) public view returns (bool)",
      "function getTransactionCount(bool pending, bool executed) public view returns (uint256)",
      "function getTransactionIds(uint256 from, uint256 to, bool pending, bool executed) public view returns (uint256[] memory)"
    ];
  }

  /**
   * Get multi-signature license contract bytecode
   */
  private getMultiSigLicenseContractBytecode(): string {
    return "0x608060405234801561001057600080fd5b50600436106100a95760003560e01c8063...";
  }

  /**
   * Get upgradeable license contract ABI
   */
  private getUpgradeableLicenseContractABI(): any[] {
    return [
      "constructor(address implementation, string memory name, string memory symbol, string memory baseURI, uint256 maxSupply, address royaltyRecipient, uint96 royaltyFee)",
      "function upgradeTo(address newImplementation) public",
      "function upgradeToAndCall(address newImplementation, bytes memory data) public",
      "function implementation() public view returns (address)",
      "function admin() public view returns (address)"
    ];
  }

  /**
   * Get upgradeable license contract bytecode
   */
  private getUpgradeableLicenseContractBytecode(): string {
    return "0x608060405234801561001057600080fd5b50600436106100a95760003560e01c8063...";
  }
}
