import { Badge, Button, Icon, Modal } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ColorValue,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { COLOR } from '../constants/Colors';
import { Fonts } from '../constants/fonts';
import LocalStorageKey from '../constants/LocalStorageKey';
import { CheckInt, mainMenus } from '../constants/MainMenu';
import { LoginResponseInterface } from '../models/login';
import { NotifyContext } from '../reducer/NotifyContext';
import {
  checkCockInCockOut,
  checkCockInCockOutStamp,
} from '../services/cockinService';
import { updatedNotificationService } from '../services/notify';
import { _getData } from '../utils/AsyncStorage';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
const logo = require('../../assets/logo.png');
import 'moment/locale/th';

const MainMenuPage = () => {
  const colorCockOut = '#E74C3C';
  const colorCockIn = '#2ECC71';
  const [workNotify, setWorkNotify] = useContext(NotifyContext);
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [timesCheckIn, setTimeCheckIn] = useState<any>('');
  const [timesCheckOut, setTimeCheckOut] = useState<any>('');
  const [colorCheckIn, setColorCheckIn] = useState<any>(colorCockOut);
  const [times, setTime] = useState<any>('00:00');
  const [userInfo, setUserInfo] = useState<LoginResponseInterface>();
  const [menuTab, setMenuTab] = useState<any>();
  const navigation = useNavigation();

  const _onClickModalCheckInCheckOut = () => {
    const timesCurrent = moment().locale('th').add(543, 'year').format('HH:mm');
    setTime(`${timesCurrent}`);
    setStateVisibleModal(!visibleModal);
  };

  useEffect(() => {
    (async () => {
      const result = await _getData({ key: LocalStorageKey.userInfo });
      const userInformation = JSON.parse(String(result));
      setUserInfo(userInformation);
    })();
  }, []);

  useEffect(() => {
    const loadClockIn = async function () {
      const result = await checkCockInCockOut();
      if (result.isClockCurrentDate) {
        setTimeCheckIn(result.clockInTime);
        setColorCheckIn(colorCockIn);
      } else {
        setTimeCheckOut(result.clockOutTime);
        setColorCheckIn(colorCockOut);
      }
      const resultUser = await _getData({ key: LocalStorageKey.userInfo });
      const userInformation = JSON.parse(String(resultUser));
      setMenuTab(mainMenus(userInformation.role));
    };
    loadClockIn();
    return () => {
      loadClockIn(); // This worked for me
    };
  }, []);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSM);
    } else {
      setStyles(stylesLG);
    }

  },[screenInfo]);

  const CheckInCheckOut = async (type: String) => {
    Alert.alert(
      'แจ้งเตือน',
      type == 'checkIn'
        ? 'คุณต้องการลงเวลาเข้างาน ?'
        : 'คุณต้องการลงเวลาออกงาน ?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ตกลง',
          onPress: async () => {
            const timesCurrent = moment()
              .locale('th')
              .add(543, 'year')
              .format('HH:mm');
            if (type == 'checkIn') {
              if (timesCheckIn == '') {
                  setTimeCheckIn(`${timesCurrent}`);
                  setColorCheckIn(colorCockIn);
                  await checkCockInCockOutStamp();
                  _onClickModalCheckInCheckOut();
              }
            } else {
              if (timesCheckIn != '' && timesCheckOut == '') {
                setTimeCheckOut(`${timesCurrent}`);
                setColorCheckIn(colorCockOut);
                await checkCockInCockOutStamp();
                _onClickModalCheckInCheckOut();
              }
            }
          },
        },
      ],
    );
  };

  const BottomWidget = (
    title?: string,
    action?: any,
    disabled?: boolean,
    colorBackground?: any,
  ) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button
          disabled={disabled}
          style={[
            styles.btn,
            {width:150},
            colorBackground && { backgroundColor: colorBackground },
          ]}
          onPress={action}>
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              fontFamily: Fonts.Prompt_Medium,
            }}>
            {title}
          </Text>
        </Button>
      </View>
    );
  };

  const BuildModalCheckInCheckOut = () => {
    const date = moment().locale('th').add(543, 'year').format('DD/MM/YYYY');
    const dayNames = [
      'วันอาทิตย์',
      'วันจันทร์',
      'วันอังคาร',
      'วันพุทธ',
      'วันพฤหัสบดี',
      'วันศุกร์',
      'วันเสาร์',
    ];
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.checkInOutWorkModal]}
        visible={visibleModal}>
        <View>
          <ScrollView>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => {
                  _onClickModalCheckInCheckOut();
                }}>
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>
            <View style={[{ paddingLeft: 40, paddingRight: 40 }]}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderBottomWidth: 2,
                      width: 160,
                      borderBottomColor: COLOR.secondary_primary_color,
                    }}>
                    <Text
                      style={{
                        fontSize: 48,
                        fontFamily: Fonts.Prompt_Medium,
                        color: COLOR.secondary_primary_color,
                      }}>
                      {times}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[styles.checkOutText2]}>
                      {dayNames[moment().day()]}, {date}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 40,
              }}>
              <View>
                {BottomWidget(
                  'เข้างาน',
                  timesCheckIn === '' ? () => CheckInCheckOut('checkIn') : null,
                  timesCheckIn != '' ? true : false,
                )}
              </View>
              <View style={[styles.checkInOutW100]}></View>
              <View >
                {BottomWidget(
                  'ออกงาน',
                  timesCheckIn != '' && timesCheckOut === ''
                    ? () => CheckInCheckOut('checkOut')
                    : null,
                  timesCheckIn === ''
                    ? true
                    : timesCheckOut != ''
                      ? true
                      : false,
                )}
              </View>
            </View>
            <View style={{ marginTop: 20, left: 20 }}>
              <Text
                style={[styles.checkOutText2]}>
                การลงเวลา
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <View style={{ flexDirection: 'column' }}>
                <View
                  style={[styles.checkInOutBoxR]}>
                  <Text
                    style={[styles.checkOutText2]}>
                    เข้างาน
                  </Text>
                  <Text
                    style={styles.checkOutText}>
                    {timesCheckIn ? timesCheckIn : '00:00'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'column' }}>
                <View
                  style={[styles.checkInOutBoxR]}>
                  <Text
                    style={[styles.checkOutText2]}>
                    ออกงาน
                  </Text>
                  <Text
                    style={styles.checkOutText}>
                    {timesCheckOut ? timesCheckOut : '00:00'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const buildItemMenu = (
    icon?: any,
    title?: string,
    route?: any,
    titleStyle?: TextStyle,
    iconNotification?: boolean,
    iconNotificationColor?: ColorValue,
  ) => {
    const keyRandom = new Date().valueOf();
    return (
      <TouchableHighlight
        underlayColor="#fff"
        key={`${icon}${keyRandom}-${title}`}
        onPress={() => {
          if (
            ['Work Order', 'แหล่งความรู้', 'ประกาศ'].indexOf(String(title)) >= 0
          ) {
            const gWorkNotify = workNotify;
            const updateNotify = {
              news: false,
              knowledge: false,
              workOrder: false,
            };
            switch (title) {
              case 'Work Order':
                if (workNotify.workOrderCount > 0) {
                  setWorkNotify({
                    ...gWorkNotify,
                    workOrderCount: 0,
                  });
                  updateNotify.workOrder = true;
                }
                break;
              case 'แหล่งความรู้':
                if (workNotify.knowledgeCount > 0) {
                  setWorkNotify({
                    ...gWorkNotify,
                    knowledgeCount: 0,
                  });
                  updateNotify.knowledge = true;
                }
                break;
              case 'ประกาศ':
                if (workNotify.newsCount > 0) {
                  setWorkNotify({
                    ...gWorkNotify,
                    newsCount: 0,
                  });
                  updateNotify.news = true;
                }
                break;
              default:
                break;
            }
            updatedNotificationService(updateNotify).catch(console.log);
          }
          if (typeof route == 'function') {
            return route();
          }
        }}>
        <View style={[styles.card]}>
          {iconNotification == true && (
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor:
                  title === 'Work Order' ? 'red' : iconNotificationColor,
                borderRadius: 100,
                marginTop: title === 'Work Order' ? 0 : -8,
                top: 0,
                right: 0,
                marginRight: -6,
                position: 'absolute',
              }}
            />
          )}
          {workNotify.workOrderCount > 0 && title === 'Work Order' && (
            <Badge
              text={workNotify.workOrderCount}
              style={{
                top: 0,
                right: 0,
                marginTop: 10,
                marginRight: 10,
                position: 'absolute',
                zIndex: 99,
              }}></Badge>
          )}
          {workNotify.newsCount > 0 && title === 'ประกาศ' && (
            <Badge
              text={workNotify.newsCount}
              style={{
                top: 0,
                right: 0,
                marginTop: 10,
                marginRight: 10,
                position: 'absolute',
                zIndex: 99,
              }}></Badge>
          )}
          {workNotify.knowledgeCount > 0 && title === 'แหล่งความรู้' && (
            <Badge
              text={workNotify.knowledgeCount}
              style={{
                top: 0,
                right: 0,
                marginTop: 10,
                marginRight: 10,
                position: 'absolute',
                zIndex: 99,
              }}></Badge>
          )}
          <Icon name={icon} size={screenInfo.width <= 500 ? 25 : 50} style={styles.iconCard} />
          <Text style={[styles.textCard, titleStyle]}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  const BuildLogo = () => {
    return (
      <View
        style={[styles.BuildLogo]}>
        <Image style={styles.logo} source={logo} />
      </View>
    );
  };

  const buildProfile = () => {
    return (
      <View>
        <View
          style={[styles.buildProfile]}>
          {userInfo?.urlProfile != '' && userInfo?.urlProfile != null ?
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                borderWidth: 6,
                borderColor: '#00acc8',
                marginBottom: 10,
                alignSelf: 'center',
                marginTop: 40,
              }}
              source={{
                uri: userInfo?.urlProfile + `?v=${Math.floor(Math.random() * 100) + 1}`,
              }}
            /> :
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                borderWidth: 6,
                borderColor: '#00acc8',
                marginBottom: 10,
                alignSelf: 'center',
                marginTop: 40,
              }}
              source={{
                uri: 'https://cdn.iconscout.com/icon/free/png-512/boy-avatar-4-1129037.png',
              }}
            />
          }
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 14,
                color: COLOR.secondary_primary_color,
              }}>
              {userInfo?.fullName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Bold,
                fontSize: 14,
                color: COLOR.gray,
              }}>
              WorkCenter:&nbsp;
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 14,
                color: COLOR.secondary_primary_color,
              }}>
              {userInfo?.wk_ctr}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTabs = () => {
    return [
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../assets/images/bg.png')}>
        <View
          style={[styles.container]}>
          {BuildLogo()}
          {buildProfile()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 5,
            }}>
            <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
              <View style={styles.cardEmpty} />
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
              <View style={styles.cardEmpty} />
            </TouchableHighlight>
            {menuTab?.checkInt.map((item: CheckInt) => {
              if (item.modals) {
                return buildItemMenu(
                  item?.icon,
                  item?.title,
                  () => _onClickModalCheckInCheckOut(),
                  { fontSize: 14 },
                  true,
                  colorCheckIn,
                );
              } else {
                return buildItemMenu(
                  item?.icon,
                  item?.title,
                  () => {
                    navigation.dispatch(StackActions.push(item?.route))
                  },
                  { fontSize: 14 },
                );
              }
            })}
          </View>
          {menuTab?.listMenu  ? (<>
            {screenInfo.width > 500 && <View style={[styles.listMenu]}>
              <FlatGrid
                key={'list-menu'}
                itemDimension={screenInfo.width / 4 - 50}
                data={menuTab?.listMenu}
                style={styles.gridView}
                keyExtractor={(item, index) =>
                  `${Math.floor(Math.random() * 1001)}`
                }
                listKey={moment().valueOf().toString()}
                // fixed
                spacing={20}
                renderItem={({ item }) =>
                  buildItemMenu(item?.icon, item?.title, () =>
                    navigation.dispatch(StackActions.push(item.route))
                  )
                }
                scrollEnabled={false}
              />
            </View> }
            {screenInfo.width <= 500 && <View style={[styles.listMenu]}>
              <FlatGrid
                key={'list-menu'}
                itemDimension={screenInfo.width / 3 - 50}
                data={menuTab?.listMenu}
                style={styles.gridView}
                keyExtractor={(item, index) =>
                  `${Math.floor(Math.random() * 1001)}`
                }
                listKey={moment().valueOf().toString()}
                // fixed
                spacing={10}
                renderItem={({ item }) =>
                  buildItemMenu(item?.icon, item?.title, () =>
                    navigation.dispatch(StackActions.push(item?.route))
                  )
                }
                scrollEnabled={false}
              />
            </View> }
            </>) : null}
        </View>
        {BuildModalCheckInCheckOut()}
      </ImageBackground>,
    ];
  };

  return <>{<SafeAreaView style={{}}>
    <ScrollView>
    {renderTabs()}
    </ScrollView>
    </SafeAreaView>}</>;
};

