import {StyleSheet,Dimensions} from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
const screenInfo = Dimensions.get('screen');
export default StyleSheet.create({
  container: {
    borderColor: 'gray',
    borderWidth: 2,
    margin: screenInfo.width > 500 ? 40 : 10,
    padding: 20,
  },
  mapLocation: {
      fontSize: 20,
      flexDirection: 'column'
  },
  txtDetail: {
    fontSize: screenInfo.width>500 ? 20 : 16,
    marginBottom: 5,
    fontFamily: Fonts.Prompt_Light
  },
  btn: {
    width: '50%',
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
  mapView:{
    height:650,
    width:'100%'
  },
  mapButton:{alignItems: 'center',marginBottom:100}
});
