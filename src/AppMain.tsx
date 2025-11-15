import {Icon} from '@ant-design/react-native';
import {Dimensions, StyleSheet} from 'react-native'
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import React, {useContext, useEffect, useState} from 'react';
import {PermissionsAndroid, Text, TouchableHighlight, View} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {
  default as LocalStorage,
  default as LocalStorageKey,
} from './constants/LocalStorageKey';
import {IGpsTracking} from './models/gps-tracking';
import MainMenuPage from './pages/MainMenuPage';
import NotificationPage from './pages/Notification/NotificationPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingPage from './pages/setting/SettingPage';
import WorkOrderPage from './pages/WorkOrder/WorkOrderPage';
import {NotifyContext} from './reducer/NotifyContext';
import {updateGpsTracking} from './services/GPSTracking';
import {getNotificationService} from './services/notify';
import {_getData, _storeData} from './utils/AsyncStorage';
// import StyleSheet from './components/StyleSheet';

const AppMain = () => {
  const [workNotify, setWorkNotify] = useContext(NotifyContext);
  const [screen, setScreen] = useState('main');
  const [keyboardStatus, setKeyboardStatus] = useState(undefined) as any;
  const [isGranted, setIsGranted] = useState(false);
  async function initOneSignal() {
    try {
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId('0d27683d-e7dc-4511-8c10-8942172ac8b7');
      OneSignal.setRequiresUserPrivacyConsent(false);
      setWorkNotify({
        knowledgeCount: 0,
        newsCount: 0,
        workOrderCount: 1,
      });
      /* O N E S I G N A L  H A N D L E R S */
      OneSignal.setNotificationWillShowInForegroundHandler(
        async notifReceivedEvent => {
          console.log(
            'OneSignal: notification will show in foreground:',
            notifReceivedEvent,
          );
          let notif = notifReceivedEvent.getNotification();
          _storeData({
            key: LocalStorageKey.workNotify,
            value: {type: 'work_notify', value: 1},
          });
          const notificationInfo = await getNotificationService();
          if (notificationInfo.isSuccess) {
            setWorkNotify(notificationInfo.dataResult);
          }
        },
      );
      OneSignal.setNotificationOpenedHandler(async notification => {
        console.log('OneSignal: notification opened:', notification);
        const notificationInfo = await getNotificationService();
        if (notificationInfo.isSuccess) {
          setWorkNotify(notificationInfo.dataResult);
        }
      });
      OneSignal.setInAppMessageClickHandler(async event => {
        console.log('OneSignal IAM clicked:', event);
        const notificationInfo = await getNotificationService();
        if (notificationInfo.isSuccess) {
          setWorkNotify(notificationInfo.dataResult);
        }
      });
      OneSignal.addSubscriptionObserver(async event => {
        console.log('OneSignal: subscription changed:', event);
        _storeData({
          key: LocalStorageKey.workNotify,
          value: {type: 'work_notify', value: 1},
        });
        const notificationInfo = await getNotificationService();
        if (notificationInfo.isSuccess) {
          setWorkNotify(notificationInfo.dataResult);
        }
      });
      OneSignal.addPermissionObserver(async event => {
        console.log('OneSignal: permission changed:', event);
        const notificationInfo = await getNotificationService();
        if (notificationInfo.isSuccess) {
          setWorkNotify(notificationInfo.dataResult);
        }
      });

      const deviceState = await OneSignal.getDeviceState();

      _storeData({
        key: LocalStorageKey.oneSignalUserId,
        value: deviceState.userId,
      }).catch(_ => {});
    } catch (err) {
      console.log('🚀 ~ file: App.tsx ~ line 22 ~ initOneSignal ~ err', err);
    }
  }

  const onUpdateGpsTracking = async (coors: GeolocationResponse) => {
    const userProfile = await _getData({key: LocalStorage.userInfo as string});
    const parseProfile = JSON.parse(String(userProfile));
    const payload = {
      wK_CTR: parseProfile.wk_ctr,
      lat: coors.coords.latitude,
      long: coors.coords.longitude,
      accuracy: coors.coords.accuracy,
      heading: coors.coords.heading,
      speed: Number(coors.coords.speed) * 2.23694,
    } as IGpsTracking;
    try {
      if(payload.lat && payload.long){
      await _storeData({key: 'gpsTracking', value: payload});
      await updateGpsTracking(payload);
      }
    } catch (error) {}
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'BevPro Mobile',
          message: 'App access to your location',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        setIsGranted(true);
      } else {
        console.log('location permission denied');
        setIsGranted(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    initOneSignal();
  }, []);

  useEffect(() => {
    let watchId: any;
    (async () => {
      // console.log("====== Update Gps ==========");
      await requestLocationPermission();
      if (isGranted) {
        watchId = Geolocation.watchPosition(
          pos => {
            onUpdateGpsTracking(pos);
          },
          err => {
            console.log('error ====>', err);
          },
        );
      }
      const notificationInfo = await getNotificationService();
      if (notificationInfo.isSuccess) {
        setWorkNotify(notificationInfo.dataResult);
      }
    })();
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [isGranted]);

  useEffect(() => {

      console.log("====== Update Gps ==========");
      // await requestLocationPermission();
        Geolocation.watchPosition(
          pos => {
            onUpdateGpsTracking(pos);
          },
          err => {
            console.log('error ====>', err);
          },
        );
      
      // const notificationInfo = await getNotificationService();
      // if (notificationInfo.isSuccess) {
      //   setWorkNotify(notificationInfo.dataResult);
      // }

  },[]);
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSM);
    } else {
      setStyles(stylesLG);
    }

  },[]);

  

  const TabScreen = (icon_name?: any, title?: any, screen_name?: any) => {
    const keyRandom = new Date().valueOf();
    return [
      <TouchableHighlight
        key={`${icon_name}${keyRandom}`}
        onPress={() => {
          setScreen(screen_name);
        }}
        underlayColor="none">
        <View style={{alignItems: 'center'}}>
          <Icon
            name={icon_name}
            size={35}
            color={screen == screen_name ? '#FFFFFF' : '#D0D0D0'}
          />
          <Text
            style={[styles.appBarText,{
              color: screen == screen_name ? '#FFFFFF' : '#D0D0D0',
              fontFamily: 'Prompt-SemiBold',
            }]}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>,
    ];
  };
  const renderAppMain = () => {
    const keyRandom = new Date().valueOf();
    return [
      screen == 'main' ? (
        <MainMenuPage key={`main-menu-page-${keyRandom}`}></MainMenuPage>
      ) : screen == 'work_order' ? (
        <WorkOrderPage
          appBar={false}
          key={`work-order-page-${keyRandom}`}></WorkOrderPage>
      ) : screen == 'profile' ? (
        <ProfilePage
          appBar={false}
          key={`profile-page-${keyRandom}`}></ProfilePage>
      ) : screen == 'notification' ? (
        <NotificationPage
          appBar={false}
          key={`notification-page-${keyRandom}`}></NotificationPage>
      ) : screen == 'setting' ? (
        <SettingPage key={`setting-page-${keyRandom}`}></SettingPage>
      ) : (
        <MainMenuPage key={`main-menu-page-${keyRandom}`}></MainMenuPage>
      ),
      keyboardStatus !== 'KeyboardShown' && (
        <View
          key={`nav-bar-${keyRandom}`}
          style={{
            flexDirection: 'row',
            bottom: 10,
            position: 'absolute',
            left: 10,
            right: 10,
            backgroundColor: '#00acc8',
            height: 80,
            borderRadius: 50,
          }}>
          <View
            style={{
              flex: 3,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {TabScreen('home', 'Home', 'main')}
            </View>
          </View>
          <View
            style={{
              flex: 1.2,
              alignItems: 'center',
              flexDirection: 'row',
              paddingRight:2,
            }}>
            <View
              style={[stylesSM.cricleWorkOrder]}>
              <TouchableHighlight
                key="work_order"
                onPress={() => setScreen('work_order')}
                underlayColor="none">
                <View style={{alignItems: 'center'}}>
                  <Icon
                    style={{
                      paddingTop: 10,
                    }}
                    name="shop"
                    size={30}
                    color="#FFFFFF"
                  />
                  {screen != 'work_order' && (
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 10,
                        paddingTop: 4,
                        fontFamily: 'Prompt-SemiBold',
                      }}>
                      Work Order
                    </Text>
                  )}
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View
            style={{
              flex: 4,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {TabScreen('bell', 'Notification', 'notification')}
            </View>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {TabScreen('setting', 'Setting', 'setting')}
            </View>
          </View>
        </View>
      ),
    ];
  };

  const stylesSM = StyleSheet.create({
    appBarText:{
      fontSize: 13,
      fontFamily: 'Prompt-SemiBold',
    },
    cricleWorkOrder:{
      flex: 2,
      backgroundColor: '#e73954',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: 50,
      position: 'absolute',
      bottom: 10,
      left:-42,
      padding : screen == 'work_order' ? 8:10,
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 6,
    },
  });

  const stylesLG = StyleSheet.create({
    cricleWorkOrder:{
      flex: 2,
      backgroundColor: '#e73954',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: 50,
      // width: screen == 'work_order' ? 80 : 100,
      // height: screen == 'work_order' ? 80 : 100,
      // padding: screen == 'work_order' ? 15 : 20,
      position: 'absolute',
      bottom: 25,
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 6,
    },
  });

  return (
    <>
      {renderAppMain()}
    </>
  );
};

export default AppMain;
