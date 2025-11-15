import {StyleSheet} from 'react-native';
import {COLOR} from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export const stylesLg = ()=>{ return StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
  },
  titleRadio: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.gray,
  },
  labelRadio: {
    fontSize: 16,
    padding: 6,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.gray,
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
    color: COLOR.secondary_primary_color
  },
  labelRemark: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
    padding:10
  },
  btn: {
    width: '100%',
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
});
}

export const stylesSm = ()=>{ return StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
  },
  titleRadio: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.gray,
  },
  labelRadio: {
    fontSize: 16,
    padding: 6,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.gray,
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
    color: COLOR.secondary_primary_color
  },
  labelRemark: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
    padding:10
  },
  btn: {
    width: '100%',
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
});
}
