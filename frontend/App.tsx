import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';
import {RootNavigation} from './src/navigation/RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Platform, StatusBar, useColorScheme} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {MyDarkTheme} from './src/components/ui/themes';

const App = (): React.JSX.Element => {
  const scheme = useColorScheme();
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemNavigationBar.setNavigationColor('transparent');
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer
            theme={scheme === 'dark' ? MyDarkTheme : DefaultTheme}>
            <BottomSheetModalProvider>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
              />
              <RootNavigation />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
