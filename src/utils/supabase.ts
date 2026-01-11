import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { AppError } from '../middleware/errorHandler';

// Initialize Supabase client with service role key for server-side operations
let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new AppError(
        'Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.',
        500
      );
    }

    supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
};

export interface UploadFileOptions {
  file: Express.Multer.File;
  bucket: string;
  folder?: string;
  fileName?: string;
}

export interface UploadFileResult {
  path: string;
  publicUrl: string;
}

/**
 * Upload file to Supabase Storage
 * @param options Upload options
 * @returns Public URL of the uploaded file
 */
export const uploadFileToSupabase = async (
  options: UploadFileOptions
): Promise<UploadFileResult> => {
  const { file, bucket, folder, fileName } = options;
  const supabase = getSupabaseClient();

  // Validate file buffer exists (required for memory storage)
  if (!file.buffer) {
    throw new AppError('File buffer is missing. Make sure multer is configured with memory storage.', 400);
  }

  // Generate unique filename if not provided
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const extension = file.originalname.split('.').pop() || 'bin';
  const finalFileName = fileName || `${file.fieldname}-${uniqueSuffix}.${extension}`;
  const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // Don't overwrite existing files
      cacheControl: '3600', // Cache for 1 hour
    });

    if (error) {
      throw new AppError(`Failed to upload file to Supabase: ${error.message}`, 500);
    }

    if (!data) {
      throw new AppError('Upload succeeded but no data returned from Supabase', 500);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
};

/**
 * Delete file from Supabase Storage
 * @param bucket Bucket name
 * @param filePath Path to the file in the bucket
 */
export const deleteFileFromSupabase = async (
  bucket: string,
  filePath: string
): Promise<void> => {
  const supabase = getSupabaseClient();

  try {
    // Extract path from URL if full URL is provided
    let path = filePath;
    if (filePath.startsWith('http')) {
      // Extract path from Supabase public URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlPattern = `/storage/v1/object/public/${bucket}/`;
      const urlParts = filePath.split(urlPattern);
      if (urlParts.length === 2) {
        // Extract full path including folder structure (e.g., profiles/filename.png)
        path = urlParts[1].split('?')[0]; // Remove query parameters if any
      } else {
        // Fallback: try to extract just the filename
        const pathParts = filePath.split('/');
        path = pathParts[pathParts.length - 1].split('?')[0];
      }
    } else if (filePath.startsWith('/uploads/')) {
      // Handle old local path format: /uploads/profiles/filename.png
      // Extract path after /uploads/ to preserve folder structure
      const pathParts = filePath.replace('/uploads/', '').split('/');
      path = pathParts.join('/'); // Preserve folder structure
    }

    // If path is empty, skip deletion
    if (!path) {
      console.warn('Empty path provided for deletion, skipping');
      return;
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      // Don't throw error if file doesn't exist (might have been deleted already)
      if (
        error.message.includes('not found') ||
        error.message.includes('does not exist') ||
        error.message.includes('No such file')
      ) {
        console.warn(`File not found in Supabase Storage: ${path}`);
        return;
      }
      throw new AppError(`Failed to delete file from Supabase: ${error.message}`, 500);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
};

/**
 * Get public URL from Supabase Storage path
 * @param bucket Bucket name
 * @param filePath Path to the file in the bucket
 * @returns Public URL
 */
export const getSupabasePublicUrl = (bucket: string, filePath: string): string => {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

