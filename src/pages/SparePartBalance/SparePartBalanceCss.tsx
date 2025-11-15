import {StyleSheet} from 'react-native';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';

export default StyleSheet.create({
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  }
});
