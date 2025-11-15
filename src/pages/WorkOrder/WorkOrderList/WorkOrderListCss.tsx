import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export const styleSM = () => {
  return StyleSheet.create({
    btn: {
      width: '100%',
      height: 60,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: COLOR.secondary_primary_color,
      borderRadius: 35,
      marginTop: 20,
    },
    titleCheck: {
      fontSize: 18,
      color: COLOR.primary,
      padding: 10,
      fontFamily: Fonts.Prompt_Medium
    },
    titleDetails: {
      fontSize: 14,
      fontFamily: Fonts.Prompt_Medium
    },
    wrapText: {
      flexWrap: 'wrap'
    },
    textDetails: {
      fontSize: 12,
      fontFamily: Fonts.Prompt_Light
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
    titleTable: {
      fontSize: 4,
      fontFamily: Fonts.Prompt_Medium,
      color: COLOR.primary,
    },
    titleTableDetails: {
      fontSize: 12,
      padding: 8,
      color: '#9B9B9B',

    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 14,
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 12,
      fontFamily: Fonts.Prompt_Light
    },
    image: {
      height: 300,
      width: '100%',
    },
    titleLabel: {
      color: COLOR.primary,
      fontSize: 16,
      fontFamily: Fonts.Prompt_Medium,
      paddingTop: 40
    },
    salePriceWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 20
    },
    salePriceBox: {
      borderWidth: 1,
      borderColor: COLOR.primary,
      padding: 20,
      width: '100%'
    },
    btn_date: {
      width: 262,
      height: 52,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      borderWidth: 2,
      borderColor: COLOR.secondary_primary_color,
      marginTop: 20,
      left: 10,
      fontFamily: Fonts.Prompt_Medium,
      backgroundColor: COLOR.white
    },
    text_btn_date: {
      fontSize: 14,
      padding: 10,
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
    },
    textLabel: {
      marginTop: 6,
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 12,
    },
    alertNotCloseWork: {
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 12,
      color: '#ffffff'
    },
    customerModal: { width: 350 },
    customerIcon:{display:'none'},
    customerContent:{
      flex: 4,
      paddingLeft: 0,
    },
    modalWidth:{
      width: 350, height: '98%'
    },
    modalWidthImg:{
      width: '95%'
    },
    text14:{
      fontSize:12
    },
    text22:{
      fontSize:14
    },
  });
}

export const stylesLG = () => {
  return StyleSheet.create({
    text22:{
      fontSize:22
    },
    text14:{
      fontSize:18
    },
    modalWidthImg:{
      width: 700
    },
    modalWidth:{
      width: 650, height: 450
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
      backgroundColor: COLOR.secondary_primary_color,
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
    wrapText: {
      flexWrap: 'wrap'
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
      fontSize: 18,
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 16,
      fontFamily: Fonts.Prompt_Light
    },
    image: {
      height: 300,
      width: '100%',
    },
    titleLabel: {
      color: COLOR.primary,
      fontSize: 20,
      fontFamily: Fonts.Prompt_Medium,
      paddingTop: 40
    },
    salePriceWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 20
    },
    salePriceBox: {
      marginLeft: 30,
      borderWidth: 1,
      borderColor: COLOR.primary,
      padding: 20,
      width: 300
    },
    btn_date: {
      width: 262,
      height: 52,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
      borderWidth: 2,
      borderColor: COLOR.secondary_primary_color,
      marginTop: 20,
      left: 10,
      fontFamily: Fonts.Prompt_Medium,
      backgroundColor: COLOR.white
    },
    text_btn_date: {
      fontSize: 18,
      padding: 10,
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
    },
    textLabel: {
      marginTop: 6,
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 16,
    },
    alertNotCloseWork: {
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 16,
      color: '#ffffff'
    },
    customerModal: { width: 650 },
    customerIcon:{display:'none'},
    customerContent:{
      flex: 4,
      paddingLeft: 20,
    }
  });
}