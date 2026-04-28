import { initExecutorch } from 'react-native-executorch';
import { BareResourceFetcher } from 'react-native-executorch-bare-resource-fetcher'; // Note the package name change below
import Providers from './src/providers/Providers';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/utils/navigationRef';
import RootNavigator from './src/navigation/navigators/RootNavigator';
import { initNetworkListener } from './src/utils/network';
import { useEffect } from 'react';

// This must run before any hooks (like useLLM) are called
initExecutorch({
  resourceFetcher: BareResourceFetcher
});

function App() {
  useEffect(() => {
    initNetworkListener();
  }, []);
  return (
    <Providers>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </Providers>
  );
}


export default App;
