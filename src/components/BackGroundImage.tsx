import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { generateKey } from '../utils/Random';
import Loading from './loading';
import styleSheet from './StyleSheet';
const background = require('../../assets/images/bg.png');

const BackGroundImage = (props: BackGroundImageInterface) => {
  const [loading, setLoading] = useState<any>(props?.loading)
  return (
    <View
      style={styleSheet.container_bg}
      key={`${generateKey('background-compo')}`}>
      <Image
        style={styleSheet.backgroundImage}
        source={background}
        key={`${generateKey('background-img')}`}
      />
      <View
        key={`${generateKey('background-view')}`}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>

        <View>
          <Loading loading={props?.loading == undefined ? false : props?.loading} />
          {props.components}
        </View>


      </View>
    </View>
  );
};

export default BackGroundImage;

export interface BackGroundImageInterface {
  components?: any;
  keyBg?: any;
  loading?: boolean
}
