import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Animated,
  useColorScheme,
} from 'react-native';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Props {
  loading: boolean;
  message?: string;
  paddingTop?: number;
}

const Loading = ({ loading, message, paddingTop = 0 }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme(); // light | dark

  useEffect(() => {
    if (loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [loading]);

  if (!loading) return null;

  const textColor = theme === 'dark' ? '#fff' : '#333';

  return (
    <View style={[styles.overlay, { paddingTop }]}>
      {/* <LottieView
        source={require('../../assets/71182-loading.json')}
        style={styles.animation}
        autoPlay
        loop
        speed={1}
      /> */}
      {message && (
        <Animated.Text
          style={[styles.message, { color: textColor, opacity: fadeAnim }]}
        >
          {message}
        </Animated.Text>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   overlay: {
//     elevation: 99,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     zIndex: 999,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   animation: {
//     width: 120,
//     height: 120,
//   },
//   message: {
//     marginTop: 16,
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

export default Loading;
