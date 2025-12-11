import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Avatar } from 'react-native-paper';
import AppBar from '../../components/AppBar';
import styleSheet from '../../components/StyleSheet';
import LocalStorageKey from '../../constants/LocalStorageKey';
import { ROUTE } from '../../constants/RoutePath';
import { LoginResponseInterface } from '../../models/login';
import { IMenu } from '../../models/menu';
import { _getData } from '../../utils/AsyncStorage';
import { useNavigation, StackActions } from '@react-navigation/native'

const logo = require('../../../assets/logo.png');

const ToolsPage = () => {
  const [menus, menusSet] = useState<IMenu[]>([]);
  const [userProfile, setUserProfile] = useState<LoginResponseInterface>();

  const getUserProfile = async () => {
    const result = await _getData({key: LocalStorageKey.userInfo});
    const userInformation = JSON.parse(String(result));
    setUserProfile(userInformation);
  };

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  },[screenInfo]);
  useEffect(() => {
    getUserProfile();
    menusSet([
      {
        title: 'คงเหลือ',
        iconName: 'battery-charging-20',
        size: 70,
        route: ROUTE.TOOLS_BALANCE,
      },
      {
        title: 'ขอโอนเครื่องมือ',
        iconName: 'transfer',
        size: 70,
        route: ROUTE.TOOLS_REQUEST_TRANSFER,
      },
      {
        title: 'โอนเครื่องมือ',
        iconName: 'transfer',
        size: 70,
        route: ROUTE.TOOLS_TRANSFER,
      },
      {
        title: 'รับเครื่องมือ VAN',
        iconName: 'inbox-arrow-down',
        size: 70,
        route: ROUTE.TOOL_VAN_CHECK,
      },
      {
        title: 'รับเครื่องมือสโตร์',
        iconName: 'inbox-arrow-down',
        size: 70,
        route: ROUTE.TOOL_STORE_TRANSFER_CHECK,
      },
    ]);
  }, []);

  const cardWidget = (menu: IMenu, idx: number) => {
    return (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          navigation.dispatch(
            StackActions.push(menu.route, {profile: userProfile})
          );
        }}
        style={styles.flexListMenuItem}
        key={`${menu.title}-${idx}`}>
        <View style={styleSheet.cardLg}>
          <Text style={styleSheet.textCard}>{menu.title}</Text>
          <Avatar.Icon
            size={menu.size}
            icon={menu.iconName}
            style={styles.iconCard}
          />
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../assets/images/bg.png')}>
        <AppBar
          title="รายการเครื่องมือ"
          rightTitle={`${userProfile?.wk_ctr}`}
          replacePath={ROUTE.APP_MAIN}></AppBar>
        <Animated.ScrollView>
          <ScrollView>
            <View style={styles.cardLogoCompany}>
              <Image style={styles.logoCompany} source={logo} />
            </View>
            <View style={styles.container}>
              <View style={styles.flexListMenu}>
                {menus.map((menu: IMenu, idx: number) => cardWidget(menu, idx))}
              </View>
            </View>
          </ScrollView>
        </Animated.ScrollView>
      </ImageBackground>
    </>
  );
};

const stylesLg = StyleSheet.create({
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
    padding: 15,
  },
  cardLogoCompany: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  logoCompany: {
    width: 350,
    height: 50,
  },
  iconCard: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: 'white',
  },
});


const stylesSm = StyleSheet.create({
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
    padding: 5,
  },
  cardLogoCompany: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  logoCompany: {
    width: 350,
    height: 50,
  },
  iconCard: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: 'white',
  },
});

export default ToolsPage;
