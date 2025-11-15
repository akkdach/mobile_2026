import {StyleSheet} from 'react-native';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';

export const styleLg =()=>{
  return StyleSheet.create({
    labelStyle: {
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 18
    },
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 16
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 18,
      fontFamily: Fonts.Prompt_Medium,
    },
    modal:{
      width: 650
    },
    btnText:{ fontFamily: Fonts.Prompt_Medium, fontSize: 36, color: '#fff' },
    btn:{
      borderWidth: 2,
      borderColor: COLOR.gray,
      backgroundColor: COLOR.primary,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btn2:{
      borderWidth: 2,
      borderColor: COLOR.primary,
      backgroundColor: '#fff',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
} 

export const styleSm =()=>{
  return StyleSheet.create({
    btn2:{
      borderWidth: 2,
      borderColor: COLOR.primary,
      backgroundColor: '#fff',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btn:{
      borderWidth: 2,
      borderColor: COLOR.gray,
      backgroundColor: COLOR.primary,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnText:{ fontFamily: Fonts.Prompt_Medium, fontSize: 16, color: '#fff' },
    modal:{
      width: '98%'
    },
    labelStyle: {
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 14
    },
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 14
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 18,
      fontFamily: Fonts.Prompt_Medium,
    },
    
  });
}
