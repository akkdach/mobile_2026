import {StyleSheet} from 'react-native';
import {COLOR} from '../../constants/Colors';
import {Fonts} from '../../constants/fonts';

export default StyleSheet.create({
  btn: {
    width: 250,
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: COLOR.neonRed,
    backgroundColor: COLOR.neonRed,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  btnPrimary: {
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
  }
});
