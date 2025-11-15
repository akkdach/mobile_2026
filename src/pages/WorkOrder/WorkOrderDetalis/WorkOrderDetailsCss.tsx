import {StyleSheet} from 'react-native';
import {COLOR} from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export const styleLg =()=>{
  return  StyleSheet.create({
  textTitle: {
    color: COLOR.primary,
    fontSize: 18,
    padding: 8,
    fontFamily: Fonts.Prompt_Medium
  },
  textContent: {
    fontSize: 16,
    padding: 8,
    color: '#9B9B9B',
    fontFamily: Fonts.Prompt_Light
  },
  titleProblems: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
  },
  titleProblemsDetails: {
    fontSize: 16,
    padding: 8,
    color: '#9B9B9B',
    fontFamily: Fonts.Prompt_Light
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 16,
    fontFamily: Fonts.Prompt_Medium,
  },
  dataTableCell: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Light
  },
  DrawHorizontalWidget:{
    paddingLeft: 40,
    paddingRight: 40,
  },flextEnd:{
    flex:3,
    alignItems:'flex-end',
    paddingRight:10
  },
  flextStart:{
    flex:3,
    alignItems:'flex-start'
  }
});
}


export const styleSm =()=>{
  return  StyleSheet.create({
  textTitle: {
    color: COLOR.primary,
    fontSize: 14,
    padding: 8,
    fontFamily: Fonts.Prompt_Medium
  },
  textContent: {
    fontSize: 12,
    padding: 8,
    color: '#9B9B9B',
    fontFamily: Fonts.Prompt_Light
  },
  titleProblems: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Medium,
    color: COLOR.primary,
  },
  titleProblemsDetails: {
    fontSize: 14,
    padding: 8,
    color: '#9B9B9B',
    fontFamily: Fonts.Prompt_Light
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 12,
    fontFamily: Fonts.Prompt_Medium,
  },
  dataTableCell: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Light
  },DrawHorizontalWidget:{
    paddingLeft: 0,
    paddingRight: 0,
  },flextEnd:{
    flex:2,
    alignItems:'flex-end',
    paddingRight:10
  },
  flextStart:{
    flex:3,
    alignItems:'flex-start'
  }
});
}
