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
import styles from '../../components/StyleSheet';
import LocalStorageKey from '../../constants/LocalStorageKey';
import { ROUTE } from '../../constants/RoutePath';
import { LoginResponseInterface } from '../../models/login';
import { IMenu } from '../../models/menu';
import { _getData } from '../../utils/AsyncStorage';
import sparePartCss from './SparePartCss';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { useFetchNotification } from '../../reducer/Notifiaction';
import { UseNotiContext } from '../../reducer/NotifyContext';
import { useNavigation, StackActions } from '@react-navigation/native'

const logo = require('../../../assets/logo.png');
const innitMenu = [
  {
    title: 'คงเหลือ',
    iconName: 'battery-charging-20',
    size: 70,
    route: ROUTE.SPARE_PART_BALANCE,
  },
  {
    title: 'ขอโอนอะไหล่',
    iconName: 'transfer',
    size: 70,
    route: ROUTE.SPARE_PART_REQUEST_TRANSFER,
  },
  // {
  //   title: 'ขอโอนอะไหล่จาก VAN',
  //   iconName: 'transfer',
  //   size: 70,
  //   route: ROUTE.SPARE_PART_REQUEST_TRANSFER_VAN,
  // },
  {
    title: 'รออนุมัติโอน',
    iconName: 'transfer',
    size: 70,
    route: ROUTE.SPARE_PART_REQUEST_TRANSFER_WITE_APPROVE,
    badgeCount: 0
  },
  // {
  //   title: 'อนุมัติขอโอน',
  //   iconName: 'check',
  //   size: 70,
  //   route: ROUTE.SPARE_PART_REQUEST_TRANSFER_APPROVE,
  // },
  // {
  //   title: 'โอนอะไหล่',
  //   iconName: 'transfer',
  //   size: 70,
  //   route: ROUTE.SPARE_PART_TRANSFER,
  // },
  // {
  //   title: 'รับอะไหล่ VAN',
  //   iconName: 'inbox-arrow-down',
  //   size: 70,
  //   route: ROUTE.SPARE_PART_VAN_CHECK,
  // },
  {
    title: 'รับอะไหล่สโตร์',
    iconName: 'inbox-arrow-down',
    size: 70,
    route: ROUTE.SPARE_PART_STORE_TRANSFER_CHECK,
  },
  {
    title: 'รายการรอเคลม',
    iconName: 'inbox-arrow-down',
    size: 70,
    route: ROUTE.CLAIM_PARTS_SCREEN,
  },
  // {
  //   title: 'ตรวจนับอะไหล่',
  //   iconName: 'order-bool-ascending-variant',
  //   size: 70,
  //   route: ROUTE.SPARE_PART_CHECK_PAGE,
  // },
];
const SparePartPage: React.FC = () => {
  const [menus, menusSet] = useState<IMenu[]>([]);
  const [userProfile, setUserProfile] = useState<LoginResponseInterface>();
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [workNotify, setWorkNotify, notiCount, fetNoniCount] = UseNotiContext()
  const navigation = useNavigation()

  const getUserProfile = async () => {

    const result = await _getData({ key: LocalStorageKey.userInfo });
    const userInformation = JSON.parse(String(result));
    setUserProfile(userInformation);
    // console.log('userInformation', userInformation);
  };
  useEffect(() => {
    mapNoniCount(notiCount);
  }, [notiCount])

  const mapNoniCount = (notiCount:any) => {
    if (notiCount) {
      var newMenu = innitMenu.map((item: any) => {
        if (item.route == "sparePartRequestTransferWiteApprove") {
          return { ...item, badgeCount: notiCount?.spare_part_approve ?? 0 }
        } else {
          return item;
        }
      })
      console.log(newMenu);
      menusSet(newMenu);
    }
  }

  useEffect(() => {
    fetNoniCount();
    getUserProfile();
    menusSet(innitMenu);
  }, []);



  const cardWidget = (menu: IMenu, idx: number) => {
    return (<>
      {ScreenWidth > 500 && <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          navigation.dispatch(StackActions.push(menu.route, { profile: userProfile }));
        }}
        style={sparePartCss.flexListMenuItem}
        key={`${menu.title}-${idx}`}>
        <View style={styles.card}>
          <Text style={styles.textCard}>{menu.title}</Text>
          <Avatar.Icon
            size={menu.size}
            icon={menu.iconName}
            style={sparePartCss.iconCard}
          />
        </View>
      </TouchableHighlight>}
      {ScreenWidth <= 500 && <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          navigation.dispatch(StackActions.push(menu.route, { profile: userProfile }));
        }}
        style={sparePartCss.flexListMenuItem2}
        key={`${menu.title}-${idx}`}>
        <View style={styles.card}>
          <Text style={styles.textCard}>{menu.title}</Text>
          <Avatar.Icon
            size={40}
            icon={menu.iconName}
            style={sparePartCss.iconCard2}
          />
        </View>
      </TouchableHighlight>}
    </>
    );
  };

  const cardWidget2 = (menu: IMenu, idx: number) => {
    const isLargeScreen = ScreenWidth > 500;
    const badgeCount = menu?.badgeCount || -1;

    return (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          navigation.dispatch(StackActions.push(menu.route, { profile: userProfile }));
        }}
        style={isLargeScreen ? sparePartCss.flexListMenuItem : sparePartCss.flexListMenuItem2}
        key={`${menu.title}-${idx}`}
      >
        <View style={styles.card}>
          <View style={stylesbadge.iconWrapper}>
            <Avatar.Icon
              size={isLargeScreen ? menu.size : 40}
              icon={menu.iconName}
              style={isLargeScreen ? sparePartCss.iconCard : sparePartCss.iconCard2}
            />
            {badgeCount >= 0 && (
              <View style={stylesbadge.badge}>
                <Text style={stylesbadge.badgeText}>{badgeCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.textCard}>{menu.title}</Text>
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
          title="รายการอะไหล่"
          rightTitle={`${userProfile?.wk_ctr}`}
          replacePath={ROUTE.APP_MAIN}></AppBar>
        <Animated.ScrollView>
          <ScrollView>
            <View style={sparePartCss.cardLogoCompany}>
              <Image style={sparePartCss.logoCompany} source={logo} />
            </View>
            <View style={sparePartCss.container}>
              <View style={sparePartCss.flexListMenu}>
                {menus.map((menu: IMenu, idx: number) => cardWidget2(menu, idx))}
              </View>
            </View>
          </ScrollView>
        </Animated.ScrollView>
      </ImageBackground>
    </>
  );
};

export default SparePartPage;


const stylesbadge = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',

    // เงาสำหรับ iOS
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // เงาสำหรับ Android
    elevation: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textCard: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Prompt-Medium',
  },
});
