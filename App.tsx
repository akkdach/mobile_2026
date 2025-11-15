/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import RoutingPage from './src/app.routing';
import { NotifyContextProvider } from './src/reducer/NotifyContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {
  useEffect(() => {
    requestCameraPermission();
  }, []);
  
  return (
      <>
        <GestureHandlerRootView>
          <NavigationContainer>
            <SafeAreaProvider>
              <NotifyContextProvider>
                <RoutingPage></RoutingPage>
              </NotifyContextProvider>
            </SafeAreaProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </>
  );
};

export default App;
