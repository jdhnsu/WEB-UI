import {
  HealthResponse,
  ServicesResponse,
  ProcessRequest,
  ProcessResponse,
  BatchProcessRequest,
  BatchProcessResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Health check - Check service running status and loaded AI services
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        'Health check failed',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Failed to connect to service',
      undefined,
      'CONNECTION_ERROR'
    );
  }
}

/**
 * Get available services - Retrieve all available AI services organized by category
 */
export async function getServices(): Promise<ServicesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch services',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Failed to fetch services',
      undefined,
      'FETCH_SERVICES_ERROR'
    );
  }
}

/**
 * Process a single image
 * @param image - Base64 encoded image (with or without data URI prefix)
 * @param service - Service ID to use for processing
 */
export async function processImage(
  image: string,
  service: string
): Promise<ProcessResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        service,
      } as ProcessRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Processing failed',
        response.status,
        'PROCESS_ERROR'
      );
    }

    if (!data.success) {
      throw new ApiError(
        data.error || 'Processing failed',
        response.status,
        'PROCESS_FAILED'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Image processing failed',
      undefined,
      'PROCESS_ERROR'
    );
  }
}

/**
 * Process multiple images in batch
 * @param images - Array of base64 encoded images
 * @param service - Service ID to apply to all images
 */
export async function batchProcessImages(
  images: string[],
  service: string
): Promise<BatchProcessResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/batch_process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images,
        service,
      } as BatchProcessRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Batch processing failed',
        response.status,
        'BATCH_PROCESS_ERROR'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      'Batch processing failed',
      undefined,
      'BATCH_PROCESS_ERROR'
    );
  }
}

/**
 * Convert File to base64 string with data URI prefix
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPG, PNG, or WEBP image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.',
    };
  }

  return { valid: true };
}

/**
 * Download base64 image as file
 */
export function downloadImage(base64Data: string, filename: string = 'processed-image.png') {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { ApiError };
