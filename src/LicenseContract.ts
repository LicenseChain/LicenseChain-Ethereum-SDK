import { ethers, Contract, Wallet } from 'ethers';
import { 
  MintOptions, 
  LicenseInfo, 
  TransactionResult, 
  GasEstimate, 
  BatchMintOptions,
  LicenseVerificationResult,
  ContractInfo,
  EventFilter,
  LicenseEvent,
  LicenseQueryOptions,
  PaginationOptions,
  LicenseListResult
} from './types';
import { LicenseChainError, ErrorCodes } from './errors';

export class LicenseContract {
  private contract: Contract;
  private wallet: Wallet;
  private config: any;

  constructor(address: string, wallet: Wallet, config: any) {
    this.wallet = wallet;
    this.config = config;
    
    const abi = this.getContractABI();
    this.contract = new Contract(address, abi, wallet);
  }

  /**
   * Get contract address
   */
  getAddress(): string {
    return this.contract.target as string;
  }

  /**
   * Mint a new license
   */
  async mintLicense(options: MintOptions): Promise<TransactionResult> {
    try {
      const metadata = JSON.stringify(options.metadata);
      
      const tx = await this.contract.mintLicense(
        options.to,
        options.tokenId,
        metadata,
        {
          gasLimit: this.config.gasLimit,
          gasPrice: this.config.gasPrice
        }
      );

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Verify if a license is valid
   */
  async verifyLicense(tokenId: number): Promise<boolean> {
    try {
      return await this.contract.verifyLicense(tokenId);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get detailed license verification result
   */
  async getLicenseVerification(tokenId: number): Promise<LicenseVerificationResult> {
    try {
      const isValid = await this.contract.verifyLicense(tokenId);
      const metadata = await this.getLicenseMetadata(tokenId);
      
      let reason: string | undefined;
      if (!isValid) {
        reason = 'License is not valid';
      }

      return {
        isValid,
        reason,
        features: metadata.features
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get license metadata
   */
  async getLicenseMetadata(tokenId: number): Promise<any> {
    try {
      const metadataString = await this.contract.getLicenseMetadata(tokenId);
      return JSON.parse(metadataString);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get complete license information
   */
  async getLicenseInfo(tokenId: number): Promise<LicenseInfo> {
    try {
      const [owner, metadata, isValid] = await Promise.all([
        this.contract.ownerOf(tokenId),
        this.getLicenseMetadata(tokenId),
        this.verifyLicense(tokenId)
      ]);

      return {
        tokenId,
        owner,
        metadata,
        isValid,
        expiresAt: metadata.expiresAt,
        createdAt: Date.now() // This would need to be stored in the contract
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Transfer a license
   */
  async transferLicense(from: string, to: string, tokenId: number): Promise<TransactionResult> {
    try {
      const tx = await this.contract.transferLicense(from, to, tokenId, {
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Revoke a license
   */
  async revokeLicense(tokenId: number): Promise<TransactionResult> {
    try {
      const tx = await this.contract.revokeLicense(tokenId, {
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Batch mint licenses
   */
  async batchMintLicenses(licenses: BatchMintOptions[]): Promise<TransactionResult> {
    try {
      const tos = licenses.map(l => l.to);
      const tokenIds = licenses.map(l => l.tokenId);
      const metadatas = licenses.map(l => JSON.stringify(l.metadata));

      const tx = await this.contract.batchMintLicenses(tos, tokenIds, metadatas, {
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Grant a role to an address
   */
  async grantRole(role: string, account: string): Promise<TransactionResult> {
    try {
      const roleHash = ethers.id(role);
      const tx = await this.contract.grantRole(roleHash, account, {
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Revoke a role from an address
   */
  async revokeRole(role: string, account: string): Promise<TransactionResult> {
    try {
      const roleHash = ethers.id(role);
      const tx = await this.contract.revokeRole(roleHash, account, {
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Check if an address has a role
   */
  async hasRole(role: string, account: string): Promise<boolean> {
    try {
      const roleHash = ethers.id(role);
      return await this.contract.hasRole(roleHash, account);
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Pause the contract
   */
  async pause(): Promise<TransactionResult> {
    try {
      const tx = await this.contract.pause({
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Unpause the contract
   */
  async unpause(): Promise<TransactionResult> {
    try {
      const tx = await this.contract.unpause({
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      const receipt = await tx.wait();
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed'
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Check if contract is paused
   */
  async isPaused(): Promise<boolean> {
    try {
      return await this.contract.isPaused();
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get contract information
   */
  async getContractInfo(): Promise<ContractInfo> {
    try {
      const [name, symbol, totalSupply, maxSupply, owner, isPaused] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.totalSupply(),
        this.contract.maxSupply(),
        this.contract.owner(),
        this.isPaused()
      ]);

      return {
        address: this.getAddress(),
        name,
        symbol,
        totalSupply: Number(totalSupply),
        maxSupply: maxSupply > 0 ? Number(maxSupply) : undefined,
        owner,
        isPaused
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Estimate gas for minting a license
   */
  async estimateGasMintLicense(options: MintOptions): Promise<GasEstimate> {
    try {
      const metadata = JSON.stringify(options.metadata);
      const gasEstimate = await this.contract.mintLicense.estimateGas(
        options.to,
        options.tokenId,
        metadata
      );

      const gasPrice = await this.wallet.provider!.getFeeData();
      const gasPriceWei = gasPrice.gasPrice || ethers.parseUnits('20', 'gwei');
      
      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: gasPriceWei.toString(),
        totalCost: ethers.formatEther(gasEstimate * gasPriceWei)
      };
    } catch (error: any) {
      throw LicenseChainError.fromEthersError(error);
    }
  }

  /**
   * Get contract ABI
   */
  private getContractABI(): any[] {
    return [
      "function name() public view returns (string memory)",
      "function symbol() public view returns (string memory)",
      "function totalSupply() public view returns (uint256)",
      "function maxSupply() public view returns (uint256)",
      "function owner() public view returns (address)",
      "function ownerOf(uint256 tokenId) public view returns (address)",
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
}
