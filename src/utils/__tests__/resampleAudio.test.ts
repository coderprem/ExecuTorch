import { mergePcmChunksTo16kMono } from '../resampleAudio';

describe('mergePcmChunksTo16kMono', () => {
  it('merges two 16 kHz chunks', () => {
    const a = new Float32Array([0, 1, 0, -1]);
    const b = new Float32Array([0.5, 0.5]);
    const merged = mergePcmChunksTo16kMono([
      { samples: a, sampleRate: 16000 },
      { samples: b, sampleRate: 16000 },
    ]);
    expect(merged.length).toBe(6);
    expect(merged[0]).toBe(0);
    expect(merged[4]).toBe(0.5);
  });
});
