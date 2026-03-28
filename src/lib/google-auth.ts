import { readFileSync, existsSync } from 'fs';
import path from 'path';

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

/**
 * Load Google service account credentials from either:
 * 1. GOOGLE_SERVICE_ACCOUNT_KEY env var (JSON string)
 * 2. GOOGLE_SERVICE_ACCOUNT_KEY_PATH env var (path to JSON file)
 * 3. service-account.json in project root
 */
export function getServiceAccountCredentials(): ServiceAccountCredentials | null {
  // Try env var first (inline JSON)
  const envKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (envKey) {
    try {
      // Handle both quoted and unquoted JSON
      const cleaned = envKey.trim().replace(/^['"]|['"]$/g, '');
      return JSON.parse(cleaned);
    } catch {
      // Might be multi-line / truncated — fall through to file
    }
  }

  // Try file path from env
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (keyPath) {
    try {
      const resolved = path.isAbsolute(keyPath) ? keyPath : path.resolve(process.cwd(), keyPath);
      if (existsSync(resolved)) {
        return JSON.parse(readFileSync(resolved, 'utf-8'));
      }
    } catch {
      // Fall through
    }
  }

  // Try default file in project root
  const defaultPath = path.resolve(process.cwd(), 'service-account.json');
  if (existsSync(defaultPath)) {
    try {
      return JSON.parse(readFileSync(defaultPath, 'utf-8'));
    } catch {
      // Fall through
    }
  }

  return null;
}
