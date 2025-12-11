import { Icon, List, Switch } from '@ant-design/react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Card } from 'react-native-paper';
import BackGroundImage from '../../components/BackGroundImage';
import LocalStorageKey from '../../constants/LocalStorageKey';
import { ROUTE } from '../../constants/RoutePath';
import { signOut, updateTokenNotify } from '../../services/auth';
import { _getData, _storeData } from '../../utils/AsyncStorage';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingPage = () => {
  const [notifyAction, setNotifyAction] = useState<boolean>(false);
  const isComponentMounted = useRef(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (isComponentMounted.current) {
      _getData({ key: LocalStorageKey.notifyStatus }).then(status => {
        if (status || status === 'true') {
          setNotifyAction(true);
        } else {
          setNotifyAction(false);
        }
      });
    }
    return () => {
      isComponentMounted.current = false;
    };
  }, [isComponentMounted]);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(stylesSM);
    } else {
      setStyles(stylesLG);
    }

  }, []);

  const _Logout = async () => {
    signOut();
    navigation.dispatch(StackActions.replace(ROUTE.LOGIN));
  };

  const navigate = (route: any) => {
    navigation.dispatch(StackActions.push(route));
  };

  const _syncWorkOrder = async () => {
    navigation.dispatch(StackActions.push(ROUTE.SYNC_WORKORDER));
  };


  const stylesSM = StyleSheet.create({
    card: {
      borderRadius: 15, minHeight: 980, fontSize: 10,
      color: '#202240',
      fontFamily: 'Prompt-SemiBold',
    }
  })

  const stylesLG = StyleSheet.create({
    view:{
       padding: 60 
    },
    card: {
      borderRadius: 15, minHeight: 980,
      color: '#202240',
      fontFamily: 'Prompt-SemiBold',
    }
  })

  const ListItem = (
    icon_name: any,
    label: any,
    action?: any,
    iconRight?: boolean,
  ) => (
    <TouchableHighlight onPress={action} underlayColor="none">
      <View style={{ paddingTop: 6 }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            backgroundColor: '#F9F9F9',
            borderRadius: 10,
          }}>
          <View style={{ flex: 0.4 }}>
            <Icon name={icon_name} size={32} color="#202240" />
          </View>
          <View style={{ flex: 2 }}>
            <Text>
              {label}
            </Text>
          </View>
          {iconRight && (
            <View>
              <Switch
                checked={notifyAction}
                onChange={val => {
                  if (val) {
                    _getData({ key: LocalStorageKey.oneSignalUserId }).then(
                      token => {
                        console.log('token ===>', token)
                        updateTokenNotify({ Token: JSON.parse(token) }).then(response => {
                          if (response.data.isSuccess) {
                            setNotifyAction(!notifyAction);
                            _storeData({
                              key: LocalStorageKey.notifyStatus,
                              value: val,
                            }).catch(_ => { });
                          }
                        });
                      },
                    );
                  } else {
                    updateTokenNotify({ Token: '' }).then(response => {
                      if (response.data.isSuccess) {
                        setNotifyAction(!notifyAction);
                        _storeData({
                          key: LocalStorageKey.notifyStatus,
                          value: val,
                        }).catch(_ => { });
                      }
                    });
                  }
                }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );


  const startListBuild = () => (
    <View style={[styles.view]}>
      <Card style={styles.card}>
        <Card.Content>
          {ListItem('user', 'Profile', () => navigate(ROUTE.PROFILE))}
        </Card.Content>
        <Card.Content>
          {ListItem('notification', 'เปิด/ปิด การแจ้งเตือน', _Logout, true)}
          {/* <List.Item
            extra={
              <Switch
                checked={false}
                onChange={() => {
                  // this.setState({
                  //   checked: !this.state.checked,
                  // });
                }}
              />
            }>
            Off
          </List.Item> */}
        </Card.Content>
        <Card.Content>{ListItem('logout', 'Logout', _Logout)}</Card.Content>
      </Card>
    </View>

  );

  return (
    <SafeAreaView>
      <BackGroundImage components={startListBuild()}></BackGroundImage>
    </SafeAreaView>
  );
};

export default SettingPage;
