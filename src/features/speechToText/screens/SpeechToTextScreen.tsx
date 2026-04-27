import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AudioRecorder } from 'react-native-audio-api';
import {
  useSpeechToText,
  WHISPER_TINY_EN_QUANTIZED,
} from 'react-native-executorch';

import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppTabHeader from '../../../components/AppTabHeader';
import { AppText } from '../../../components/AppText';
import ModelStatusRow from '../../../components/ModelStatusRow';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { ThemeType } from '../../../theme/theme';
import { useTheme } from '../../../theme/useTheme';
import { Typography } from '../../../theme/typography';
import { mh, mw } from '../../../utils/dimensions';
import { log } from '../../../utils/logger';
import { MODEL_APPROX_TOTAL_BYTES } from '../../../utils/modelStatusText';
import { AppPermission, requestPermission } from '../../../utils/permissions';
import {
  mergePcmChunksTo16kMono,
  type PcmChunk,
} from '../../../utils/resampleAudio';
import { SpeechToTextStrings } from '../../../utils/strings';
import { useModelStatusPresentation } from '../../../hooks/useModelStatusPresentation';

/** Minimum audio at 16 kHz for Whisper (~0.25 s). */
const MIN_SAMPLES_16K = 4000;

type UserFeedback =
  | { kind: 'error'; message: string }
  | { kind: 'info'; message: string };

function feedbackFromUnknown(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = String((err as { message: string }).message).trim();
    if (m.length > 0 && m.length < 120) {
      return m;
    }
  }
  return fallback;
}

type SpeechToTextScreenBodyProps = {
  onRetryModel: () => void;
};

