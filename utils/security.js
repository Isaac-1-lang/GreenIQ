/**
 * Security Utilities for GreenIQ
 * Handles secure storage, data sanitization, and security best practices
 */

import * as SecureStore from 'expo-secure-store';

/**
 * Secure Storage Functions
 * Use these instead of AsyncStorage for sensitive data
 */

export const secureStorage = {
  /**
   * Save data securely
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   */
  async save(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('Secure storage save error:', error);
      return false;
    }
  },

  /**
   * Retrieve data securely
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   */
  async get(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },

  /**
   * Delete data securely
   * @param {string} key - Storage key
   */
  async delete(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Secure storage delete error:', error);
      return false;
    }
  },
};

/**
 * Input Sanitization
 * Prevent XSS and injection attacks
 */

export const sanitize = {
  /**
   * Sanitize text input
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  text(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },

  /**
   * Sanitize email
   * @param {string} email - Email input
   * @returns {string} Sanitized email
   */
  email(email) {
    if (typeof email !== 'string') return '';
    return email.toLowerCase().trim();
  },

  /**
   * Sanitize phone number
   * @param {string} phone - Phone input
   * @returns {string} Sanitized phone
   */
  phone(phone) {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d+]/g, ''); // Keep only digits and +
  },
};

/**
 * Validation Functions
 */

export const validate = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid
   */
  email(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate Rwandan phone number
   * @param {string} phone - Phone to validate
   * @returns {boolean} Is valid
   */
  phone(phone) {
    const phoneRegex = /^\+250[0-9]{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result
   */
  password(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = 
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers;

    return {
      isValid,
      strength: isValid ? (hasSpecialChar ? 'strong' : 'medium') : 'weak',
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  },
};

/**
 * Security Headers for API Requests
 */

export const getSecurityHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-App-Version': '1.0.0',
    'X-Platform': 'mobile',
  };
};

/**
 * Rate Limiting Helper
 * Prevent abuse by limiting request frequency
 */

class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   * @param {string} key - Unique identifier (e.g., user ID, IP)
   * @returns {boolean} Is allowed
   */
  isAllowed(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // Remove old requests outside time window
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  /**
   * Reset rate limit for a key
   * @param {string} key - Unique identifier
   */
  reset(key) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Data Encryption Helpers
 * For sensitive data that needs to be stored or transmitted
 */

export const crypto = {
  /**
   * Simple hash function for non-critical data
   * For production, use a proper crypto library
   * @param {string} data - Data to hash
   * @returns {string} Hashed data
   */
  simpleHash(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  },

  /**
   * Generate random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  },
};

/**
 * Security Best Practices Checklist
 */

export const securityChecklist = {
  // ✅ Use HTTPS for all API calls
  useHttps: true,
  
  // ✅ Store sensitive data in SecureStore
  useSecureStorage: true,
  
  // ✅ Validate all user inputs
  validateInputs: true,
  
  // ✅ Sanitize data before display
  sanitizeData: true,
  
  // ✅ Implement rate limiting
  rateLimiting: true,
  
  // ✅ Use strong password requirements
  strongPasswords: true,
  
  // ✅ Implement session timeout
  sessionTimeout: true,
  
  // ✅ Log security events
  securityLogging: true,
};

export default {
  secureStorage,
  sanitize,
  validate,
  getSecurityHeaders,
  rateLimiter,
  crypto,
  securityChecklist,
};
