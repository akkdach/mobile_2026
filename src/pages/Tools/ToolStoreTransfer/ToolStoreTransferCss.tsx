import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export default StyleSheet.create({
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
  modalIconMinus: {fontSize: 80, marginRight: 30, color: 'red'},
  modalIconPlus: {fontSize: 80, marginLeft: 30, color: '#33C3FF'},
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
    height: 30,
  }
});
