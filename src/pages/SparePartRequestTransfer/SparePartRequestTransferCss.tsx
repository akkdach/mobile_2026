import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';

export const styleLg = () => {
  return StyleSheet.create({
    containerStyle: {
      borderRadius: 30,
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      height: 56,
      marginHorizontal: 20,
      paddingLeft: 40,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    }, btnOk: {

      marginTop: 4,
      height: 62,
      padding: 8,
      width: 152,
      borderRadius: 50,
      backgroundColor: COLOR.secondary_primary_color,

    },
    containerTextStyle: {
      paddingTop: 15,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    iconStyle: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 20,
      paddingTop: 20,
    },
    container: {
      flex: 1,
      marginTop: 40,
      padding: 20,
    },
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 14.5,
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
      fontFamily: Fonts.Prompt_Medium,
    },
    modalContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
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
    inputAddItem: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      width: 40,
      height: 52,
      marginTop: 8,
      marginHorizontal: 20,
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
    sparePartButtonSection: {
      position: 'absolute',
      top: '80%',
      left: 0,
      right: 0,
    },
    sparePartBodySection: {
      width: '100%',
      height: '100%',
      padding: 10,
    },
    tinyLogo: {
      width: 30,
      height: 30
    },
    flex1: {
      flex: 1
    },
    flex05: {
      flex: 2
    },
    flex4: {
      flex: 4
    },
    flex5: {
      flex: 5
    },
    modalWidth: { width: '100%' },
    btnUse: {
      backgroundColor: COLOR.white,
      borderColor: COLOR.secondary_primary_color,
      borderWidth: 2,
    },
  });
}


export const styleSm = () => {
  return StyleSheet.create({
    btnUse: {
      backgroundColor: COLOR.white,
      borderColor: COLOR.secondary_primary_color,
      borderWidth: 2,
      fontSize: 10,
      padding: 2,
    }, btnOk: {

      marginTop: 4,
      height: 62,
      padding: 8,
      width: 152,
      borderRadius: 50,
      backgroundColor: COLOR.secondary_primary_color,

    },
    modalWidth: { width: '107%' },
    flex1: {
      flex: 1
    },
    flex15: {
      flex: 1
    },
    flex05: {
      flex: 0.5
    },
    flex4: {
      flex: 2
    },
    flex5: {
      flex: 2
    },
    containerStyle: {
      borderRadius: 30,
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      height: 56,
      marginHorizontal: 20,
      paddingLeft: 40,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    containerTextStyle: {
      paddingTop: 15,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    iconStyle: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 20,
      paddingTop: 20,
    },
    container: {
      flex: 1,
      marginTop: 40,
      padding: 20,
    },
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 10,
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 10,
      fontWeight: 'bold',
    },
    modalTitle: {
      textAlign: 'center',
      fontSize: 20,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      fontFamily: Fonts.Prompt_Medium,
    },
    modalContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
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
    inputAddItem: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      width: 40,
      height: 52,
      marginTop: 8,
      marginHorizontal: 20,
      borderRadius: 25,
      fontSize: 14,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    input_select: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      marginTop: 8,
      borderRadius: 25,
      alignItems: 'center',
      fontSize: 14,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    sparePartButtonSection: {
      position: 'absolute',
      top: '80%',
      left: 0,
      right: 0,
    },
    sparePartBodySection: {
      width: '100%',
      height: '100%',
      padding: 10,
    },
    tinyLogo: {
      width: 30,
      height: 30
    }
  });
} 
