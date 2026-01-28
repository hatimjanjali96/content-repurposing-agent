export const validateURL = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateFile = (file) => {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { isValid: true, error: null }; // File is optional
  }

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a PDF, DOCX, or TXT file.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Maximum size is 10MB.'
    };
  }

  return { isValid: true, error: null };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<[^>]*>/g, '');
};
