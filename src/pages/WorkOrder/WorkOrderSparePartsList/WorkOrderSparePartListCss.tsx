import { StyleSheet, Dimensions } from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { styleSM } from '../WorkOrderList/WorkOrderListCss';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export const styles = StyleSheet.create({
  ScrollView:{paddingLeft: 1, paddingRight: 1},
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 14.5,
    flexWrap: 'wrap'
  },
  textTitle: {
    color: COLOR.primary,
    fontSize: 18,
    padding: 8,
    fontWeight: 'bold',
  },
  textContent: {
    fontSize: 18,
    padding: 8,
    color: '#9B9B9B',
  },
  titleProblems: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.primary,
  },
  titleProblemsDetails: {
    fontSize: 16,
    padding: 8,
    color: '#9B9B9B',
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    flexWrap: 'wrap'
  },
  sparePartButtonSection: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: '100%',
    height: '15%',
  },
  sparePartButton: {
    backgroundColor: 'blue',
    color: 'white',
    marginLeft: 5,
    width: 100,
    fontFamily: Fonts.Prompt_Medium,
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
  input_select: {
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    marginTop: 8,
    borderRadius: 25,
    alignItems: 'center',
    fontSize: 20,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  largeLogo: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    fontFamily: Fonts.Prompt_Light,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  sparePartModalInput:{
      width: 320,
      fontSize: 35,
      paddingLeft: 18,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
  }
});
export const styleLg = ()=>{
  return StyleSheet.create({
    ScrollView:{paddingLeft: 1, paddingRight: 1},
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 14.5,
      flexWrap: 'wrap'
    },
    textTitle: {
      color: COLOR.primary,
      fontSize: 18,
      padding: 8,
      fontWeight: 'bold',
    },
    textContent: {
      fontSize: 18,
      padding: 8,
      color: '#9B9B9B',
    },
    titleProblems: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLOR.primary,
    },
    titleProblemsDetails: {
      fontSize: 16,
      padding: 8,
      color: '#9B9B9B',
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 18,
      fontFamily: Fonts.Prompt_Medium,
    },
    sparePartButtonSection: {
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      width: '100%',
      height: '15%',
    },
    sparePartButton: {
      backgroundColor: 'blue',
      color: 'white',
      marginLeft: 5,
      width: 100,
      fontFamily: Fonts.Prompt_Medium,
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
    input_select: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      marginTop: 8,
      borderRadius: 25,
      alignItems: 'center',
      fontSize: 20,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    tinyLogo: {
      width: 30,
      height: 30,
    },
    largeLogo: {
      flexDirection: 'row',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 30,
      fontFamily: Fonts.Prompt_Light,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    sparePartModalInput:{
      width: 320,
      fontSize: 35,
      paddingLeft: 18,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    flex05:{
      flex:0.5
    },
    flex1:{
      flex:1
    },
    flex2:{
      flex:2
    },
    flex4:{
      flex:4
    },
    btnOk:{
      
        marginTop: 4,
        height: 62,
        padding: 8,
        width: 152,
        borderRadius: 50,
        backgroundColor: COLOR.secondary_primary_color,
        marginLeft:300
      
    }
    ,datatable1:{ width: '100%' }
  });
}

export const styleSm = ()=>{
  return StyleSheet.create({
    datatable1:{ width: '100%' },
    btnOk:{
      
      marginTop: 4,
      height: 62,
      padding: 8,
      width: 152,
      borderRadius: 50,
      backgroundColor: COLOR.secondary_primary_color,
    
  },
    flex05:{
      flex:0.5
    },
    flex1:{
      flex:0.9
    },
    flex2:{
      flex:1.5
    },
    flex4:{
      flex:2.2
    },
    ScrollView:{paddingLeft: 1, paddingRight: 1},
    dataTable_cell: {
      fontFamily: Fonts.Prompt_Light,
      fontSize: 10,
      flexWrap: 'wrap'
    },
    textTitle: {
      color: COLOR.primary,
      fontSize: 18,
      padding: 8,
      fontWeight: 'bold',
    },
    textContent: {
      fontSize: 18,
      padding: 8,
      color: '#9B9B9B',
    },
    titleProblems: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLOR.primary,
    },
    titleProblemsDetails: {
      fontSize: 16,
      padding: 8,
      color: '#9B9B9B',
    },
    dataTableTitle: {
      color: COLOR.white,
      fontSize: 12,
      fontFamily: Fonts.Prompt_Medium,
      flexWrap: 'wrap'
    },
    sparePartButtonSection: {
      // position: 'inline',
      zIndex: 1,
      bottom: 0,
      width: '100%',
      height: '15%',
      alignItems:'center'
    },
    sparePartButton: {
      backgroundColor: 'blue',
      color: 'white',
      marginLeft: 5,
      width: 100,
      fontFamily: Fonts.Prompt_Medium,
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
    input_select: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      marginTop: 8,
      borderRadius: 25,
      alignItems: 'center',
      fontSize: 20,
      fontFamily: Fonts.Prompt_Light,
      color: '#ffffff',
    },
    tinyLogo: {
      width: 30,
      height: 30,
    },
    largeLogo: {
      flexDirection: 'row',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 30,
      fontFamily: Fonts.Prompt_Light,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    sparePartModalInput:{
      width: 320,
      fontSize: 35,
      paddingLeft: 18,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
  }
  });
}
