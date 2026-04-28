import { useMemo } from 'react';
import { ThemeType } from '../theme/theme';
import {
  buildModelStatusText,
  isModelStatusShowingReadyState,
} from '../utils/modelStatusText';

type Args = {
  theme: ThemeType;
  error: { message: string } | null | undefined;
  isReady: boolean;
  downloadProgress: number;
  approxTotalBytes: number;
  readyLabel: string;
};

export function useModelStatusPresentation({
  theme,
  error,
  isReady,
  downloadProgress,
  approxTotalBytes,
  readyLabel,
}: Args) {
  const statusText = useMemo(
    () =>
      buildModelStatusText({
        errorMessage: error?.message,
        isReady,
        downloadProgress,
        approxTotalBytes,
        readyLabel,
      }),
    [error?.message, isReady, downloadProgress, approxTotalBytes, readyLabel],
  );

  const statusDotColor = useMemo(() => {
    const errorMessage = error?.message;
    if (error) {
      return theme.colors.error;
    }
    if (
      isModelStatusShowingReadyState({
        errorMessage,
        isReady,
        downloadProgress,
      })
    ) {
      return theme.colors.success;
    }
    return theme.colors.warning;
  }, [theme, error, isReady, downloadProgress]);

  const showRetry = Boolean(error);

  return { statusText, statusDotColor, showRetry };
}
