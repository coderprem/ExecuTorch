import type { NavigatorScreenParams } from '@react-navigation/native';
import { NavigatorNames, ScreenNames } from "../utils/ScreenNames";

export type RootStackParamList = {
  [NavigatorNames.TABS]: NavigatorScreenParams<TabStackParamList> | undefined;
  [NavigatorNames.MAIN]: NavigatorScreenParams<MainStackParamList> | undefined;
};

export type TabStackParamList = {
  [ScreenNames.CHAT]: undefined;
  [ScreenNames.IMAGE_GENERATOR]: undefined;
  [ScreenNames.SPEECH_TO_TEXT]: undefined;
  [ScreenNames.TEXT_TO_SPEECH]: undefined;
};

export type MainStackParamList = {
  
}