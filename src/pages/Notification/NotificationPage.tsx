import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Avatar, Colors, IconButton, List} from 'react-native-paper';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import {Fonts} from '../../constants/fonts';
import {INotification} from '../../models';
import {useFetchNotification} from '../../reducer/Notifiaction';
import styleSheet from '../../components/StyleSheet';
import {Card} from '@ant-design/react-native';
import { getNotifyService } from '../../services/notify';
import DataNotFound from '../../components/DataNotFound';
import { useNavigation, StackActions } from '@react-navigation/native';

// const NotificationPage: React.FC = (props: any) => {
const NotificationPage = (props: any) => {
  const params = props.route?.params;
  const {data: notifications} = useFetchNotification();
  const [dataList, setDataList] = useState<any>();
  const navigation = useNavigation();

  

  console.log('[props]', params.notification)
  useEffect(() => {
      getNotifyList()
  }, [])

  const getNotifyList = async () => {
    try {
      const response = (await getNotifyService()).dataResult
      const result = response.map((list: any) => {
        return list.items.map((item: any) => {
          return {
            title: list.title,
            type: item.type,
            value: item.value
          }
        })
      }).flat()
      setDataList(result)
    } catch (error) {}
  }

  

  useEffect(loading, []);



  const onClickDetail = (notification: any) => {
    // router.Actions.push('notificationDetail', { notification });
    navigation.dispatch(StackActions.push('notificationDetail', { notification }));
  }

  

  const notificationCard = (notification: any, idx: number) => (
    <List.Item
      title={
        <Text style={[styles.notificationCard]}>
          {notification.title}
        </Text>
      }
      description={
        <Text style={[]}>
          {notification.value}
        </Text>
      }
      left={props => (
        <Avatar.Icon
          {...props}
          icon="bullhorn"
          color="#FFA500"
          style={{backgroundColor: '#F5F5F5'}}
        />
      )}
      onPress={() => onClickDetail(notification)}
      // right={props => (
      //   <IconButton
      //     icon="delete"
      //     color={Colors.red500}
      //     onPress={() => console.log('Pressed')}
      //   />
      // )}
      key={`notification-${idx}`}
    />
  );


  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(stylesSM);
    } else {
      setStyles(stylesLG);
    }

  },[]);
  console.log('dataList', JSON.stringify(dataList, null, 2))

  
  const stylesSM = StyleSheet.create({
    ScrollView:{padding: 8},
    notificationCard:{fontFamily: Fonts.Prompt_Light, fontSize: 12}
  })

  
  const stylesLG = StyleSheet.create({
    ScrollView:{padding: 40},
    notificationCard:{fontFamily: Fonts.Prompt_Light, fontSize: 18}
  })

  return (
    <>
      <AppBar title="Notification"></AppBar>
      <BackGroundImage
        components={
          <Animated.ScrollView>
            <ScrollView>
              <View style={styles.ScrollView}>
                <Card style={styleSheet.card_custom}>
                  {
                    dataList?.length > 0 ? dataList.map((notification: any, idx: number) => (
                      notificationCard(notification, idx)
                    )) : <DataNotFound></DataNotFound>
                  }
                
                  {/* {notifications.map(
                    (notification: INotification, idx: number) =>
                      notificationCard(notification, idx),
                  )} */}
                </Card>
              </View>
            </ScrollView>
          </Animated.ScrollView>
        }></BackGroundImage>
    </>
    
  );

};

const loading = () => {};

export default NotificationPage;
