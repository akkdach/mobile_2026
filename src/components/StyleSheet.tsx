import {StyleSheet} from 'react-native';
import {COLOR} from '../constants/Colors';
import { Fonts } from '../constants/fonts';

export default StyleSheet.create({
  appBar: {
    backgroundColor: COLOR.primary,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  appBarContent: {
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
  },
  cardLg: {
    width: 130,
    height: 130,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
  },
  textCard: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium
  },
  iconCard: {
    marginLeft: 35,
    marginTop: 10,
    color: 'white',
  },
  InputItem: {
    width: '100%',
    borderRadius: 4,
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
  btnLg: {
    minWidth: 200,
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
  },
  input: {
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    height: 66,
    marginHorizontal: 20,
    paddingLeft: 40,
    borderRadius: 25,
    fontSize: 20,
    fontFamily: 'Prompt-Light',
    color: '#ffffff',
  },
  inputOutline: {
    backgroundColor: 'rgba(0, 172, 200, 0.2)',
    height: 66,
    marginHorizontal: 20,
    paddingLeft: 40,
    borderRadius: 25,
    borderColor: 'rgba(0, 172, 200, 0.6)',
    borderWidth: 3,
    fontSize: 20,
    fontFamily: 'Prompt-Light',
    color: 'rgba(0, 172, 200, 1)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    opacity: 0.5,
  },
  container_bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  card_custom: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 16,
  },
});
