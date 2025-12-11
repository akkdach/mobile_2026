import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { StackActions, useNavigation } from '@react-navigation/native';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import styles from '../../components/StyleSheet';
import LocalStorageKey from '../../constants/LocalStorageKey';
import { ROUTE } from '../../constants/RoutePath';
import { LoginResponseInterface } from '../../models/login';
import { IMenu } from '../../models/menu';
import { _getData } from '../../utils/AsyncStorage';
import learningCenterCss from './WorklistPageCss';
import { UseNotiContext } from '../../reducer/NotifyContext';
const logo = require('../../../assets/logo.png');


const WorklistPage = (props: any) => {
  const [menus, menusSet] = useState<IMenu[]>([]);
  const [userProfile, setUserProfile] = useState<LoginResponseInterface>();
  const [workNotify, setWorkNotify, notiCount, fetNoniCount] = UseNotiContext()
  const navigation = useNavigation();

  const getUserProfile = async () => {
    const result = await _getData({ key: LocalStorageKey.userInfo });
    const userInformation = JSON.parse(String(result));
    setUserProfile(userInformation);
    console.log(userProfile)
  };

  useEffect(() => {
    getUserProfile();
    fetNoniCount()

    menusSet([
      {
        title: 'อนุมัติเปลี่ยนฯ',
        iconName: 'sync',
        size: 70,
        route: ROUTE.APPROVE_WORK_LIST,
      },
      // {
      //   title: 'อนุมัติ OT',
      //   iconName: 'clock',
      //   size: 70,
      //   route: ROUTE.APPROVE_OT,
      // },
      {
        title: 'อนุมัติโอนอะไหล่',
        iconName: 'check',
        size: 70,
        route: ROUTE.SPARE_PART_REQUEST_TRANSFER_APPROVE,
      },
      // {
      //   title: 'โอนงาน​ ฯ',
      //   iconName: 'briefcase',
      //   size: 70,
      //   route: ROUTE.MAIN,
      // },
      // {
      //   title: 'โอนอะไหล่ ฯ',
      //   iconName: 'toolbox',
      //   size: 70,
      //   route: ROUTE.MAIN,
      // },
      // {
      //   title: 'โอนเครื่องมือ',
      //   iconName: 'tools',
      //   size: 70,
      //   route: ROUTE.MAIN,
      // },
    ]);
  }, []);

  const cardWidget = (menu: IMenu, idx?: number) => {
    return (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          navigation.dispatch(StackActions.push(menu.route, { profile: userProfile }));
        }}
        style={learningCenterCss.flexListMenuItem}
        key={`menu-${idx}`}>
        <View style={styles.card}>
          <View style={stylesbadge.iconWrapper}>
            <Avatar.Icon
              size={menu.size}
              icon={menu.iconName}
              style={stylesbadge.iconCard}
            />
            {notiCount.to_approve > 0 && (
              <View style={stylesbadge.badge}>
                <Text style={stylesbadge.badgeText}>{notiCount.to_approve}</Text>
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
      <BackGroundImage
        components={
          <Animated.View>
            <View style={{ width: '100%' }}>
              <AppBar
                title="รายการรออนุมัติ"
                rightTitle={`${userProfile?.wk_ctr}`}
                replacePath={ROUTE.APP_MAIN}
              ></AppBar>
            </View>
            <ScrollView>
              <View style={[learningCenterCss.cardLogoCompany]}>
                <Image style={learningCenterCss.logoCompany} source={logo} />
              </View>
              <View style={learningCenterCss.container}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 20,
                    paddingTop: 30,
                  }}>
                  <View style={learningCenterCss.flexListMenu}>
                    {menus.map((menu: IMenu, idx: number) => cardWidget(menu, idx))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        }></BackGroundImage>
    </>
  );
};

export default WorklistPage;
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
  iconCard: {
    marginLeft: 25,
    marginTop: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
