import LottieView from 'lottie-react-native';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Props {
  loading: any;
  paddingTop?: any;
}

const Loading = (props: Props) => {
  if (props.loading) {
    return (
      <LottieView
        source={require('../../assets/71182-loading.json')}
        style={styles.animation}
        autoPlay={props.loading}
        speed={-1}
      />
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  animation: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 990,
  },
});

export default Loading;
