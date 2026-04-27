export type PcmChunk = { samples: Float32Array; sampleRate: number };

/** Concatenate recorded chunks and resample to 16 kHz mono for Whisper. */
export function mergePcmChunksTo16kMono(chunks: PcmChunk[]): Float32Array {
  if (chunks.length === 0) {
    return new Float32Array(0);
  }
  let merged = resampleTo16kHz(chunks[0].samples, chunks[0].sampleRate);
  for (let i = 1; i < chunks.length; i++) {
    const part = resampleTo16kHz(chunks[i].samples, chunks[i].sampleRate);
    const combined = new Float32Array(merged.length + part.length);
    combined.set(merged);
    combined.set(part, merged.length);
    merged = combined;
  }
  return merged;
}

/** Linear resample mono PCM to Whisper’s expected 16 kHz sample rate. */
export function resampleTo16kHz(
  samples: Float32Array,
  sourceSampleRate: number,
): Float32Array {
  const targetRate = 16000;
  if (sourceSampleRate === targetRate) {
    return samples;
  }
  const ratio = sourceSampleRate / targetRate;
  const outLength = Math.floor(samples.length / ratio);
  const out = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcPos = i * ratio;
    const i0 = Math.floor(srcPos);
    const i1 = Math.min(i0 + 1, samples.length - 1);
    const t = srcPos - i0;
    out[i] = samples[i0] * (1 - t) + samples[i1] * t;
  }
  return out;
}
