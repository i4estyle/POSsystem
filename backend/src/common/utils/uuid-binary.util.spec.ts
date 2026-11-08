import {
  binaryToUuid,
  createExternalId,
  uuidToBinary,
} from './uuid-binary.util';

describe('uuidBinaryTransformer', () => {
  it('round-trips a UUID through BINARY(16)', () => {
    const uuid = createExternalId();
    const binary = uuidToBinary(uuid);
    expect(Buffer.isBuffer(binary)).toBe(true);
    expect(binaryToUuid(binary)).toBe(uuid);
  });

  it('rejects invalid UUID input', () => {
    expect(() => uuidToBinary('not-a-uuid')).toThrow(TypeError);
  });
});
