// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const validateForm = (formData: Record<string, any>) => {
  const errors: Record<string, string> = {};

  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (!formData.message?.trim()) {
    errors.message = 'Message is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// String utilities
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Class name utilities
export const cn = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Date utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Scroll utilities
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