const stylesLG = StyleSheet.create({
  checkInOutW100:{ width: 100 },
  checkInOutWorkModal:{ width: 690, height: 580, borderRadius: 15 },
  checkOutText2:{
    fontFamily: Fonts.Prompt_Light,
    fontSize: 24,
    color: COLOR.gray,
  },
  checkOutText:{
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 24,
    color: COLOR.secondary_primary_color,
  },
  BuildLogo: {
    left: 20,
    marginTop: 50,
  },
  buildProfile: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  listMenu:{
    height:600
  },
  btn: {
    width: 250,
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: COLOR.secondary_primary_color,
    backgroundColor: COLOR.secondary_primary_color,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  containerDrawer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  children: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    opacity: 0.5,
  },
  logo: {
    width: 280,
    height: 50,
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
  inputext: {
    width: 70,
    height: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    borderColor: '#0062a7',
    backgroundColor: '#0062a7',
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
    marginLeft:5
  },
  cardEmpty: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  textTopCard: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,
    paddingTop: 10,
  },
  textCard: {
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 10,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,
  },
  iconCard: {
    marginLeft: 30,
    marginTop: 1,
    color: 'white',
  },

  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 200,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  checkInOutBoxR:{
    padding: 5,
    borderColor: COLOR.secondary_primary_color,
    borderWidth: 2,
    width: 150,
    right: -30,
  },
});

