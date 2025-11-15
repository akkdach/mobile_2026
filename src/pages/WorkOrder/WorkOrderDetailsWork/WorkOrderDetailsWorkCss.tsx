import { StyleSheet } from "react-native";
import { COLOR } from "../../../constants/Colors";
import { Fonts } from "../../../constants/fonts";

export default StyleSheet.create({
  text1:{fontSize:16},
  workDetialsView:{
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
    borderColor: 'red',
    width:'110%'
  },
  h1:{
    fontSize:12
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    fontFamily: Fonts.Prompt_Light,
    color: COLOR.gray,
  },
  container: {
    width: ('90%'),
  },
  cell: {
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  scrollViewMain:{
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: '10%',
    width: '100%',
  }
});


export const stylesLg = () => {
  return StyleSheet.create(
    {
      text1:{fontSize:16},
      workDetialsView:{
        paddingLeft: 40,
        paddingRight: 40,
        marginTop: 20,
        borderColor: 'red',
        width:'110%'
      },
      h1:{
        fontSize:16
      },
      title: {
        marginTop: 10,
        fontSize: 26,
        fontFamily: Fonts.Prompt_Light,
        color: COLOR.gray,
      },
      container: {
        width: ('90%'),
      },
      cell: {
        borderWidth: 1,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      },
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
      scrollViewMain:{
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: '10%',
        width: '100%',
      }
    });
}

export const stylesSm = () => {
  return StyleSheet.create({
    modalWidth:{width: 380, maxHeight: 980, borderRadius: 15,marginTop:130},
    text1:{fontSize:10},
    scrollViewMain:{
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: '10%',
      width: '100%',
    },
    workDetialsView:{
      paddingLeft: 3,
      paddingRight: 3,
      marginTop: 20,
      borderColor: 'red',
      width:'110%'
    },
    h1:{
      fontSize:12
    },
    title: {
      marginTop: 10,
      fontSize: 24,
      fontFamily: Fonts.Prompt_Light,
      color: COLOR.gray,
    },
    container: {
      width: ('90%'),
    },
    cell: {
      borderWidth: 1,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
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
      fontSize: 11,
      alignItems: 'center',
      fontFamily: Fonts.Prompt_Medium
    },
    dataTableCell: {
      fontSize: 10,
      fontFamily: Fonts.Prompt_Light
    },
  });
}