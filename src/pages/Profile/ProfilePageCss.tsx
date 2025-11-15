import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants/Colors';

export default StyleSheet.create({
  appBar: {
    backgroundColor: COLOR.primary,
  },
  appBarContent: {
    fontWeight: 'bold',
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
  input: {
    height: 62,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    fontSize: 18,
    borderColor: COLOR.secondary_primary_color,
    marginBottom: 10,
    borderRadius: 20,
  },
  logo: {
    width: 400,
    height: 70,
  },
  logo2: {
    width: 60,
    height: 60,
    marginLeft: 30,
    marginTop: 10,
  },
  logo3: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
});
