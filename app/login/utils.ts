export const formatPhoneNumber = (input: string): string => {
  // Remove all non-digit characters
  const cleaned = input.replace(/\D/g, '');
  
  // Format as +1 (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return input;
};

export const validatePhoneNumber = (number: string): boolean => {
  // Remove formatting to check E.164 format
  const cleaned = number.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('1');
};

export const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/billing-not-enabled':
      return 'Phone authentication is not enabled for this project.';
    case 'auth/invalid-phone-number':
      return 'Invalid phone number. Please check and try again.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Code has expired. Please request a new one.';
    default:
      return 'An error occurred. Please try again.';
  }
}; 