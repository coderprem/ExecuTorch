import React, { useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import { AppText } from '../../../components/AppText';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { useTheme } from '../../../theme/useTheme';
import { ThemeType } from '../../../theme/theme';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { QWEN2_5_0_5B_QUANTIZED, useLLM } from 'react-native-executorch';
import { mh, mw } from '../../../utils/dimensions';
import AppImage from '../../../components/AppImage';
import { SVGS } from '../../../utils/assetsPath';
import AppSpacer from '../../../components/AppSpacer';
import { log } from '../../../utils/logger';
import { Typography } from '../../../theme/typography';
import { ChatStrings } from '../../../utils/strings';

const ChatScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const { isReady, isGenerating, response, sendMessage, downloadProgress } = useLLM({ 
    model: QWEN2_5_0_5B_QUANTIZED 
  });  
  log(response)
  
  const [input, setInput] = useState<string>('');

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.text}>
            {ChatStrings.status} {isReady ? ChatStrings.readyToChat : ChatStrings.downloading.replace('{{progress}}', Math.round(downloadProgress * 100).toString())}
          </AppText>
          <TouchableOpacity onPress={toggleTheme}>
            {
              isDark ? <AppImage uri={SVGS.lightMode} width={mw(20)} height={mw(20)} color={theme.colors.textPrimary}/>: <AppImage uri={SVGS.darkMode} width={mw(20)} height={mw(20)}/>
            }
          </TouchableOpacity>
        </View>
        <AppSpacer height={mh(12)}/>
        <AppInput
          value={input}
          onChangeText={setInput}
          placeholder={ChatStrings.letStartChat}
          containerStyle={styles.textInput}
          inputStyle={styles.input}
          rightIcon={input.length > 0 ? SVGS.cross : undefined}
          onRightIconPress={() => setInput('')}
        />
        <AppSpacer height={mh(12)}/>
        <AppButton
          title={ChatStrings.getResults}
          onPress={() => sendMessage(input)}
          disabled={!isReady || isGenerating || input.length === 0}
        />
        <ScrollView>
          <AppText style={styles.resultsText}>{response}</AppText>
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
};

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 20,
    },
    text: {
      color: theme.colors.textPrimary
    },
    resultsText: {
      color: theme.colors.textPrimary,
      margin: mh(16),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    textInput: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.textPrimary
    },
    input: {
      ...Typography.medium_14,
      color: theme.colors.textPrimary
    }
  });

export default ChatScreen;
