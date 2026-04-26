import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import { AppText } from '../../../components/AppText';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';

const ChatScreen = () => {
  return (
    <AppSafeAreaView style={styles.container}>
      <AppText>
        {ScreenNames.CHAT}
      </AppText>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.text.primary,
  },
});

export default ChatScreen;
