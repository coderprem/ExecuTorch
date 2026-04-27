import React, { useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import AppImage from './AppImage';
import { AppText } from './AppText';
import { ThemeType } from '../theme/theme';
import { useTheme } from '../theme/useTheme';
import { Typography } from '../theme/typography';
import { mh, mw } from '../utils/dimensions';
import { SVGS } from '../utils/assetsPath';

export interface AppTabHeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

const AppTabHeader = ({ title, style }: AppTabHeaderProps) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const toggleLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <View style={[styles.row, style]}>
      <AppText style={styles.title} accessibilityRole="header">
        {title}
      </AppText>
      <TouchableOpacity
        onPress={toggleTheme}
        style={styles.themeToggle}
        accessibilityRole="button"
        accessibilityLabel={toggleLabel}
      >
        {isDark ? (
          <AppImage
            uri={SVGS.lightMode}
            width={mw(24)}
            height={mw(24)}
            color={theme.colors.onPrimaryContainer}
          />
        ) : (
          <AppImage
            uri={SVGS.darkMode}
            width={mw(24)}
            height={mw(24)}
            color={theme.colors.onPrimaryContainer}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: mw(20),
      paddingVertical: mh(16),
    },
    title: {
      color: theme.colors.textPrimary,
      ...Typography.medium_16,
    },
    themeToggle: {
      padding: 8,
    },
  });

export default AppTabHeader;
