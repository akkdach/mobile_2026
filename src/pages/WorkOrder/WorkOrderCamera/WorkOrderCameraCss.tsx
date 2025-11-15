import {StyleSheet} from 'react-native';
import {COLOR} from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export default StyleSheet.create({
  textTitle: {
    color: COLOR.primary,
    fontSize: 18,
    fontWeight: 'bold',
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
  subLabelInput: {
    paddingLeft: 20,
    fontSize: 18,
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
    backgroundColor: COLOR.primary,
    borderRadius: 35,
    marginTop: 20,
  },
  btn_submit: {
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
  image: {
    height: 300,
    width: '100%',
  },
  titleLabel: {
    color: COLOR.primary,
    fontSize: 20,
    fontFamily: Fonts.Prompt_Medium,
    paddingTop:40
  },
});
