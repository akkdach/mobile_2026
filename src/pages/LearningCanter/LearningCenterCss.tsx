import {StyleSheet} from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    paddingLeft: ScreenWidth> 500 ? 40 : 5,
    paddingRight:  ScreenWidth> 500 ?  40 : 5,
    paddingBottom: 40,
    marginTop: 40
  },
  flexListMenu: {
    flexDirection: 'row',
    flex: ScreenWidth > 500 ? 4 : 3,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    
  },
  flexListMenuItem: {
    padding: ScreenWidth > 500 ? 25 : 2
  },
  cardLogoCompany: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    width: '100%' ,
    marginTop: 40,
  },
  logoCompany: {
    width: ScreenWidth > 500 ? 400 : 200 ,
    height: ScreenWidth > 500 ? 70: 30,
    margin:'auto'
  },
  iconCard: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: 'white',
  },
});