const stylesSM = StyleSheet.create({
  checkInOutBoxR:{
    padding: 5,
    borderColor: COLOR.secondary_primary_color,
    borderWidth: 2,
    width: 150,
    right: 0,
  },
  checkInOutW100:{ width: 5 },
  checkInOutWorkModal:{ width: '95%', height: 580, borderRadius: 15 },
  checkOutText2:{
    fontFamily: Fonts.Prompt_Light,
    fontSize: 20,
    color: COLOR.gray,
  },
  checkOutText:{
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 16,
    color: COLOR.secondary_primary_color,
  },
  BuildLogo: {
    left: 3,
    marginTop: 10,
  },
  buildProfile:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -20,
  },
  listMenu:{
    height:'auto',
    width:'96%',
    paddingBottom: 100
  },
  btn: {
    width: 250,
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: COLOR.secondary_primary_color,
    backgroundColor: COLOR.secondary_primary_color,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  containerDrawer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  children: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    opacity: 0.5,
  },
  logo: {
    width: 280,
    height: 50,
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
  inputext: {
    width: 70,
    height: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    borderColor: '#0062a7',
    backgroundColor: '#0062a7',
  },
  card: {
    width: 85,
    height: 85,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
    marginLeft:5
  },
  cardEmpty: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    display:'none'
  },
  textTopCard: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,
    paddingTop: 10,
  },
  textCard: {
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 3,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,

  },
  iconCard: {
    marginLeft: 30,
    marginTop: 1,
    color: 'white',
  },

  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 200,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

export default MainMenuPage;
