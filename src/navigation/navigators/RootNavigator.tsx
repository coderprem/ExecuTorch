import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabNavigator';
import { NavigatorNames } from '../utils/ScreenNames';
import { RootStackParamList } from '../paramslist/RootStackParamsList';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={NavigatorNames.TABS} component={TabsNavigator} options={{ animation: 'none' }}/>
    </Stack.Navigator>
  );
};
