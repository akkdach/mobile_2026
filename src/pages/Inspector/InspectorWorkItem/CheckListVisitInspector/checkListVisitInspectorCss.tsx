import {StyleSheet} from 'react-native';
import { COLOR } from '../../../../constants/Colors';
import { Fonts } from '../../../../constants/fonts';

export const styleLg = ()=>{
  return StyleSheet.create({
    textTitle: {
      color: COLOR.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    input: {
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 2,
      fontSize: 18,
      borderColor: COLOR.secondary_primary_color,
      marginBottom: 10,
      borderRadius: 20,
    },
    labelInput: {
      paddingRight: 20,
      fontSize: 18,
    },
    subLabelInput: {
      paddingLeft: 20,
      fontSize: 18,
    },
    btn: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: COLOR.primary,
      borderRadius: 35,
      marginTop: 20,
    },
    btn_submit: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: COLOR.secondary_primary_color,
      borderRadius: 35,
      marginTop: 20,
    },
    image: {
      height: 300,
      width: '100%',
    },
    titleLabel: {
      color: COLOR.primary,
      fontSize: 20,
      fontFamily: Fonts.Prompt_Medium,
      paddingTop:40
    },
    text_title_camera: {
      fontSize: 22,
      padding: 6,
      marginLeft: 10,
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
    },
  });
} 

export const styleSm = ()=>{
  return StyleSheet.create({
    textTitle: {
      color: COLOR.primary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    input: {
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 2,
      fontSize: 14,
      borderColor: COLOR.secondary_primary_color,
      marginBottom: 10,
      borderRadius: 20,
    },
    labelInput: {
      paddingRight: 20,
      fontSize: 14,
    },
    subLabelInput: {
      paddingLeft: 20,
      fontSize: 14,
    },
    btn: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: COLOR.primary,
      borderRadius: 35,
      marginTop: 20,
    },
    btn_submit: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: COLOR.secondary_primary_color,
      borderRadius: 35,
      marginTop: 20,
    },
    image: {
      height: 300,
      width: '100%',
    },
    titleLabel: {
      color: COLOR.primary,
      fontSize: 14,
      fontFamily: Fonts.Prompt_Medium,
      paddingTop:40
    },
    text_title_camera: {
      fontSize: 14,
      padding: 6,
      marginLeft: 10,
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
    },
  });
} 
