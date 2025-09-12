import { z } from 'zod';

// Comprehensive input validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(3, 'Email must be at least 3 characters')
  .max(320, 'Email must not exceed 320 characters')
  .refine((email) => {
    // Additional email security checks
    const suspiciousPatterns = [
      /[<>\"']/,  // HTML/XSS characters
      /javascript:/i,
      /data:/i,
      /vbscript:/i
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, 'Email contains invalid characters');

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must not exceed 128 characters')
  .refine((password) => /[A-Z]/.test(password), 'Password must contain at least one uppercase letter')
  .refine((password) => /[a-z]/.test(password), 'Password must contain at least one lowercase letter')
  .refine((password) => /\d/.test(password), 'Password must contain at least one number')
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), 'Password must contain at least one special character')
  .refine((password) => {
    // Check for common weak patterns
    const weakPatterns = [
      /123456/,
      /password/i,
      /admin/i,
      /qwerty/i,
      /(.)\1{2,}/ // Repeated characters
    ];
    return !weakPatterns.some(pattern => pattern.test(password));
  }, 'Password contains weak patterns');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
  .refine((username) => {
    // Prevent XSS and injection attempts
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /[<>\"']/
    ];
    return !maliciousPatterns.some(pattern => pattern.test(username));
  }, 'Username contains invalid characters');

export const productNameSchema = z
  .string()
  .min(1, 'Product name is required')
  .max(200, 'Product name must not exceed 200 characters')
  .refine((name) => {
    // Sanitize product names
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /[<>]/
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(name));
  }, 'Product name contains invalid characters');

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL must not exceed 2048 characters')
  .refine((url) => {
    // Validate URL protocols
    const allowedProtocols = ['http:', 'https:'];
    try {
      const urlObj = new URL(url);
      return allowedProtocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  }, 'Only HTTP and HTTPS URLs are allowed')
  .refine((url) => {
    // Prevent malicious URLs
    const maliciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i
    ];
    return !maliciousPatterns.some(pattern => pattern.test(url));
  }, 'URL contains invalid protocol');

export const descriptionSchema = z
  .string()
  .max(5000, 'Description must not exceed 5000 characters')
  .refine((desc) => {
    // Basic HTML sanitization check
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    return !dangerousPatterns.some(pattern => pattern.test(desc));
  }, 'Description contains potentially dangerous content');

// Input sanitization utilities
export class InputSanitizer {
  /**
   * Sanitize HTML input to prevent XSS
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/[<>\"']/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  /**
   * Sanitize SQL-like input to prevent injection
   */
  static sanitizeSQL(input: string): string {
    return input
      .replace(/['";\\]/g, '')
      .replace(/\b(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE)\b/gi, '')
      .trim();
  }

  /**
   * Validate and sanitize file names
   */
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/\.+/g, '.')
      .substring(0, 255);
  }

  /**
   * Validate IP address format
   */
  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Rate limiting key generation
   */
  static generateRateLimitKey(identifier: string, action: string): string {
    return `${this.sanitizeSQL(identifier)}_${this.sanitizeSQL(action)}`;
  }
}

// Validation middleware for forms
export const validateInput = {
  email: (value: string) => {
    try {
      emailSchema.parse(value);
      return { isValid: true, error: null };
    } catch (error: any) {
      return { 
        isValid: false, 
        error: error.issues?.[0]?.message || 'Invalid email' 
      };
    }
  },

  password: (value: string) => {
    try {
      passwordSchema.parse(value);
      return { isValid: true, error: null };
    } catch (error: any) {
      return { 
        isValid: false, 
        error: error.issues?.[0]?.message || 'Invalid password' 
      };
    }
  },

  username: (value: string) => {
    try {
      usernameSchema.parse(value);
      return { isValid: true, error: null };
    } catch (error: any) {
      return { 
        isValid: false, 
        error: error.issues?.[0]?.message || 'Invalid username' 
      };
    }
  },

  productName: (value: string) => {
    try {
      productNameSchema.parse(value);
      return { isValid: true, error: null };
    } catch (error: any) {
      return { 
        isValid: false, 
        error: error.issues?.[0]?.message || 'Invalid product name' 
      };
    }
  },

  url: (value: string) => {
    try {
      urlSchema.parse(value);
      return { isValid: true, error: null };
    } catch (error: any) {
      return { 
        isValid: false, 
        error: error.issues?.[0]?.message || 'Invalid URL' 
      };
    }
  }
};

export default InputSanitizer;