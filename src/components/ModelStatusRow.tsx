import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { ThemeType } from '../theme/theme';
import { useTheme } from '../theme/useTheme';
import { mh, mw } from '../utils/dimensions';
import { Typography } from '../theme/typography';

type Props = {
  statusText: string;
  statusDotColor: string;
  showRetry?: boolean;
  onRetry?: () => void;
};

const ModelStatusRow = ({
  statusText,
  statusDotColor,
  showRetry = false,
  onRetry,
}: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
      <AppText style={styles.statusText}>{statusText}</AppText>
      {showRetry && onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryButton}
          accessibilityRole="button"
          accessibilityLabel="Retry model download"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppText style={styles.retryIcon}>🔄</AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const getStyles = (theme: ThemeType) =>
  StyleSheet.create({
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: mw(20),
      marginBottom: mh(16),
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    statusText: {
      color: theme.colors.textSecondary,
      ...Typography.regular_12,
      flex: 1,
      flexShrink: 1,
    },
    retryButton: {
      padding: 8,
      marginLeft: 4,
    },
    retryIcon: {
      ...Typography.regular_18,
    },
  });

export default ModelStatusRow;
