import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store/store';
import {RootNavigation} from './src/navigation/RootNavigation';

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
