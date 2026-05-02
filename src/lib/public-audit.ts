import type { ValidationResult } from './types';

const FORBIDDEN_KEYS = ['raw_transcript', 'chain_of_thought', 'raw_logs', 'authorization', 'cookie', 'token'];
const SECRET_PATTERNS = [/gho_[A-Za-z0-9_]+/, /sk-[A-Za-z0-9_-]+/, /Bearer\s+[A-Za-z0-9._-]+/i];

function walk(value: unknown, visitor: (key: string, value: unknown) => void, key = ''): void {
  visitor(key, value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${key}[${index}]`));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([childKey, childValue]) => walk(childValue, visitor, childKey));
  }
}

export function validatePublicAuditArtifact(value: unknown): ValidationResult {
  const errors: string[] = [];
  walk(value, (key, nested) => {
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) errors.push(`Public audit artifact contains forbidden field ${key}.`);
    if (typeof nested === 'string' && SECRET_PATTERNS.some((pattern) => pattern.test(nested))) {
      errors.push(`Public audit artifact contains secret-like value at ${key}.`);
    }
  });
  return { ok: errors.length === 0, errors };
}
