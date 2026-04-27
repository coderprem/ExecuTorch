import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AudioContext } from 'react-native-audio-api';
import {
  useTextToSpeech,
  KOKORO_MEDIUM,
  KOKORO_VOICE_AF_HEART,
} from 'react-native-executorch';

import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppTabHeader from '../../../components/AppTabHeader';
import { AppText } from '../../../components/AppText';
import ModelStatusRow from '../../../components/ModelStatusRow';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { ThemeType } from '../../../theme/theme';
import { useTheme } from '../../../theme/useTheme';
import { mh, mw } from '../../../utils/dimensions';
import { TextToSpeechStrings } from '../../../utils/strings';
import { Typography } from '../../../theme/typography';
import { log } from '../../../utils/logger';
import { useModelStatusPresentation } from '../../../hooks/useModelStatusPresentation';
import { MODEL_APPROX_TOTAL_BYTES } from '../../../utils/modelStatusText';

const audioContext = new AudioContext({ sampleRate: 24000 });

type TextToSpeechScreenBodyProps = {
  onRetryModel: () => void;
};

const TextToSpeechScreenBody = ({ onRetryModel }: TextToSpeechScreenBodyProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const { error, isReady, downloadProgress, forward } = useTextToSpeech({
    model: KOKORO_MEDIUM,
    voice: KOKORO_VOICE_AF_HEART,
  });

  const { statusText, statusDotColor, showRetry } = useModelStatusPresentation({
    theme,
    error,
    isReady,
    downloadProgress,
    approxTotalBytes: MODEL_APPROX_TOTAL_BYTES.kokoro_medium,
    readyLabel: TextToSpeechStrings.readyToSpeak,
  });

  const handleSpeech = async () => {
    if (!text.trim() || isPlaying || !isReady) return;

    try {
      setIsPlaying(true);
      const speed = 0.72;

      const waveform = await forward({ text, speed });

      const audioBuffer = audioContext.createBuffer(1, waveform.length, 24000);
      audioBuffer.getChannelData(0).set(waveform);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.onEnded = () => {
        setIsPlaying(false);
      };

      source.start();
    } catch (err) {
      log('TTS Error:', err);
      setIsPlaying(false);
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppTabHeader title={ScreenNames.TEXT_TO_SPEECH} />

        <ModelStatusRow
          statusText={statusText}
          statusDotColor={statusDotColor}
          showRetry={showRetry}
          onRetry={onRetryModel}
        />

        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={TextToSpeechStrings.typeSomethingToHearIt}
            placeholderTextColor={theme.colors.textSecondary}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[
              styles.playButton,
              (!text.trim() || !isReady) && styles.playButtonDisabled,
              isPlaying && styles.playButtonActive,
            ]}
            onPress={handleSpeech}
            disabled={!text.trim() || !isReady || isPlaying}
            activeOpacity={0.8}
          >
            <AppText style={styles.playIcon}>{isPlaying ? '🔊' : '▶️'}</AppText>
          </TouchableOpacity>
          <AppText style={styles.actionText} numberOfLines={1}>
            {isPlaying ? TextToSpeechStrings.speaking : TextToSpeechStrings.tapToPlay}
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
};

const TextToSpeechScreen = () => {
  const [modelLoadKey, setModelLoadKey] = useState(0);
  return (
    <TextToSpeechScreenBody
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
    inputCard: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      marginHorizontal: mw(20),
      marginBottom: mh(20),
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: mw(20),
    },
    textInput: {
      flex: 1,
      color: theme.colors.textPrimary,
      ...Typography.regular_16,
      lineHeight: 28,
    },
    bottomControls: {
      alignItems: 'center',
      paddingBottom: mh(40),
      paddingTop: mh(10),
    },
    playButton: {
      width: mw(72),
      height: mw(72),
      borderRadius: mw(36),
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: mh(12),
    },
    playButtonDisabled: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    playButtonActive: {
      backgroundColor: theme.colors.success,
    },
    playIcon: {
      ...Typography.medium_24,
    },
    actionText: {
      color: theme.colors.textSecondary,
      ...Typography.medium_14,
    },
  });

export default TextToSpeechScreen;
