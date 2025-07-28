// Form validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && (!value || value.trim().length === 0)) {
    errors.push('This field is required');
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  if (value && rules.custom && !rules.custom(value)) {
    errors.push('Custom validation failed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};