export enum ErrorCodes {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  
  // Contract errors
  CONTRACT_NOT_DEPLOYED = 'CONTRACT_NOT_DEPLOYED',
  CONTRACT_NOT_VERIFIED = 'CONTRACT_NOT_VERIFIED',
  INVALID_CONTRACT_ADDRESS = 'INVALID_CONTRACT_ADDRESS',
  
  // License errors
  INVALID_TOKEN_ID = 'INVALID_TOKEN_ID',
  LICENSE_NOT_FOUND = 'LICENSE_NOT_FOUND',
  LICENSE_EXPIRED = 'LICENSE_EXPIRED',
  LICENSE_REVOKED = 'LICENSE_REVOKED',
  LICENSE_ALREADY_EXISTS = 'LICENSE_ALREADY_EXISTS',
  INVALID_LICENSE_METADATA = 'INVALID_LICENSE_METADATA',
  
  // Permission errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ROLE_NOT_GRANTED = 'ROLE_NOT_GRANTED',
  
  // Validation errors
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_NETWORK = 'INVALID_NETWORK',
  INVALID_CONFIG = 'INVALID_CONFIG',
  INVALID_METADATA = 'INVALID_METADATA',
  
  // Multi-signature errors
  INSUFFICIENT_SIGNATURES = 'INSUFFICIENT_SIGNATURES',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  SIGNATURE_TIMEOUT = 'SIGNATURE_TIMEOUT',
  
  // Upgrade errors
  UPGRADE_NOT_AUTHORIZED = 'UPGRADE_NOT_AUTHORIZED',
  INVALID_IMPLEMENTATION = 'INVALID_IMPLEMENTATION',
  UPGRADE_FAILED = 'UPGRADE_FAILED',
  
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR'
}

export class LicenseChainError extends Error {
  public readonly code: ErrorCodes;
  public readonly details?: any;

  constructor(code: ErrorCodes, message: string, details?: any) {
    super(message);
    this.name = 'LicenseChainError';
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LicenseChainError);
    }
  }

  static fromEthersError(error: any): LicenseChainError {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return new LicenseChainError(
        ErrorCodes.INSUFFICIENT_FUNDS,
        'Insufficient funds for transaction',
        { originalError: error }
      );
    }
    
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      return new LicenseChainError(
        ErrorCodes.GAS_ESTIMATION_FAILED,
        'Gas estimation failed',
        { originalError: error }
      );
    }
    
    if (error.code === 'CALL_EXCEPTION') {
      return new LicenseChainError(
        ErrorCodes.TRANSACTION_REVERTED,
        'Transaction reverted',
        { originalError: error }
      );
    }
    
    if (error.code === 'NETWORK_ERROR') {
      return new LicenseChainError(
        ErrorCodes.NETWORK_ERROR,
        'Network error occurred',
        { originalError: error }
      );
    }
    
    return new LicenseChainError(
      ErrorCodes.UNKNOWN_ERROR,
      error.message || 'Unknown error occurred',
      { originalError: error }
    );
  }

  static fromRpcError(error: any): LicenseChainError {
    if (error.code === -32603) {
      return new LicenseChainError(
        ErrorCodes.RPC_ERROR,
        'Internal JSON-RPC error',
        { originalError: error }
      );
    }
    
    if (error.code === -32602) {
      return new LicenseChainError(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid parameters',
        { originalError: error }
      );
    }
    
    if (error.code === -32000) {
      return new LicenseChainError(
        ErrorCodes.TRANSACTION_FAILED,
        'Transaction failed',
        { originalError: error }
      );
    }
    
    return new LicenseChainError(
      ErrorCodes.RPC_ERROR,
      error.message || 'RPC error occurred',
      { originalError: error }
    );
  }

  static invalidAddress(address: string): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.INVALID_ADDRESS,
      `Invalid address: ${address}`,
      { address }
    );
  }

  static invalidNetwork(network: string): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.INVALID_NETWORK,
      `Invalid network: ${network}`,
      { network }
    );
  }

  static contractNotDeployed(address: string): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.CONTRACT_NOT_DEPLOYED,
      `Contract not deployed at address: ${address}`,
      { address }
    );
  }

  static licenseNotFound(tokenId: number): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.LICENSE_NOT_FOUND,
      `License not found for token ID: ${tokenId}`,
      { tokenId }
    );
  }

  static licenseExpired(tokenId: number, expiresAt: number): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.LICENSE_EXPIRED,
      `License expired for token ID: ${tokenId}`,
      { tokenId, expiresAt }
    );
  }

  static licenseRevoked(tokenId: number): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.LICENSE_REVOKED,
      `License revoked for token ID: ${tokenId}`,
      { tokenId }
    );
  }

  static insufficientPermissions(required: string, actual: string[]): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.INSUFFICIENT_PERMISSIONS,
      `Insufficient permissions. Required: ${required}, Actual: ${actual.join(', ')}`,
      { required, actual }
    );
  }

  static invalidMetadata(metadata: any): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.INVALID_LICENSE_METADATA,
      'Invalid license metadata',
      { metadata }
    );
  }

  static configurationError(field: string, value: any): LicenseChainError {
    return new LicenseChainError(
      ErrorCodes.CONFIGURATION_ERROR,
      `Invalid configuration for ${field}: ${value}`,
      { field, value }
    );
  }
}
