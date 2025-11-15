import React, { useEffect, useState } from 'react';
import {Appbar, Text} from 'react-native-paper';
import {Fonts} from '../constants/fonts';
import {COLOR} from '../constants/Colors';
import {AppBarInterface} from '../models';
import {Actions} from 'react-native-router-flux';
import {Alert, Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';

const AppBar = (props: AppBarInterface) => {
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    // console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  },[screenInfo]);
  
  const _goBack = () => {
    if (props.pageValueChange) {
       /* Alert.alert(
        'แจ้งเตือน',
        'มีการเปลี่ยนแปลงข้อมูลกรุณาบันทึกข้อมูลให้เรียบร้อย',
        [
          {
            text: 'ยกเลิก',
            style: 'cancel',
            onPress: () => {
              if (props.replacePath) {
                if (props.replaceProps) {
                  Actions.replace(props.replacePath, props.replaceProps);
                } else {
                  Actions.replace(props.replacePath);
                }
              } else {
                Actions.pop();
              }

              if (props.onBackReload) {
                setTimeout(() => Actions.refresh(), 500);
              }
            },
          },
          {
            text: 'ตกลง',
            onPress: async () => {},
          },
        ],
      ); */
    } else {
      if (props.replacePath) {
        if (props.replaceProps) {
          Actions.replace(props.replacePath, props.replaceProps);
        } else {
          Actions.replace(props.replacePath);
        }
      } else {
        Actions.pop();
      }

      if (props.onBackReload) {
        setTimeout(() => Actions.refresh(), 500);
      }
    }
  };
  var attProps = {
    title: (
      <Text
        style={[styles.txt1,{
          fontFamily: Fonts.Prompt_Medium,
          color: COLOR.white,
        }]}>
        {props.title}
      </Text>
    ),
  };

  if (props.subtitle) {
    attProps = {
      ...attProps,
      ...{
        subtitle: (
          <Text
            style={[styles.txt1,{
              fontFamily: Fonts.Prompt_Medium,
              color: COLOR.white,
            }]}>
            {props.subtitle}
          </Text>
        ),
      },
    };
  }

  var attPropsRight = {
    title: (
      <Text
        style={[styles.txt1,{
          fontFamily: Fonts.Prompt_Medium,
          color: COLOR.white,
        }]}>
        {props.rightTitle}
      </Text>
    ),
  };

  const stylesSm = ()=>{
    return StyleSheet.create({
      txt1:{
        fontSize:14
      }
    });
  }

  const stylesLg = ()=>{
    return StyleSheet.create({
      txt1:{
        fontSize:18
      }
    });
  }

  return (
    <Appbar.Header style={{backgroundColor: COLOR.primary}}>
      {!props.hideBackIcon && (
        <Appbar.BackAction color="#FFFFFF" onPress={_goBack} />
      )}
      <Appbar.Content color="#FFFFFF" {...attProps} />
      {props.rightTitle && (
        <Appbar.Content
          title={props.rightTitle}
          style={[{alignItems: 'flex-start',width:200}]}
        />
      )}
    </Appbar.Header>
  );

};



export default AppBar;


