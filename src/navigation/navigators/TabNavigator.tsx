import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScreenNames } from '../utils/ScreenNames';
import { SCREEN_REGISTRY } from '../utils/ScreenRegistry';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const tabs = [ScreenNames.CHAT, ScreenNames.IMAGE_GENERATOR, ScreenNames.SPEECH_TO_TEXT, ScreenNames.TEXT_TO_SPEECH]
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      {tabs.map((screenName) => {
        const Component = SCREEN_REGISTRY[screenName];

        if (!Component) return null;

        return (
          <Tab.Screen
            key={screenName}
            name={screenName}
            component={Component}
          />
        );
      })}
    </Tab.Navigator>
  )
}