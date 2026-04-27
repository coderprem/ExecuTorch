import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import { AppText } from '../../../components/AppText';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { ThemeType } from '../../../theme/theme';
import { useTheme } from '../../../theme/useTheme';

const SpeechToTextScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  
  return (
    <AppSafeAreaView style={styles.container}>
      <AppText style={styles.text}>
        {ScreenNames.SPEECH_TO_TEXT}
      </AppText>
    </AppSafeAreaView>
  );
};

const getStyles = (theme: ThemeType) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bgDark,
    },
    text: {
      color: theme.colors.textPrimary
    }
  });


export default SpeechToTextScreen;
