import {StyleSheet} from 'react-native';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';

export default StyleSheet.create({
  orderTextStyle: {
    flex: 1, 
    width: "100%", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10
  },
  labelStyle: {
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 18
  },
  dataTableCell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 16
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
  },
  dataTable_title_center: {
    justifyContent: 'center'
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
});