const SpeechToTextScreenBody = ({ onRetryModel }: SpeechToTextScreenBodyProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userFeedback, setUserFeedback] = useState<UserFeedback | null>(null);

  const recorderRef = useRef(new AudioRecorder());
  const pcmChunksRef = useRef<PcmChunk[]>([]);
  const isFinalizingRef = useRef(false);

  const { error, isReady, isGenerating, downloadProgress, transcribe } =
    useSpeechToText({
      model: WHISPER_TINY_EN_QUANTIZED,
    });

  const isBusy = isGenerating || isProcessing;

  const { statusText, statusDotColor, showRetry } = useModelStatusPresentation({
    theme,
    error,
    isReady,
    downloadProgress,
    approxTotalBytes: MODEL_APPROX_TOTAL_BYTES.whisper_tiny_en_quantized,
    readyLabel: SpeechToTextStrings.readyToTranscribe,
  });

  useEffect(() => {
    const recorder = recorderRef.current;
    recorder.disableFileOutput();
    return () => {
      if (recorder.isRecording()) {
        recorder.clearOnAudioReady();
        recorder.stop();
      }
    };
  }, []);

  const registerPcmCapture = useCallback((): boolean => {
    const recorder = recorderRef.current;
    const result = recorder.onAudioReady(
      {
        sampleRate: 16000,
        channelCount: 1,
        bufferLength: 4096,
      },
      (event) => {
        const buf = event.buffer;
        const data = buf.getChannelData(0);
        const copy = new Float32Array(data.length);
        copy.set(data);
        pcmChunksRef.current.push({
          samples: copy,
          sampleRate: buf.sampleRate,
        });
      },
    );
    if (result.status === 'error') {
      log('onAudioReady registration failed:', result.message);
      setUserFeedback({
        kind: 'error',
        message: SpeechToTextStrings.recordingStartFailed,
      });
      return false;
    }
    return true;
  }, []);

  const stopRecordingAndTranscribe = useCallback(async () => {
    const recorder = recorderRef.current;
    if (isFinalizingRef.current) {
      return;
    }
    if (!recorder.isRecording()) {
      setIsRecording(false);
      return;
    }

    isFinalizingRef.current = true;
    recorder.clearOnAudioReady();

    const stopped = recorder.stop();
    setIsRecording(false);
    setIsProcessing(true);
    setUserFeedback(null);

    if (stopped.status !== 'success') {
      log('Recording stop failed:', stopped.status === 'error' ? stopped.message : stopped);
      setUserFeedback({
        kind: 'error',
        message: SpeechToTextStrings.recordingStopFailed,
      });
      isFinalizingRef.current = false;
      setIsProcessing(false);
      return;
    }

    try {
      const waveform = mergePcmChunksTo16kMono(pcmChunksRef.current);
      pcmChunksRef.current = [];

      if (waveform.length < MIN_SAMPLES_16K) {
        setTranscript('');
        setUserFeedback({
          kind: 'info',
          message: SpeechToTextStrings.recordingTooShort,
        });
        return;
      }

      const result = await transcribe(waveform);
      const text = (result.text ?? '').trim();
      setTranscript(text);
      if (text.length === 0) {
        setUserFeedback({
          kind: 'info',
          message: SpeechToTextStrings.noSpeechRecognized,
        });
      }
    } catch (e) {
      log('Transcription error:', e);
      setTranscript('');
      setUserFeedback({
        kind: 'error',
        message: feedbackFromUnknown(
          e,
          SpeechToTextStrings.transcriptionFailed,
        ),
      });
    } finally {
      isFinalizingRef.current = false;
      setIsProcessing(false);
    }
  }, [transcribe]);

  const startRecording = useCallback(async () => {
    if (!isReady || isGenerating) {
      return;
    }
    const permitted = await requestPermission(AppPermission.MICROPHONE);
    if (!permitted) {
      setUserFeedback({
        kind: 'error',
        message: SpeechToTextStrings.microphoneDenied,
      });
      return;
    }

    setTranscript('');
    setUserFeedback(null);
    pcmChunksRef.current = [];
    isFinalizingRef.current = false;

    const recorder = recorderRef.current;
    const pcmOk = registerPcmCapture();
    if (!pcmOk) {
      return;
    }

    const started = recorder.start();
    if (started.status === 'error') {
      log('Recording start failed:', started.message);
      recorder.clearOnAudioReady();
      setUserFeedback({
        kind: 'error',
        message: SpeechToTextStrings.recordingStartFailed,
      });
      return;
    }

    setIsRecording(true);
  }, [registerPcmCapture, isGenerating, isReady]);

  const onPressRecordControl = useCallback(async () => {
    if (!isReady || isGenerating) {
      return;
    }
    if (isRecording) {
      await stopRecordingAndTranscribe();
      return;
    }
    await startRecording();
  }, [
    isGenerating,
    isReady,
    isRecording,
    startRecording,
    stopRecordingAndTranscribe,
  ]);

  const controlLabel = useMemo(() => {
    if (isBusy) {
      return SpeechToTextStrings.transcribing;
    }
    if (isRecording) {
      return SpeechToTextStrings.recording;
    }
    return SpeechToTextStrings.tapToRecord;
  }, [isBusy, isRecording]);

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppTabHeader title={ScreenNames.SPEECH_TO_TEXT} />

        <ModelStatusRow
          statusText={statusText}
          statusDotColor={statusDotColor}
          showRetry={showRetry}
          onRetry={onRetryModel}
        />

        {isBusy ? (
          <View
            style={styles.processingBanner}
            accessibilityRole="progressbar"
            accessibilityLabel={SpeechToTextStrings.processingRecording}
          >
            <ActivityIndicator color={theme.colors.primary} style={styles.processingSpinner} />
            <AppText style={styles.processingText}>
              {SpeechToTextStrings.processingRecording}
            </AppText>
          </View>
        ) : null}

        {userFeedback ? (
          <View
            style={[
              styles.feedbackBanner,
              userFeedback.kind === 'error'
                ? styles.feedbackError
                : styles.feedbackInfo,
            ]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <AppText
              style={[
                styles.feedbackText,
                userFeedback.kind === 'error'
                  ? styles.feedbackTextError
                  : styles.feedbackTextInfo,
              ]}
            >
              {userFeedback.message}
            </AppText>
          </View>
        ) : null}

        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              (!isReady || isBusy) && styles.recordButtonDisabled,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={onPressRecordControl}
            disabled={!isReady || isBusy}
            accessibilityRole="button"
            accessibilityLabel={
              isRecording ? 'Stop recording and transcribe' : 'Start recording'
            }
            activeOpacity={0.8}
          >
            {isBusy ? (
              <AppText style={[styles.recordIcon, styles.recordIconBusy]}>⋯</AppText>
            ) : (
              <AppText style={styles.recordIcon}>{isRecording ? '⏹' : '🎙️'}</AppText>
            )}
          </TouchableOpacity>
          <AppText style={styles.actionText} numberOfLines={1}>
            {controlLabel}
          </AppText>
          <AppText style={styles.hintText}>{SpeechToTextStrings.recordStopHint}</AppText>
        </View>

        <ScrollView
          style={styles.transcriptScroll}
          contentContainerStyle={styles.transcriptScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {transcript.length > 0 ? (
            <AppText style={styles.transcript}>{transcript}</AppText>
          ) : !isBusy && !userFeedback ? (
            <AppText style={styles.transcriptPlaceholder}>
              {SpeechToTextStrings.transcriptPlaceholder}
            </AppText>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
};

const SpeechToTextScreen = () => {
  const [modelLoadKey, setModelLoadKey] = useState(0);
  return (
    <SpeechToTextScreenBody
      key={modelLoadKey}
      onRetryModel={() => setModelLoadKey((k) => k + 1)}
    />
  );
};

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    processingBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: mh(10),
      paddingHorizontal: mw(20),
      marginBottom: mh(8),
    },
    processingSpinner: {
      marginRight: mw(10),
    },
    processingText: {
      color: theme.colors.textSecondary,
      ...Typography.medium_14,
      flex: 1,
    },
    feedbackBanner: {
      marginHorizontal: mw(20),
      marginBottom: mh(10),
      paddingVertical: mh(10),
      paddingHorizontal: mw(14),
      borderRadius: 12,
      borderWidth: 1,
    },
    feedbackError: {
      backgroundColor: `${theme.colors.error}18`,
      borderColor: theme.colors.error,
    },
    feedbackInfo: {
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.outline,
    },
    feedbackText: {
      ...Typography.regular_14,
      lineHeight: 20,
    },
    feedbackTextError: {
      color: theme.colors.error,
    },
    feedbackTextInfo: {
      color: theme.colors.textSecondary,
    },
    bottomControls: {
      alignItems: 'center',
      paddingBottom: mh(12),
      paddingTop: mh(10),
      paddingHorizontal: mw(20),
    },
    recordButton: {
      width: mw(72),
      height: mw(72),
      borderRadius: mw(36),
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: mh(12),
    },
    recordButtonDisabled: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    recordButtonActive: {
      backgroundColor: theme.colors.error,
    },
    recordIcon: {
      ...Typography.medium_24,
    },
    recordIconBusy: {
      opacity: 0.45,
    },
    actionText: {
      color: theme.colors.textSecondary,
      ...Typography.medium_14,
      textAlign: 'center',
    },
    hintText: {
      color: theme.colors.textSecondary,
      ...Typography.regular_12,
      textAlign: 'center',
      marginTop: mh(8),
      lineHeight: 18,
    },
    transcriptScroll: {
      flex: 1,
    },
    transcriptScrollContent: {
      paddingHorizontal: mw(20),
      paddingBottom: mh(40),
    },
    transcript: {
      color: theme.colors.textPrimary,
      ...Typography.regular_16,
      lineHeight: 26,
    },
    transcriptPlaceholder: {
      color: theme.colors.textSecondary,
      ...Typography.regular_14,
      fontStyle: 'italic',
    },
  });

export default SpeechToTextScreen;
