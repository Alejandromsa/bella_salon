/**
 * Utility for compressing and validating images before upload
 * Ensures images are under 5MB when converted to base64
 */

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    initialQuality?: number;
}

export interface CompressionResult {
    success: boolean;
    data?: string;
    error?: string;
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1920,
    initialQuality: 0.85
};

/**
 * Compresses an image file to ensure it's under the specified size
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with compression result
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const maxSizeBytes = (opts.maxSizeMB || 5) * 1024 * 1024;

    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            return {
                success: false,
                error: 'El archivo debe ser una imagen (JPG, PNG, GIF, WebP)'
            };
        }

        // Validate file size (before base64 conversion, which adds ~33%)
        const estimatedBase64Size = file.size * 1.37; // 33% overhead + margin

        // If file is already small enough, just convert to base64
        if (estimatedBase64Size < maxSizeBytes) {
            const base64 = await fileToBase64(file);
            return {
                success: true,
                data: base64,
                originalSize: file.size,
                compressedSize: file.size,
                compressionRatio: 1
            };
        }

        // File needs compression
        const originalSize = file.size;
        let quality = opts.initialQuality || 0.85;
        let maxDimension = opts.maxWidthOrHeight || 1920;
        let compressedBase64: string;
        let attempts = 0;
        const maxAttempts = 5;

        do {
            attempts++;
            compressedBase64 = await compressImageToBase64(file, quality, maxDimension);

            // Calculate actual base64 size (in bytes)
            const base64Size = (compressedBase64.length * 3) / 4;

            if (base64Size <= maxSizeBytes) {
                // Success! Image is now under the limit
                return {
                    success: true,
                    data: compressedBase64,
                    originalSize,
                    compressedSize: Math.round(base64Size),
                    compressionRatio: Number((originalSize / base64Size).toFixed(2))
                };
            }

            // Still too large, reduce quality and/or dimensions
            if (quality > 0.5) {
                quality -= 0.1; // Reduce quality
            } else {
                maxDimension = Math.floor(maxDimension * 0.8); // Reduce dimensions
            }

            // Prevent infinite loop
            if (maxDimension < 200) {
                return {
                    success: false,
                    error: 'No se pudo comprimir la imagen lo suficiente. Por favor, use una imagen más pequeña.'
                };
            }

        } while (attempts < maxAttempts);

        return {
            success: false,
            error: 'La imagen es demasiado grande. Por favor, use una imagen más pequeña.'
        };

    } catch (error) {
        console.error('Error compressing image:', error);
        return {
            success: false,
            error: 'Error al procesar la imagen. Por favor, intente con otra imagen.'
        };
    }
}

/**
 * Converts a File to base64 string without compression
 */
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Compresses an image using canvas
 */
function compressImageToBase64(
    file: File,
    quality: number,
    maxDimension: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }

                // Create canvas and draw image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64
                const base64 = canvas.toDataURL('image/jpeg', quality);
                resolve(base64);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
