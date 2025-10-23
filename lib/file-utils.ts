/**
 * File utilities for handling file uploads and conversions
 */

export interface FileData {
  filename: string;
  content: string; // base64
  contentType: string;
  size: number;
}

/**
 * Convert a File object to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:mime/type;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convert a File object to FileData format for upload
 */
export async function fileToFileData(file: File): Promise<FileData> {
  const content = await fileToBase64(file);
  return {
    filename: file.name,
    content,
    contentType: file.type,
    size: file.size,
  };
}

/**
 * Validate file size before upload
 */
export function validateFileSize(file: File, maxSizeMB: number): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }
  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File "${file.name}" has an invalid type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  options: {
    maxSizeMB: number;
    allowedTypes: string[];
    maxTotalSizeMB?: number;
  }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate individual files
  for (const file of files) {
    const sizeValidation = validateFileSize(file, options.maxSizeMB);
    if (!sizeValidation.valid && sizeValidation.error) {
      errors.push(sizeValidation.error);
    }

    const typeValidation = validateFileType(file, options.allowedTypes);
    if (!typeValidation.valid && typeValidation.error) {
      errors.push(typeValidation.error);
    }
  }

  // Validate total size if specified
  if (options.maxTotalSizeMB) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalBytes = options.maxTotalSizeMB * 1024 * 1024;
    if (totalSize > maxTotalBytes) {
      errors.push(
        `Total file size is too large. Maximum total size is ${options.maxTotalSizeMB}MB.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Allowed file types for job applications
 */
export const JOB_APPLICATION_ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const JOB_APPLICATION_ALLOWED_TYPES_DISPLAY = 'PDF, DOC, DOCX';
export const JOB_APPLICATION_MAX_FILE_SIZE_MB = 5;
export const JOB_APPLICATION_MAX_TOTAL_SIZE_MB = 15;

