import { Button, Icon } from '@ant-design/react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import QRCodeScanner, { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import { COLOR } from '../constants/Colors';
import { Fonts } from '../constants/fonts';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const overlayColor = 'rgba(0,0,0,0.5)';

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = 'red';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = '#22ff00';

const iconScanColor = 'blue';

const styles = StyleSheet.create({
  btnLg: {
    minWidth: 200,
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
  },
});

export interface ScannerInterface {
  title: string | undefined;
  onValue?: (e: BarCodeReadEvent) => void;
  onClose?: () => void;
}

const Scanner = (props: ScannerInterface) => {
  const makeSlideOutTranslation = (translationType: any, fromValue: any) => {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  };

  return (
    <QRCodeScanner
      showMarker
      onRead={e => {
        if (typeof props.onValue == 'function') {
          return props.onValue(e);
        }
      }}
      cameraStyle={{height: SCREEN_HEIGHT}}
      customMarker={
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              flex: 1,
              height: SCREEN_WIDTH,
              width: SCREEN_WIDTH,
              backgroundColor: overlayColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 30, color: 'white'}}>{props.title}</Text>
            <Button
              style={{...styles.btnLg, marginTop: 20}}
              onPress={() => {
                if (typeof props.onClose == 'function') {
                  return props.onClose();
                }
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  fontFamily: Fonts.Prompt_Medium,
                }}>
                ปิด
              </Text>
            </Button>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                height: SCREEN_WIDTH * 0.65,
                width: SCREEN_WIDTH,
                backgroundColor: overlayColor,
              }}
            />

            <View
              style={{
                height: rectDimensions,
                width: rectDimensions,
                borderWidth: rectBorderWidth,
                borderColor: rectBorderColor,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}>
              {/* <Icon
                name="qrcode"
                size={SCREEN_WIDTH * 0.73}
                color={iconScanColor}
              /> */}
              <Animatable.View
                style={{
                  width: scanBarWidth,
                  height: scanBarHeight,
                  backgroundColor: scanBarColor,
                  marginTop: SCREEN_WIDTH * 0.73
                }}
                direction="alternate-reverse"
                iterationCount="infinite"
                duration={1700}
                easing="linear"
                animation={makeSlideOutTranslation(
                  'translateY',
                  SCREEN_WIDTH * -0.54,
                )}
              />
            </View>

            <View
              style={{
                height: SCREEN_WIDTH * 0.65,
                width: SCREEN_WIDTH,
                backgroundColor: overlayColor,
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              height: SCREEN_WIDTH,
              width: SCREEN_WIDTH,
              backgroundColor: overlayColor,
              paddingBottom: SCREEN_WIDTH * 0.25,
            }}
          />
        </View>
      }
    />
  );
};

export default Scanner;
