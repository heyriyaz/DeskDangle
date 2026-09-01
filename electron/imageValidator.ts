import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  sanitizedDataUrl?: string;
  savedFilePath?: string;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

export class ImageValidator {
  private static getCustomCharmsDir(): string {
    const dir = path.join(app.getPath('userData'), 'custom-charms');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  public static validateAndSaveImage(
    rawImageDataUrl: string,
    charmId: string
  ): ImageValidationResult {
    try {
      if (!rawImageDataUrl || typeof rawImageDataUrl !== 'string') {
        return { valid: false, error: 'Invalid or empty image data.' };
      }

      const match = rawImageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return { valid: false, error: 'Image must be a valid base64 data URL.' };
      }

      const mimeType = match[1].toLowerCase();
      const base64Data = match[2];

      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return {
          valid: false,
          error: `Unsupported image format (${mimeType}). Supported formats: PNG, JPG, WebP, SVG.`,
        };
      }

      // Calculate approximate byte size from base64
      const approxBytes = (base64Data.length * 3) / 4;
      if (approxBytes > MAX_IMAGE_SIZE_BYTES) {
        return {
          valid: false,
          error: `Image exceeds maximum allowed size of 5MB (${(approxBytes / (1024 * 1024)).toFixed(1)}MB).`,
        };
      }

      // Decode buffer safely
      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length === 0) {
        return { valid: false, error: 'Image buffer is corrupted or empty.' };
      }

      // Determine safe extension
      let ext = 'png';
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('svg')) ext = 'svg';

      // Save safely in userData/custom-charms/
      const sanitizedId = charmId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${sanitizedId}-${Date.now()}.${ext}`;
      const targetDir = this.getCustomCharmsDir();
      const filePath = path.join(targetDir, filename);

      fs.writeFileSync(filePath, buffer);

      return {
        valid: true,
        sanitizedDataUrl: `data:${mimeType};base64,${base64Data}`,
        savedFilePath: filePath,
      };
    } catch (err: unknown) {
      console.error('[ImageValidator] Failed to validate image:', err);
      return {
        valid: false,
        error: err instanceof Error ? err.message : 'Unknown image processing error.',
      };
    }
  }

  public static deleteAllCustomCharmImages(): void {
    try {
      const dir = this.getCustomCharmsDir();
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const p = path.join(dir, file);
          if (fs.statSync(p).isFile()) {
            fs.unlinkSync(p);
          }
        }
      }
    } catch (err) {
      console.warn('[ImageValidator] Failed to delete custom charm files:', err);
    }
  }
}
