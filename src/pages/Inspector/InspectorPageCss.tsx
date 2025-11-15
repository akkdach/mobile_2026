import {StyleSheet} from 'react-native';
import { COLOR } from '../../constants/Colors';

export const styleLg = ()=>{
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
    container: {
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 40,
      marginTop: 40,
    },
    flexListMenu: {
      flexDirection: 'row',
      flex: 4,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    flexListMenuItem: {
      padding: 25
    },
    cardLogoCompany: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      marginTop: 40,
    },
    logoCompany: {
      width: 400,
      height: 70,
    },
    iconCard: {
      marginLeft: 25,
      marginTop: 10,
      backgroundColor: 'white',
    },
    modalWidth:{
      width:650
    },
    txt18:{
      fontSize: 18,
    }
  });
} 


export const styleSm = ()=>{
  return StyleSheet.create({
    txt18:{
      fontSize: 14,
    },
    modalWidth:{
      width:400
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
    container: {
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 40,
      marginTop: 40,
    },
    flexListMenu: {
      flexDirection: 'row',
      flex: 4,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    flexListMenuItem: {
      padding: 25
    },
    cardLogoCompany: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      marginTop: 40,
    },
    logoCompany: {
      width: 400,
      height: 70,
    },
    iconCard: {
      marginLeft: 25,
      marginTop: 10,
      backgroundColor: 'white',
    },
  });
} 
