import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import AppImage from '../../components/AppImage';
import { Typography } from '../../theme/typography';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import { mh, mw } from '../../utils/dimensions';
import { ThemeType } from '../../theme/theme';
import { useTheme } from '../../theme/useTheme';  
import { useMemo } from 'react';

type Props = {
  state: any;
  navigation: any;
  tabItems: TabItem[];
};

export type TabItem = {
  selectedIcon: any,
  unselectedIcon: any,
  defaultTitle: string
}

const ICON_SIZE = mw(24);

export default function AppTabBar({
  state,
  navigation,
  tabItems,
}: Props) {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <AppSafeAreaView edges={['bottom']}>
        <View style={styles.tabItemsRow}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const apiItem = tabItems[index];

            let label;
            let iconNode;
            
            // API TABS
            if (apiItem) {
              const hasApiImage =
                apiItem.selectedIcon && apiItem.unselectedIcon;

              if (hasApiImage) {
                iconNode = (
                  <AppImage
                    uri={
                      isFocused
                        ? apiItem.selectedIcon
                        : apiItem.unselectedIcon
                    }
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    color={isFocused 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary
                    }
                  />
                );
              }

              label = apiItem.defaultTitle;
            }

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={1}
                style={styles.tabItem}
              >
                {iconNode}
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelFocused,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </AppSafeAreaView>
    </View>
  );
}


const getStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
  },
  tabItemsRow: {
    height: mh(54),
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: mh(2),
  },
  tabLabel: {
    ...Typography.medium_10,
    color: theme.colors.textSecondary
  },
  tabLabelFocused: {
    ...Typography.bold_10,
    color: theme.colors.primary
  },
})