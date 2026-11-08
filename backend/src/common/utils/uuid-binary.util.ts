import { randomUUID } from 'crypto';
import { ValueTransformer } from 'typeorm';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const uuidBinaryTransformer: ValueTransformer = {
  to: (value: string | null | undefined): Buffer | null => uuidToBinary(value),
  from: (value: Buffer | null): string | null => binaryToUuid(value),
};

export const createExternalId = (): string => randomUUID();

export const uuidToBinary = (
  value: string | null | undefined,
): Buffer | null => {
  if (!value) return null;
  if (!UUID_PATTERN.test(value)) throw new TypeError('Invalid UUID');
  return Buffer.from(value.replaceAll('-', ''), 'hex');
};

export const binaryToUuid = (value: Buffer | null): string | null => {
  if (!value) return null;
  const hex = value.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
};
