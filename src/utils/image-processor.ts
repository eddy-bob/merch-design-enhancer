/// <reference types="node" />

/**
 * Utility functions for image processing
 */

/**
 * Converts various image input formats to Buffer
 */
export async function normalizeImageInput(
  image: Buffer | string,
): Promise<Buffer> {
  if (Buffer.isBuffer(image)) {
    return image;
  }

  // If it's a base64 string
  if (typeof image === 'string' && image.startsWith('data:')) {
    const base64Data = image.split(',')[1];
    return Buffer.from(base64Data, 'base64');
  }

  // If it's a base64 string without data URI
  if (
    typeof image === 'string' &&
    !image.includes('/') &&
    !image.includes('\\')
  ) {
    try {
      return Buffer.from(image, 'base64');
    } catch {
      // If base64 decode fails, treat as file path
    }
  }

  // If it's a file path
  if (typeof image === 'string') {
    const fs = await import('fs/promises');
    return await fs.readFile(image);
  }

  throw new Error(
    'Invalid image input format. Expected Buffer, base64 string, or file path.',
  );
}

/**
 * Detects MIME type from buffer
 */
export function detectMimeType(buffer: Buffer): string {
  // Check for common image signatures
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return 'image/jpeg';
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'image/gif';
  }
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46
  ) {
    return 'image/webp';
  }
  // Default to PNG
  return 'image/png';
}
