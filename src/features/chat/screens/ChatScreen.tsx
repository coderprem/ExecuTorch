import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppTabHeader from '../../../components/AppTabHeader';
import { AppText } from '../../../components/AppText';
import ModelStatusRow from '../../../components/ModelStatusRow';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { useTheme } from '../../../theme/useTheme';
import { ThemeType } from '../../../theme/theme';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { QWEN2_5_0_5B_QUANTIZED, useLLM } from 'react-native-executorch';
import { mh, mw } from '../../../utils/dimensions';
import { SVGS } from '../../../utils/assetsPath';
import { log } from '../../../utils/logger';
import { Typography } from '../../../theme/typography';
import { ChatStrings } from '../../../utils/strings';
import { IS_IOS } from '../../../utils/device';
import { useModelStatusPresentation } from '../../../hooks/useModelStatusPresentation';
import { MODEL_APPROX_TOTAL_BYTES } from '../../../utils/modelStatusText';

type ChatScreenBodyProps = {
  onRetryModel: () => void;
};

const ChatScreenBody = ({ onRetryModel }: ChatScreenBodyProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const {
    isReady,
    isGenerating,
    response,
    sendMessage,
    downloadProgress,
    error,
  } = useLLM({
    model: QWEN2_5_0_5B_QUANTIZED,
  });
  log(response);

  const { statusText, statusDotColor, showRetry } = useModelStatusPresentation({
    theme,
    error,
    isReady,
    downloadProgress,
    approxTotalBytes: MODEL_APPROX_TOTAL_BYTES.qwen25_0_5b_quantized,
    readyLabel: ChatStrings.readyToChat,
  });

  const [input, setInput] = useState<string>('');

  return (
    <AppSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={IS_IOS ? 'padding' : undefined}
      >
        <AppTabHeader title={ScreenNames.CHAT} />

        <ModelStatusRow
          statusText={statusText}
          statusDotColor={statusDotColor}
          showRetry={showRetry}
          onRetry={onRetryModel}
        />

        <View style={styles.body}>
          <AppInput
            value={input}
            onChangeText={setInput}
            placeholder={ChatStrings.letStartChat}
            containerStyle={styles.textInput}
            inputStyle={styles.input}
            rightIcon={input.length > 0 ? SVGS.cross : undefined}
            onRightIconPress={() => setInput('')}
          />
          <AppButton
            title={ChatStrings.getResults}
            onPress={() => sendMessage(input)}
            disabled={!isReady || isGenerating || input.length === 0}
            buttonStyle={styles.actionButton}
          />
          <ScrollView
            style={styles.responseScroll}
            contentContainerStyle={styles.responseScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <AppText style={styles.resultsText}>{response}</AppText>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
};

const ChatScreen = () => {
  const [modelLoadKey, setModelLoadKey] = useState(0);
  return (
    <ChatScreenBody
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
    body: {
      flex: 1,
    },
    textInput: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.textPrimary,
      marginHorizontal: mw(20),
      marginBottom: mh(12),
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    input: {
      ...Typography.medium_14,
      color: theme.colors.textPrimary,
    },
    actionButton: {
      marginHorizontal: mw(20),
    },
    responseScroll: {
      flex: 1,
    },
    responseScrollContent: {
      paddingTop: mh(8),
      paddingBottom: mh(20),
    },
    resultsText: {
      color: theme.colors.textPrimary,
      marginHorizontal: mw(20),
    },
  });

export default ChatScreen;
