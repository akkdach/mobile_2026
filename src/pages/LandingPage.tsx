import React, {useEffect, useRef} from 'react';
import {StyleSheet, Image, Animated, View} from 'react-native';
import styleSheet from '../components/StyleSheet';
import {isSignedIn} from '../services/auth';
import { useNavigation, StackActions } from '@react-navigation/native';

const logo = require('../../assets/images/logo.png');
const landing = require('../../assets/images/landing.png');
const LandingPage = () => {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    async function handleUserNextScreen() {
      const isLogin = await isSignedIn();
      if (isLogin) {
        navigation.dispatch(
          StackActions.replace('appMain')
        );
      } else {
        navigation.dispatch(
          StackActions.replace('Login')
        );
      }
    }
    handleUserNextScreen();
  }, []);
  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  return <>{BackGroundImageLanding(fadeInAnim)}</>;
};

const BackGroundImageLanding = (fadeInAnim: any) => {
  return (
    <View
      style={{
        flex: 4,
      }}>
      <Image
        style={[styleSheet.backgroundImage, {opacity: 0.8}]}
        width={800}
        source={landing}
        key="image-background"
      />
      <View
        key="view-background"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Animated.View style={[styles.container, {opacity: fadeInAnim}]}>
          <Image style={styles.logo} source={logo} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  logo: {
    width: 690,
    height: 140,
  },
});

export default LandingPage;
