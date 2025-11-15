import {StyleSheet} from 'react-native';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';


export const styleLg = ()=>{
  return  StyleSheet.create({
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 16
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalTitle: { 
      textAlign: 'center', 
      fontSize: 24, 
      borderBottomWidth: 1, 
      borderColor: '#ccc', 
      padding: 10, 
      fontFamily: Fonts.Prompt_Medium
    },
    modalContent: { 
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 30 
    },
    modalIconMinus: { fontSize: 80, marginRight: 30, color: 'red' },
    modalIconPlus: { fontSize: 80, marginLeft: 30, color: '#33C3FF' },
    input: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      width: 282,
      height: 52,
      marginTop: 8,
      marginLeft: -2,
      marginHorizontal: 20,
      paddingLeft: 45,
      borderRadius: 25,
      fontSize: 20,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    input_select: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      marginTop: 8,
      borderRadius: 25,
      alignItems: 'center',
      fontSize: 20,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
  });
  
}

export const styleSm = ()=>{
  return  StyleSheet.create({
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 10
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 12,
      fontWeight: 'bold',
    },
    modalTitle: { 
      textAlign: 'center', 
      fontSize: 16, 
      borderBottomWidth: 1, 
      borderColor: '#ccc', 
      padding: 10, 
      fontFamily: Fonts.Prompt_Medium
    },
    modalContent: { 
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 10 
    },
    modalIconMinus: { fontSize: 80, marginRight: 30, color: 'red' },
    modalIconPlus: { fontSize: 80, marginLeft: 30, color: '#33C3FF' },
    input: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      width: 282,
      height: 52,
      marginTop: 8,
      marginLeft: -2,
      marginHorizontal: 20,
      paddingLeft: 45,
      borderRadius: 25,
      fontSize: 20,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    input_select: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      marginTop: 8,
      borderRadius: 25,
      alignItems: 'center',
      fontSize: 12,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
  });
  
}

