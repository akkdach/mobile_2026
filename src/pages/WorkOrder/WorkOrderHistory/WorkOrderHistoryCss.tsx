import {StyleSheet} from 'react-native';
import {COLOR} from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  textTitle: {
    color: COLOR.primary,
    fontSize: ScreenWidth > 500 ? 18 : 12,
    padding: 8,
    fontFamily: Fonts.Prompt_Medium
  },
  textContent: {
    fontSize:  ScreenWidth > 500 ? 18 : 12,
    padding: 8,
    color: '#9B9B9B',
    fontFamily: Fonts.Prompt_Light
  },
  titleProblems: {
    fontSize:  ScreenWidth > 500 ? 18 : 12,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
  },
  titleProblemsDetails: {
    fontSize:  ScreenWidth > 500 ? 18 : 12,
    padding: 8,
    color: '#9B9B9B',
    fontFamily: Fonts.Prompt_Light
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize:  ScreenWidth > 500 ? 18 : 12,
    fontFamily: Fonts.Prompt_Medium,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    textAlign: 'center',
    fontSize:  ScreenWidth > 500 ? 18 : 12,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor : COLOR.primary,
    padding: 20,
    borderBottomColor: '#F9F9F9',
    borderBottomWidth: 1,
  },
  collapsibleTitle: {
    fontSize:  ScreenWidth > 500 ? 18 : 12,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.white,
  },
  dataTableCell: {
    fontSize: ScreenWidth > 500 ? 14 : 12,
    fontFamily: Fonts.Prompt_Light,
    padding:2
  }
});
