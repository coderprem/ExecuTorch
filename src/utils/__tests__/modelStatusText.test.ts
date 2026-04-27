import {
  buildModelStatusText,
  formatDownloadedOverTotal,
  isModelStatusShowingReadyState,
} from '../modelStatusText';
import { CommonStrings } from '../strings';

describe('modelStatusText', () => {
  it('isModelStatusShowingReadyState matches text: 100% before isReady flips', () => {
    expect(
      isModelStatusShowingReadyState({
        errorMessage: undefined,
        isReady: false,
        downloadProgress: 1,
      }),
    ).toBe(true);
    expect(
      isModelStatusShowingReadyState({
        errorMessage: undefined,
        isReady: true,
        downloadProgress: 0,
      }),
    ).toBe(true);
    expect(
      isModelStatusShowingReadyState({
        errorMessage: 'fail',
        isReady: false,
        downloadProgress: 1,
      }),
    ).toBe(false);
  });

  it('formats downloaded over total in MB', () => {
    const oneMb = 1 * 1024 * 1024;
    const hundredMb = 100 * 1024 * 1024;
    expect(formatDownloadedOverTotal(oneMb, hundredMb)).toBe('1.0/100.0 MB');
  });

  it('shows checking copy when not ready and progress has not started yet', () => {
    const total = 100 * 1024 * 1024;
    expect(
      buildModelStatusText({
        errorMessage: undefined,
        isReady: false,
        downloadProgress: 0,
        approxTotalBytes: total,
        readyLabel: 'ready',
      }),
    ).toBe(`${CommonStrings.status}${CommonStrings.modelChecking}`);
  });

  it('shows ready label when progress is complete but isReady has not flipped yet', () => {
    const total = 100 * 1024 * 1024;
    expect(
      buildModelStatusText({
        errorMessage: undefined,
        isReady: false,
        downloadProgress: 1,
        approxTotalBytes: total,
        readyLabel: 'Ready to generate',
      }),
    ).toBe(`${CommonStrings.status}Ready to generate`);
  });

  it('combines percentage and downloaded/total while downloading', () => {
    const total = 100 * 1024 * 1024;
    expect(
      buildModelStatusText({
        errorMessage: undefined,
        isReady: false,
        downloadProgress: 0.01,
        approxTotalBytes: total,
        readyLabel: 'ready',
      }),
    ).toBe(`${CommonStrings.status}Downloading: 1% (1.0/100.0 MB)`);
  });

  it('shows load error without download fraction', () => {
    expect(
      buildModelStatusText({
        errorMessage: 'network failed',
        isReady: false,
        downloadProgress: 0,
        approxTotalBytes: 100,
        readyLabel: 'ready',
      }),
    ).toBe(`${CommonStrings.status}network failed`);
  });
});
