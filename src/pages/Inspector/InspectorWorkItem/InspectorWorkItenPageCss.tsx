import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';


export const  styleLg =()=>{
  return StyleSheet.create({
    btn: {
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
    btnCloseJob: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 1,
      borderColor: COLOR.neonRed,
      backgroundColor: COLOR.neonRed,
      borderRadius: 35,
      marginTop: 20,
    },
    titleCheck: {
        fontSize: 22,
        color: COLOR.primary,
        padding: 20,
        fontFamily: Fonts.Prompt_Medium
    },
    titleDetails: {
        fontSize: 18,
        fontFamily: Fonts.Prompt_Medium
    },
    textDetails: {
      fontSize: 16,
      fontFamily: Fonts.Prompt_Light
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
    titleTable: {
      fontSize: 18,
      fontFamily: Fonts.Prompt_Medium,
      color: COLOR.primary,
    },
    titleTableDetails: {
      fontSize: 16,
      padding: 8,
      color: '#9B9B9B',
      
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 16,
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 14,
      fontFamily: Fonts.Prompt_Light
    },
    cardMenu:{
      marginTop: 15, marginLeft: 20, marginRight: 20 
    }
  });
}


export const  styleSm =()=>{
  return StyleSheet.create({
    btn: {
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
    btnCloseJob: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 1,
      borderColor: COLOR.neonRed,
      backgroundColor: COLOR.neonRed,
      borderRadius: 35,
      marginTop: 20,
    },
    titleCheck: {
        fontSize: 22,
        color: COLOR.primary,
        padding: 20,
        fontFamily: Fonts.Prompt_Medium
    },
    titleDetails: {
        fontSize: 18,
        fontFamily: Fonts.Prompt_Medium
    },
    textDetails: {
      fontSize: 16,
      fontFamily: Fonts.Prompt_Light
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
    titleTable: {
      fontSize: 18,
      fontFamily: Fonts.Prompt_Medium,
      color: COLOR.primary,
    },
    titleTableDetails: {
      fontSize: 16,
      padding: 8,
      color: '#9B9B9B',
      
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 16,
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 14,
      fontFamily: Fonts.Prompt_Light
    },
    cardMenu:{
      marginTop: 10, marginLeft: 20, marginRight: 20 
    }
  });
}


