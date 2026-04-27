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
import {
  BK_SDM_TINY_VPRED_256,
  useTextToImage,
} from 'react-native-executorch';

import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppTabHeader from '../../../components/AppTabHeader';
import AppButton from '../../../components/AppButton';
import ModelStatusRow from '../../../components/ModelStatusRow';
import { useModelStatusPresentation } from '../../../hooks/useModelStatusPresentation';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { ThemeType } from '../../../theme/theme';
import { useTheme } from '../../../theme/useTheme';
import { Typography } from '../../../theme/typography';
import { mh, mw } from '../../../utils/dimensions';
import { log } from '../../../utils/logger';
import { MODEL_APPROX_TOTAL_BYTES } from '../../../utils/modelStatusText';
import { ImageGenerationStrings } from '../../../utils/strings';

const OUTPUT_SIZE = 256;

type ImageGeneratorScreenBodyProps = {
  onRetryModel: () => void;
};

const ImageGeneratorScreenBody = ({ onRetryModel }: ImageGeneratorScreenBodyProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [prompt, setPrompt] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const { isReady, isGenerating, downloadProgress, error, generate } = useTextToImage({
    model: BK_SDM_TINY_VPRED_256,
  });

  const { statusText, statusDotColor, showRetry } = useModelStatusPresentation({
    theme,
    error,
    isReady,
    downloadProgress,
    approxTotalBytes: MODEL_APPROX_TOTAL_BYTES.bk_sdm_tiny,
    readyLabel: ImageGenerationStrings.readyToGenerate,
  });

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || !isReady || isGenerating) {
      return;
    }
    try {
      const result = await generate(trimmed, OUTPUT_SIZE, 5);
      setImageBase64(result || null);
    } catch (e) {
      log('Text-to-image error:', e);
    }
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppTabHeader title={ScreenNames.IMAGE_GENERATOR} />

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
            placeholder={ImageGenerationStrings.describeImage}
            placeholderTextColor={theme.colors.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            textAlignVertical="top"
          />
        </View>

        <AppButton
          title={
            isGenerating
              ? ImageGenerationStrings.generating
              : ImageGenerationStrings.generate
          }
          onPress={handleGenerate}
          disabled={!isReady || isGenerating || prompt.trim().length === 0}
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
          {imageBase64 ? (
            <Image
              accessibilityLabel="Generated image preview"
              style={styles.previewImage}
              source={{ uri: `data:image/png;base64,${imageBase64}` }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
};

const ImageGeneratorScreen = () => {
  const [modelLoadKey, setModelLoadKey] = useState(0);
  return (
    <ImageGeneratorScreenBody
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
      width: OUTPUT_SIZE,
      height: OUTPUT_SIZE,
      borderRadius: 16,
      marginTop: mh(8),
    },
  });

export default ImageGeneratorScreen;
