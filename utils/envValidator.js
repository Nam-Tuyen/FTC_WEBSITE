const { logger } = require('./logger');

class EnvironmentValidator {
  constructor() {
    this.requiredVars = [
      'GEMINI_API_KEY'
    ];
    
    this.optionalVars = [
      'GEMINI_MODEL',
      'PORT',
      'NODE_ENV',
      'FRONTEND_URL',
      'MAX_DOCUMENTS',
      'CHUNK_SIZE',
      'CHUNK_OVERLAP',
      'MAX_CONTEXT_LENGTH',
      'SIMILARITY_THRESHOLD',
      'LOG_LEVEL'
    ];
  }

  validateEnvironment() {
    const errors = [];
    const warnings = [];
    const info = [];

    // Kiểm tra required variables
    for (const varName of this.requiredVars) {
      const value = process.env[varName];
      
      if (!value) {
        errors.push(`Missing required environment variable: ${varName}`);
      } else {
        // Validate specific variables
        switch (varName) {
          case 'GEMINI_API_KEY':
            if (!this.validateGeminiApiKey(value)) {
              warnings.push('GEMINI_API_KEY format might be incorrect (should start with "AIza")');
            } else {
              info.push(`GEMINI_API_KEY configured correctly`);
            }
            break;
        }
      }
    }

    // Kiểm tra optional variables và set defaults
    for (const varName of this.optionalVars) {
      const value = process.env[varName];
      
      if (!value) {
        const defaultValue = this.getDefaultValue(varName);
        if (defaultValue !== null) {
          process.env[varName] = defaultValue;
          info.push(`Set default value for ${varName}: ${defaultValue}`);
        }
      } else {
        // Validate specific optional variables
        const validation = this.validateOptionalVar(varName, value);
        if (validation.isValid) {
          info.push(`${varName}: ${validation.message}`);
        } else {
          warnings.push(`${varName}: ${validation.message}`);
        }
      }
    }

    // Log results
    if (errors.length > 0) {
      logger.error('Environment validation failed:', errors);
      throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }

    if (warnings.length > 0) {
      logger.warn('Environment validation warnings:', warnings);
    }

    if (info.length > 0) {
      logger.info('Environment validation info:', info);
    }

    logger.info('Environment validation completed successfully');
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info,
      environment: this.getEnvironmentSummary()
    };
  }

  validateGeminiApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }

    // Google API keys thường bắt đầu với "AIza" và có độ dài khoảng 39 ký tự
    return apiKey.startsWith('AIza') && apiKey.length >= 35;
  }

  validateOptionalVar(varName, value) {
    switch (varName) {
      case 'GEMINI_MODEL':
        const validModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        if (validModels.includes(value)) {
          return { isValid: true, message: `Using model ${value}` };
        } else {
          return { isValid: false, message: `Unknown model ${value}, using default` };
        }

      case 'PORT':
        const port = parseInt(value);
        if (isNaN(port) || port < 1 || port > 65535) {
          return { isValid: false, message: 'Invalid port number' };
        }
        return { isValid: true, message: `Using port ${port}` };

      case 'NODE_ENV':
        const validEnvs = ['development', 'production', 'test'];
        if (validEnvs.includes(value)) {
          return { isValid: true, message: `Running in ${value} mode` };
        } else {
          return { isValid: false, message: `Unknown environment: ${value}` };
        }

      case 'MAX_DOCUMENTS':
      case 'CHUNK_SIZE':
      case 'CHUNK_OVERLAP':
      case 'MAX_CONTEXT_LENGTH':
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 0) {
          return { isValid: false, message: 'Must be a positive number' };
        }
        return { isValid: true, message: `Set to ${numValue}` };

      case 'SIMILARITY_THRESHOLD':
        const threshold = parseFloat(value);
        if (isNaN(threshold) || threshold < 0 || threshold > 1) {
          return { isValid: false, message: 'Must be a number between 0 and 1' };
        }
        return { isValid: true, message: `Set to ${threshold}` };

      case 'LOG_LEVEL':
        const validLevels = ['error', 'warn', 'info', 'debug'];
        if (validLevels.includes(value)) {
          return { isValid: true, message: `Log level set to ${value}` };
        } else {
          return { isValid: false, message: `Invalid log level: ${value}` };
        }

      default:
        return { isValid: true, message: `Value: ${value}` };
    }
  }

  getDefaultValue(varName) {
    const defaults = {
      'GEMINI_MODEL': 'gemini-1.5-flash',
      'PORT': '3000',
      'NODE_ENV': 'production',
      'FRONTEND_URL': '*',
      'MAX_DOCUMENTS': '1000',
      'CHUNK_SIZE': '500',
      'CHUNK_OVERLAP': '50',
      'MAX_CONTEXT_LENGTH': '4000',
      'SIMILARITY_THRESHOLD': '0.7',
      'LOG_LEVEL': 'info'
    };

    return defaults[varName] || null;
  }

  getEnvironmentSummary() {
    const summary = {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      geminiModel: process.env.GEMINI_MODEL,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      logLevel: process.env.LOG_LEVEL,
      ragConfig: {
        maxDocuments: process.env.MAX_DOCUMENTS,
        chunkSize: process.env.CHUNK_SIZE,
        chunkOverlap: process.env.CHUNK_OVERLAP,
        maxContextLength: process.env.MAX_CONTEXT_LENGTH,
        similarityThreshold: process.env.SIMILARITY_THRESHOLD
      },
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL
    };

    return summary;
  }

  // Method để check trong runtime
  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  isVercel() {
    return !!process.env.VERCEL_ENV;
  }

  getApiKeyMasked() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return 'Not configured';
    
    if (apiKey.length < 8) return 'Invalid format';
    
    return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
  }
}

module.exports = { envValidator: new EnvironmentValidator() };