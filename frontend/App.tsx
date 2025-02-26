import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';
import {RootNavigation} from './src/navigation/RootNavigation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import globalStyle from './src/assets/styles/globalStyle';
import {NativeModules, Platform, StatusBar} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const App = (): React.JSX.Element => {
  useEffect(() => {
    SystemNavigationBar.setNavigationColor('transparent');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
    StatusBar.setBarStyle('dark-content');
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Provider store={store}>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
