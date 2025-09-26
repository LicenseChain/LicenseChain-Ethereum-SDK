import { LicenseChainEthereum } from '@licensechain/ethereum-sdk';

/**
 * Basic usage example for LicenseChain Ethereum SDK
 */
async function basicUsageExample() {
  // Initialize the SDK
  const licenseChain = new LicenseChainEthereum({
    network: 'goerli', // Use testnet for development
    privateKey: process.env.PRIVATE_KEY!,
    rpcUrl: process.env.RPC_URL
  });

  try {
    // Deploy a license contract
    console.log('Deploying license contract...');
    const contract = await licenseChain.deployLicenseContract({
      name: 'My Software License',
      symbol: 'MSL',
      baseURI: 'https://api.myapp.com/licenses/',
      maxSupply: 10000,
      royaltyRecipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      royaltyFee: 250 // 2.5%
    });

    console.log('Contract deployed at:', contract.getAddress());

    // Mint a license
    console.log('Minting license...');
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

    console.log('License minted:', license);

    // Verify the license
    console.log('Verifying license...');
    const isValid = await contract.verifyLicense(1);
    console.log('License valid:', isValid);

    // Get license metadata
    const metadata = await contract.getLicenseMetadata(1);
    console.log('License metadata:', metadata);

    // Get complete license info
    const licenseInfo = await contract.getLicenseInfo(1);
    console.log('Complete license info:', licenseInfo);

  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Batch minting example
 */
async function batchMintingExample() {
  const licenseChain = new LicenseChainEthereum({
    network: 'goerli',
    privateKey: process.env.PRIVATE_KEY!,
    rpcUrl: process.env.RPC_URL
  });

  try {
    const contract = await licenseChain.deployLicenseContract({
      name: 'Batch License Contract',
      symbol: 'BLC',
      baseURI: 'https://api.myapp.com/licenses/',
      maxSupply: 1000
    });

    // Batch mint multiple licenses
    const licenses = await contract.batchMintLicenses([
      {
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        tokenId: 1,
        metadata: { software: 'MyApp Basic', version: '1.0.0', features: ['basic'] }
      },
      {
        to: '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
        tokenId: 2,
        metadata: { software: 'MyApp Pro', version: '2.0.0', features: ['premium', 'unlimited'] }
      },
      {
        to: '0x9ca2f210662cE543914123756Ibd247d5d9d5d9d',
        tokenId: 3,
        metadata: { software: 'MyApp Enterprise', version: '3.0.0', features: ['enterprise', 'unlimited', 'support'] }
      }
    ]);

    console.log('Batch minting completed:', licenses);

  } catch (error) {
    console.error('Batch minting error:', error);
  }
}

/**
 * License transfer example
 */
async function licenseTransferExample() {
  const licenseChain = new LicenseChainEthereum({
    network: 'goerli',
    privateKey: process.env.PRIVATE_KEY!,
    rpcUrl: process.env.RPC_URL
  });

  try {
    // Get existing contract
    const contract = await licenseChain.getContract('0x...'); // Contract address

    // Transfer license from one address to another
    const transferResult = await contract.transferLicense(
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // from
      '0x8ba1f109551bD432803012645Hac136c4c8c4c8c', // to
      1 // tokenId
    );

    console.log('License transferred:', transferResult);

    // Verify new owner
    const licenseInfo = await contract.getLicenseInfo(1);
    console.log('New owner:', licenseInfo.owner);

  } catch (error) {
    console.error('Transfer error:', error);
  }
}

/**
 * Role-based access control example
 */
async function roleBasedAccessExample() {
  const licenseChain = new LicenseChainEthereum({
    network: 'goerli',
    privateKey: process.env.PRIVATE_KEY!,
    rpcUrl: process.env.RPC_URL
  });

  try {
    const contract = await licenseChain.deployLicenseContract({
      name: 'Role-Based License',
      symbol: 'RBL',
      baseURI: 'https://api.myapp.com/licenses/',
      maxSupply: 5000
    });

    // Grant minter role
    await contract.grantRole('MINTER_ROLE', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    console.log('Minter role granted');

    // Grant admin role
    await contract.grantRole('ADMIN_ROLE', '0x8ba1f109551bD432803012645Hac136c4c8c4c8c');
    console.log('Admin role granted');

    // Check if address has role
    const hasMinterRole = await contract.hasRole('MINTER_ROLE', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    console.log('Has minter role:', hasMinterRole);

  } catch (error) {
    console.error('Role management error:', error);
  }
}

/**
 * Gas estimation example
 */
async function gasEstimationExample() {
  const licenseChain = new LicenseChainEthereum({
    network: 'goerli',
    privateKey: process.env.PRIVATE_KEY!,
    rpcUrl: process.env.RPC_URL
  });

  try {
    const contract = await licenseChain.deployLicenseContract({
      name: 'Gas Estimation License',
      symbol: 'GEL',
      baseURI: 'https://api.myapp.com/licenses/',
      maxSupply: 1000
    });

    // Estimate gas for minting
    const gasEstimate = await contract.estimateGasMintLicense({
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      tokenId: 1,
      metadata: {
        software: 'MyApp',
        version: '1.0.0',
        features: ['basic']
      }
    });

    console.log('Gas estimate:', gasEstimate);

    // Get current gas price
    const gasPrice = await licenseChain.getGasPrice();
    console.log('Current gas price:', gasPrice);

  } catch (error) {
    console.error('Gas estimation error:', error);
  }
}

// Run examples
if (require.main === module) {
  basicUsageExample()
    .then(() => console.log('Basic usage example completed'))
    .catch(console.error);
}

export {
  basicUsageExample,
  batchMintingExample,
  licenseTransferExample,
  roleBasedAccessExample,
  gasEstimationExample
};
