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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

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
    <NavigationContainer>
      <SafeAreaProvider>
        <NotifyContextProvider>
          <RoutingPage />
        </NotifyContextProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
