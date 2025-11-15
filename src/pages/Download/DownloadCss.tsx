import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    marginTop: 40,
  },
  flexListMenu: {
    flexDirection: 'row',
    flex: 4,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  flexListMenuItem: {
    padding: 25
  },
  cardLogoCompany: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  logoCompany: {
    width: 400,
    height: 70,
  },
  iconCard: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: 'white',
  },
});
