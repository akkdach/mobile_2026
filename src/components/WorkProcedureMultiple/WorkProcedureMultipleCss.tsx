import {StyleSheet} from 'react-native';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  textTitle: {
    color: COLOR.primary,
    fontSize: ScreenWidth > 500 ? 20 :16,
    fontFamily: Fonts.Prompt_Medium,
  },
  input: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    fontSize: ScreenWidth > 500 ? 18 :12,
    borderColor: COLOR.secondary_primary_color,
    marginBottom: 10,
    borderRadius: 20,
  },
  labelInput: {
    paddingRight: 20,
    fontSize: ScreenWidth > 500 ? 18 :12,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium
  },
  subLabelInput: {
    paddingLeft: 20,
    fontSize: ScreenWidth > 500 ? 18 :12,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium
  },
  btn: {
    width: '100%',
    height:ScreenWidth>500? 60:50,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:ScreenWidth>500? 22:16,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.primary,
    borderRadius: 35,
    marginTop:ScreenWidth>500? 20:5,
  },
  btn_submit: {
    width: '100%',
    height: ScreenWidth>500 ?60:50,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:ScreenWidth>500? 22:14,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop:ScreenWidth>500? 20:5,
  },
  image: {
    height: 300,
    width: '100%',
  },
  titleLabel: {
    color: COLOR.primary,
    fontSize: ScreenWidth > 500? 20:14,
    fontFamily: Fonts.Prompt_Medium,
    paddingTop:ScreenWidth>500 ?40:10,
  },
});
