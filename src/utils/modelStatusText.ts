import { CommonStrings } from './strings';

/** Typical download footprint for bundled ExecuTorch artifacts (approximate). */
export const MODEL_DOWNLOAD_LABELS = {
  qwen25_0_5b_quantized: '380 MB',
  kokoro_medium: '90 MB',
  bk_sdm_tiny: '300 MB',
  whisper_tiny_en_quantized: '50 MB',
} as const;

/** Approximate total download size per model (bytes). Paired with progress for “downloaded/total”. */
export const MODEL_APPROX_TOTAL_BYTES = {
  qwen25_0_5b_quantized: 380 * 1024 * 1024,
  kokoro_medium: 90 * 1024 * 1024,
  bk_sdm_tiny: 300 * 1024 * 1024,
  whisper_tiny_en_quantized: 50 * 1024 * 1024,
} as const;

const GB = 1024 * 1024 * 1024;
const MB = 1024 * 1024;

/** Format bytes using the same unit as `referenceTotal` (single suffix), e.g. “12.5/380 MB”. */
export function formatDownloadedOverTotal(
  downloadedBytes: number,
  approxTotalBytes: number,
): string {
  if (approxTotalBytes >= GB) {
    return `${(downloadedBytes / GB).toFixed(2)}/${(approxTotalBytes / GB).toFixed(2)} GB`;
  }
  return `${(downloadedBytes / MB).toFixed(1)}/${(approxTotalBytes / MB).toFixed(1)} MB`;
}

export type BuildModelStatusParams = {
  errorMessage: string | null | undefined;
  isReady: boolean;
  downloadProgress: number;
  approxTotalBytes: number;
  readyLabel: string;
};

function normalizedDownloadProgress(downloadProgress: number): number {
  return typeof downloadProgress === 'number' && Number.isFinite(downloadProgress)
    ? downloadProgress
    : 0;
}

/**
 * True when UI should treat the model as “ready” for label + dot (aligned with {@link buildModelStatusText}).
 * Covers the window where download hits 100% before `isReady` flips.
 */
export function isModelStatusShowingReadyState({
  errorMessage,
  isReady,
  downloadProgress,
}: Pick<BuildModelStatusParams, 'errorMessage' | 'isReady' | 'downloadProgress'>): boolean {
  if (errorMessage) {
    return false;
  }
  if (isReady) {
    return true;
  }
  const pct = Math.round(normalizedDownloadProgress(downloadProgress) * 100);
  return pct >= 100;
}

export function buildModelStatusText({
  errorMessage,
  isReady,
  downloadProgress,
  approxTotalBytes,
  readyLabel,
}: BuildModelStatusParams): string {
  const prefix = CommonStrings.status;
  if (errorMessage) {
    return `${prefix}${errorMessage}`;
  }
  if (!isReady) {
    const progress = normalizedDownloadProgress(downloadProgress);
    const pct = Math.round(progress * 100);
    // Progress stays at 0 until native reports bytes or resolves cache — avoid misleading “Downloading: 0%”.
    if (pct <= 0) {
      return `${prefix}${CommonStrings.modelChecking}`;
    }
    // Often 100% is reported before `isReady` flips — avoid “Downloading: 100%”; show the same ready line as when loaded.
    if (pct >= 100) {
      return `${prefix}${readyLabel}`;
    }
    const total = Math.max(0, approxTotalBytes);
    const downloaded = Math.round(progress * total);
    if (total <= 0) {
      return `${prefix}Downloading: ${pct}%`;
    }
    const fraction = formatDownloadedOverTotal(downloaded, total);
    return `${prefix}Downloading: ${pct}% (${fraction})`;
  }
  return `${prefix}${readyLabel}`;
}
