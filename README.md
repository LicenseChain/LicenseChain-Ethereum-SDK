# 🔗 LicenseChain Ethereum SDK

[![npm version](https://badge.fury.io/js/@licensechain%2Fethereum-sdk.svg)](https://badge.fury.io/js/@licensechain%2Fethereum-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Professional Ethereum integration for LicenseChain** - Deploy, manage, and verify software licenses on the Ethereum blockchain using smart contracts.

## 🌟 Features

### 🔐 **Smart Contract Integration**
- **License Contract Deployment** - Deploy ERC-721/ERC-1155 license contracts
- **License Minting** - Create unique license tokens as NFTs
- **License Verification** - On-chain license validation
- **License Transfer** - Transfer licenses between addresses
- **License Revocation** - Burn or revoke licenses

### ⛽ **Gas Optimization**
- **Batch Operations** - Efficient batch minting and transfers
- **Gas Estimation** - Accurate gas cost calculation
- **Transaction Optimization** - Smart transaction batching
- **Layer 2 Support** - Polygon, Arbitrum, Optimism integration

### 🔒 **Security Features**
- **Multi-signature Support** - Require multiple signatures for operations
- **Role-based Access** - Granular permission management
- **Upgradeable Contracts** - Proxy pattern implementation
- **Emergency Pause** - Circuit breaker functionality

### 🌐 **Multi-Network Support**
- **Ethereum Mainnet** - Production deployments
- **Ethereum Testnets** - Goerli, Sepolia, Holesky
- **Layer 2 Networks** - Polygon, Arbitrum, Optimism
- **Custom Networks** - Support for private networks

## 🚀 Quick Start

### Installation

```bash
npm install @licensechain/ethereum-sdk
# or
yarn add @licensechain/ethereum-sdk
# or
pnpm add @licensechain/ethereum-sdk
```

### Basic Usage

```typescript
import { LicenseChainEthereum } from '@licensechain/ethereum-sdk';

// Initialize the SDK
const licenseChain = new LicenseChainEthereum({
  network: 'mainnet', // or 'goerli', 'polygon', 'arbitrum'
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL
});

// Deploy a license contract
const contract = await licenseChain.deployLicenseContract({
  name: 'My Software License',
  symbol: 'MSL',
  baseURI: 'https://api.myapp.com/licenses/',
  maxSupply: 10000
});

// Mint a license
const license = await contract.mintLicense({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: {
    software: 'MyApp Pro',
    version: '2.0.0',
    features: ['premium', 'unlimited'],
    expiresAt: 1735689600 // Unix timestamp
  }
});

// Verify a license
const isValid = await contract.verifyLicense(1);
console.log('License valid:', isValid);
```

## 📚 API Reference

### LicenseChainEthereum

#### Constructor Options

```typescript
interface EthereumConfig {
  network: 'mainnet' | 'goerli' | 'sepolia' | 'polygon' | 'arbitrum' | 'optimism';
  privateKey: string;
  rpcUrl?: string;
  gasPrice?: string;
  gasLimit?: number;
  confirmations?: number;
}
```

#### Methods

##### `deployLicenseContract(options)`
Deploy a new license contract.

```typescript
interface DeployOptions {
  name: string;
  symbol: string;
  baseURI: string;
  maxSupply?: number;
  royaltyRecipient?: string;
  royaltyFee?: number; // Basis points (0-10000)
}

const contract = await licenseChain.deployLicenseContract({
  name: 'My Software License',
  symbol: 'MSL',
  baseURI: 'https://api.myapp.com/licenses/',
  maxSupply: 10000,
  royaltyRecipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  royaltyFee: 250 // 2.5%
});
```

##### `getContract(address)`
Get an existing contract instance.

```typescript
const contract = await licenseChain.getContract('0x...');
```

### LicenseContract

#### Methods

##### `mintLicense(options)`
Mint a new license token.

```typescript
interface MintOptions {
  to: string;
  tokenId: number;
  metadata: LicenseMetadata;
  expiresAt?: number;
}

interface LicenseMetadata {
  software: string;
  version: string;
  features: string[];
  expiresAt?: number;
  customData?: Record<string, any>;
}

const license = await contract.mintLicense({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: {
    software: 'MyApp Pro',
    version: '2.0.0',
    features: ['premium', 'unlimited'],
    expiresAt: 1735689600
  }
});
```

##### `verifyLicense(tokenId)`
Verify if a license is valid.

```typescript
const isValid = await contract.verifyLicense(1);
```

##### `getLicenseMetadata(tokenId)`
Get license metadata.

```typescript
const metadata = await contract.getLicenseMetadata(1);
```

##### `transferLicense(from, to, tokenId)`
Transfer a license to another address.

```typescript
const tx = await contract.transferLicense(
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
  1
);
```

##### `revokeLicense(tokenId)`
Revoke a license (burn the token).

```typescript
const tx = await contract.revokeLicense(1);
```

##### `batchMintLicenses(licenses)`
Mint multiple licenses in a single transaction.

```typescript
const licenses = await contract.batchMintLicenses([
  {
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    tokenId: 1,
    metadata: { software: 'MyApp Basic', version: '1.0.0' }
  },
  {
    to: '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
    tokenId: 2,
    metadata: { software: 'MyApp Pro', version: '2.0.0' }
  }
]);
```

## 🔧 Advanced Features

### Multi-signature Support

```typescript
const multiSigContract = await licenseChain.deployMultiSigLicenseContract({
  name: 'MultiSig License',
  symbol: 'MSL',
  requiredSignatures: 3,
  signers: [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
    '0x9ca2f210662cE543914123756Ibd247d5d9d5d9d'
  ]
});
```

### Role-based Access Control

```typescript
// Grant minter role
await contract.grantRole('MINTER_ROLE', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');

// Grant admin role
await contract.grantRole('ADMIN_ROLE', '0x8ba1f109551bD432803012645Hac136c4c8c4c8c');
```

### Upgradeable Contracts

```typescript
const upgradeableContract = await licenseChain.deployUpgradeableLicenseContract({
  name: 'Upgradeable License',
  symbol: 'UL',
  implementation: '0x...' // Implementation contract address
});
```

## 🌐 Network Configuration

### Supported Networks

| Network | Chain ID | RPC URL | Explorer |
|---------|----------|---------|----------|
| Ethereum Mainnet | 1 | https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY | https://etherscan.io |
| Goerli Testnet | 5 | https://eth-goerli.g.alchemy.com/v2/YOUR_KEY | https://goerli.etherscan.io |
| Sepolia Testnet | 11155111 | https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY | https://sepolia.etherscan.io |
| Polygon Mainnet | 137 | https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY | https://polygonscan.com |
| Arbitrum One | 42161 | https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY | https://arbiscan.io |
| Optimism | 10 | https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY | https://optimistic.etherscan.io |

### Custom Network

```typescript
const licenseChain = new LicenseChainEthereum({
  network: 'custom',
  rpcUrl: 'https://your-custom-rpc.com',
  chainId: 12345
});
```

## 🔒 Security Best Practices

### Private Key Management

```typescript
// Use environment variables
const licenseChain = new LicenseChainEthereum({
  network: 'mainnet',
  privateKey: process.env.PRIVATE_KEY
});

// Use wallet provider
const licenseChain = new LicenseChainEthereum({
  network: 'mainnet',
  walletProvider: window.ethereum
});
```

### Gas Optimization

```typescript
// Estimate gas before transaction
const gasEstimate = await contract.estimateGas.mintLicense({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: { software: 'MyApp', version: '1.0.0' }
});

// Use gas price oracle
const gasPrice = await licenseChain.getGasPrice();
```

## 📊 Error Handling

```typescript
import { LicenseChainError, ErrorCodes } from '@licensechain/ethereum-sdk';

try {
  const license = await contract.mintLicense(options);
} catch (error) {
  if (error instanceof LicenseChainError) {
    switch (error.code) {
      case ErrorCodes.INSUFFICIENT_FUNDS:
        console.error('Insufficient funds for gas');
        break;
      case ErrorCodes.CONTRACT_NOT_DEPLOYED:
        console.error('Contract not deployed');
        break;
      case ErrorCodes.INVALID_TOKEN_ID:
        console.error('Invalid token ID');
        break;
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

## 🧪 Testing

```typescript
import { LicenseChainEthereum } from '@licensechain/ethereum-sdk';

describe('LicenseChain Ethereum SDK', () => {
  let licenseChain: LicenseChainEthereum;
  let contract: LicenseContract;

  beforeEach(async () => {
    licenseChain = new LicenseChainEthereum({
      network: 'goerli',
      privateKey: process.env.TEST_PRIVATE_KEY
    });

    contract = await licenseChain.deployLicenseContract({
      name: 'Test License',
      symbol: 'TL',
      baseURI: 'https://test.com/'
    });
  });

  it('should mint a license', async () => {
    const license = await contract.mintLicense({
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      tokenId: 1,
      metadata: { software: 'Test App', version: '1.0.0' }
    });

    expect(license.tokenId).toBe(1);
    expect(license.owner).toBe('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
  });
});
```

## 📦 Package Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "deploy:goerli": "ts-node scripts/deploy-goerli.ts",
    "deploy:mainnet": "ts-node scripts/deploy-mainnet.ts"
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/LicenseChain/LicenseChain-Ethereum-SDK.git
cd LicenseChain-Ethereum-SDK
npm install
npm run build
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://docs.licensechain.app/ethereum-sdk)
- [GitHub Repository](https://github.com/LicenseChain/LicenseChain-Ethereum-SDK)
- [NPM Package](https://www.npmjs.com/package/@licensechain/ethereum-sdk)
- [Discord Community](https://discord.gg/licensechain)
- [Twitter](https://twitter.com/licensechain)

## 🆘 Support

- 📧 Email: support@licensechain.app
- 💬 Discord: [LicenseChain Community](https://discord.gg/licensechain)
- 📖 Documentation: [docs.licensechain.app](https://docs.licensechain.app)
- 🐛 Issues: [GitHub Issues](https://github.com/LicenseChain/LicenseChain-Ethereum-SDK/issues)

---

**Built with ❤️ by the LicenseChain Team**
