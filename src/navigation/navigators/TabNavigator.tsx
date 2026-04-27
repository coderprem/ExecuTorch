import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScreenNames } from '../utils/ScreenNames';
import { SCREEN_REGISTRY } from '../utils/ScreenRegistry';
import AppTabBar, { TabItem } from '../components/AppTabBar';
import { SVGS } from '../../utils/assetsPath';

const Tab = createBottomTabNavigator();

const tabItemsList: TabItem[] = [
  {
    defaultTitle: ScreenNames.CHAT,
    selectedIcon: SVGS.chat,
    unselectedIcon: SVGS.chat
  },
  {
    defaultTitle: ScreenNames.IMAGE_GENERATOR,
    selectedIcon: SVGS.imageGenerator,
    unselectedIcon: SVGS.imageGenerator
  },
  {
    defaultTitle: ScreenNames.SPEECH_TO_TEXT,
    selectedIcon: SVGS.speechToText,
    unselectedIcon: SVGS.speechToText
  },
  {
    defaultTitle: ScreenNames.TEXT_TO_SPEECH,
    selectedIcon: SVGS.textToSpeech,
    unselectedIcon: SVGS.textToSpeech
  },
]

export default function TabsNavigator() {
  const tabs = [
    ScreenNames.CHAT, 
    ScreenNames.IMAGE_GENERATOR, 
    ScreenNames.SPEECH_TO_TEXT, 
    ScreenNames.TEXT_TO_SPEECH
  ]
  
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} tabBar={(props) => (
      <AppTabBar {...props} tabItems={tabItemsList}/>
    )}>
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