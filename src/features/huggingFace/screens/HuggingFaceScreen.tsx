import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { textToImage } from '@huggingface/inference';
import { useNetInfo } from '@react-native-community/netinfo';

import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppTabHeader from '../../../components/AppTabHeader';
import AppButton from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { HF_INFERENCE_API_KEY } from '../../../config/huggingFace';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { ThemeType } from '../../../theme/theme';
import { useTheme } from '../../../theme/useTheme';
import { Typography } from '../../../theme/typography';
import { mh, mw } from '../../../utils/dimensions';
import { log } from '../../../utils/logger';
import { HuggingFaceStrings } from '../../../utils/strings';

function feedbackFromUnknown(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = String((err as { message: string }).message).trim();
    if (m.length > 0 && m.length < 160) {
      return m;
    }
  }
  return HuggingFaceStrings.generationFailed;
}

function useOfflineBlocking(): boolean {
  const netInfo = useNetInfo();
  return (
    netInfo.isConnected === false || netInfo.isInternetReachable === false
  );
}

const PREVIEW_MAX = 280;

export default function HuggingFaceScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [prompt, setPrompt] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const isOffline = useOfflineBlocking();
  const hasToken = HF_INFERENCE_API_KEY.trim().length > 0;

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (
      !trimmed ||
      !hasToken ||
      isOffline ||
      isGenerating
    ) {
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);
    setImageUri(null);

    try {
      const result = await textToImage(
        {
          accessToken: HF_INFERENCE_API_KEY,
          provider: 'fal-ai',
          model: 'black-forest-labs/FLUX.1-dev',
          inputs: trimmed,
          parameters: {
            num_inference_steps: 28,
            guidance_scale: 4,
          },
        },
        { outputType: 'url' },
      );

      if (
        typeof result !== 'string' ||
        result.length === 0 ||
        !/^https?:\/\//i.test(result)
      ) {
        setGenerationError(HuggingFaceStrings.generationFailed);
        return;
      }

      setImageUri(result);
    } catch (error) {
      log('Hugging Face text-to-image error:', error);
      setGenerationError(feedbackFromUnknown(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const disableGenerate =
    !hasToken ||
    isOffline ||
    isGenerating ||
    prompt.trim().length === 0;

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppTabHeader title={ScreenNames.HUGGING_FACE} />

        {isOffline ? (
          <View
            style={[styles.banner, styles.bannerOffline]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <AppText style={styles.bannerText}>{HuggingFaceStrings.offlineMessage}</AppText>
          </View>
        ) : null}

        {!hasToken ? (
          <View
            style={[styles.banner, styles.bannerInfo]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <AppText style={styles.bannerTextMuted}>
              {HuggingFaceStrings.tokenMissing}
            </AppText>
          </View>
        ) : null}

        {generationError ? (
          <View
            style={[styles.banner, styles.bannerError]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <AppText style={styles.bannerTextError}>{generationError}</AppText>
          </View>
        ) : null}

        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            multiline
            editable={!isOffline && hasToken}
            placeholder={HuggingFaceStrings.placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            textAlignVertical="top"
          />
        </View>

        <AppButton
          title={
            isGenerating
              ? HuggingFaceStrings.generating
              : HuggingFaceStrings.generate
          }
          onPress={() => {
            handleGenerate().catch(() => {
              /* errors surfaced in state */
            });
          }}
          disabled={disableGenerate}
          buttonStyle={styles.generateButton}
        />

        <ScrollView
          style={styles.previewScroll}
          contentContainerStyle={styles.previewScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {isGenerating ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : null}
          {imageUri ? (
            <Image
              accessibilityLabel="Generated image preview"
              style={styles.previewImage}
              source={{ uri: imageUri }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    banner: {
      marginHorizontal: mw(20),
      marginBottom: mh(10),
      paddingVertical: mh(10),
      paddingHorizontal: mw(14),
      borderRadius: 12,
      borderWidth: 1,
    },
    bannerOffline: {
      backgroundColor: `${theme.colors.warning}18`,
      borderColor: theme.colors.warning,
    },
    bannerInfo: {
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.outline,
    },
    bannerError: {
      backgroundColor: `${theme.colors.error}18`,
      borderColor: theme.colors.error,
    },
    bannerText: {
      ...Typography.regular_14,
      lineHeight: 20,
      color: theme.colors.textPrimary,
    },
    bannerTextMuted: {
      ...Typography.regular_14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
    bannerTextError: {
      ...Typography.regular_14,
      lineHeight: 20,
      color: theme.colors.error,
    },
    inputCard: {
      flexGrow: 0,
      minHeight: mh(120),
      backgroundColor: theme.colors.surfaceVariant,
      marginHorizontal: mw(20),
      marginBottom: mh(12),
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: mw(20),
    },
    textInput: {
      minHeight: mh(80),
      color: theme.colors.textPrimary,
      ...Typography.regular_16,
      lineHeight: 28,
    },
    generateButton: {
      marginHorizontal: mw(20),
      marginBottom: mh(12),
    },
    previewScroll: {
      flex: 1,
    },
    previewScrollContent: {
      alignItems: 'center',
      paddingBottom: mh(40),
      paddingHorizontal: mw(20),
    },
    previewImage: {
      maxWidth: PREVIEW_MAX,
      maxHeight: PREVIEW_MAX,
      width: '100%',
      aspectRatio: 1,
      borderRadius: 16,
      marginTop: mh(8),
    },
  });
