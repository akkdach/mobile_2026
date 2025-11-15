import { StyleSheet } from "react-native";
import { COLOR } from "../../../constants/Colors";
import { Fonts } from "../../../constants/fonts";

export const styleLg=()=>{
  return StyleSheet.create({
    btn: {
      width: 250,
      height: 62,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 1,
      borderColor: COLOR.neonRed,
      backgroundColor: COLOR.neonRed,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium,
    },
    btnPrimary: {
      width: 250,
      height: 62,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 1,
      borderColor: COLOR.primary,
      backgroundColor: COLOR.primary,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium,
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 16,
      alignItems: 'center',
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 16,
      fontFamily: Fonts.Prompt_Light
    },
  });
}


export const styleSm=()=>{
  return StyleSheet.create({
    btn: {
      width: 250,
      height: 62,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      borderWidth: 1,
      borderColor: COLOR.neonRed,
      backgroundColor: COLOR.neonRed,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium,
    },
    btnPrimary: {
      width: 250,
      height: 62,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      borderWidth: 1,
      borderColor: COLOR.primary,
      backgroundColor: COLOR.primary,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium,
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 10,
      alignItems: 'center',
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 10,
      fontFamily: Fonts.Prompt_Light
    },
  });
}