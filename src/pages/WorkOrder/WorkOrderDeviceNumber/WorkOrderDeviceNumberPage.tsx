import {Button, Icon, Modal} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-qrcode-scanner';
import {Card} from 'react-native-paper';
import {StackActions, useNavigation} from '@react-navigation/native';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import Scanner from '../../../components/Scanner';
import styles from '../../../components/StyleSheet';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {ROUTE} from '../../../constants/RoutePath';
import {
  fetchtWorkOrderDeviceNumber,
  fetchUpdateWorkOrderDeviceNumber,
  fetchWorkOrderDeviceNumberDetail,
} from '../../../services/workOrderDeviceNumber';
import sparePartCheckCss from './WorkOrderDeviceNumberCss';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

const WorkOrderDeviceNumberPage: React.FC = (props: any) => {
  const navigation = useNavigation();
  // console.log('props ====>', props.workOrderData.orderId);
  const [qrData, setQrData] = useState<string | undefined>('');
  const [scan, setScan] = useState(false);
  const [visibleNotMatchModal, setVisibleNotMatchModal] = useState(false);
  const [deviceData, setDeviceData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onLoadWorkOrderDeviceNumberDetail(props.workOrderData.orderId) 
  }, [])

  const onLoadWorkOrderDeviceNumberDetail = async (orderId: string) => {
    setIsLoading(true)
    try {
      const response = await fetchWorkOrderDeviceNumberDetail(orderId)
      if(response.isSuccess) {
        setQrData(response.dataResult.cde_code)
        setDeviceData({
          equipment: response.dataResult.equipment,
          model: response.dataResult.model
        })
      }
    } catch (error) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false)
    }
  }

  const onSearchDeviceNumber = async (cdeCode: string | undefined) => {
    setIsLoading(true);
    try {
      const result = await fetchtWorkOrderDeviceNumber(cdeCode as string);
      console.log('result', result);
      if (result.isSuccess) {
        setDeviceData(
          result.dataResult !== undefined ? result.dataResult[0] : null,
        );
      } else {
        setVisibleNotMatchModal(!visibleNotMatchModal);
      }
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickClose = () => {
    setVisibleNotMatchModal(!visibleNotMatchModal);
  };

  const onSubmit = () => {
    Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          setIsLoading(true);
          try {
            await fetchUpdateWorkOrderDeviceNumber(
              qrData as string,
              props.workOrderData.orderId || '',
            );
            Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
              {
                text: 'ปิด',
                onPress: async () => {
                  navigation.dispatch(StackActions.pop());
                },
              },
            ]);
          } catch (error) {
            console.log('error ====>', error);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const NotMatchModal = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={{width: 350, height: 350, borderRadius: 15}}
        visible={visibleNotMatchModal}>
        <View>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                onClickClose();
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>

          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{margin: 40}}>
              <Icon name="exclamation-circle" size={75} color="orange" />
            </View>
            <Text style={{fontSize: 24, fontFamily: Fonts.Prompt_Medium}}>
              ไม่พบ CDE Code
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  const equipmentDetail = () => {
    return (
      <Card style={{height: 'auto'}}>
        <Card.Content>
          <View style={{flexDirection: 'column', marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 18,
                    color: COLOR.gray,
                    marginTop: 10,
                  }}>
                  Equipment Number :
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  // left: 10,
                  // backgroundColor: COLOR.secondary_primary_color,
                  // height: 52,
                  // borderRadius: 25,
                  // opacity: 0.8,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 18,
                    color: COLOR.primary,
                    padding: 12,
                    left: 20,
                  }}>
                  {deviceData?.equipment ? deviceData?.equipment : '-'}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 18,
                    color: COLOR.gray,
                    marginTop: 10,
                  }}>
                  Model :
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  // left: 10,
                  // backgroundColor: COLOR.secondary_primary_color,
                  // height: 52,
                  // borderRadius: 25,
                  // opacity: 0.8,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 18,
                    color: COLOR.primary,
                    padding: 12,
                    left: 20,
                  }}>
                  {deviceData?.model ? deviceData?.model : '-'}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 18,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Button
                style={{...styles.btnLg, width: 100}}
                onPress={() => {
                  onSubmit();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  บันทึก
                </Text>
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const cdeCode = () => {
    return (
      <Card>
        <Card.Content>
          <View style={[sparePartCheckCss.container, {flexDirection: 'row'}]}>
            <View
              style={{
                flex: 4,
                paddingTop: 5,
                alignItems:'center'
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.Prompt_Medium,
                  color: COLOR.gray,
                }}>
                CDE Code:
              </Text>
            </View>
          </View>
          <View style={[sparePartCheckCss.container, {flexDirection: 'row'}]}>
            <View style={{flex: 4}}>
              <TextInput
                value={qrData}
                onChangeText={(txt: string) => setQrData(txt)}
                style={[styles.input, {height: 52, marginTop: 6}]}
              />
            </View>
          </View>
          <View style={[sparePartCheckCss.container, {flexDirection: 'row'}]}>
            <View style={{flex: 4, marginTop: 2,alignItems:'center'}}>
              <Icon
                name="qrcode"
                color="black"
                size={60}
                onPress={() => {
                  setScan(true);
                }}
              />
            </View>
          </View>
          <View
            style={[
              {flexDirection: 'row', justifyContent: 'center', marginTop: 10},
            ]}>
            <View>
            <Button
                style={{...styles.btnLg, width: 100}}
                onPress={() => {
                  onSubmit();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  บันทึก
                </Text>
              </Button>
              {/* <Button
                style={styles.btnLg}
                onPress={() => {
                  onSearchDeviceNumber(qrData);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  ค้นหา
                </Text>
              </Button> */}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const onValueScanner = (e: BarCodeReadEvent) => {
    setQrData(e.data);
    setScan(false);
  };

  return (
    <>
      <Animated.View>
        <View style={{width: '100%'}}>
         {ScreenWidth > 500 && <AppBar title="ใส่หมายเลขอุปกรณ์ที่ติดตั้ง" rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar> }
         {ScreenWidth <= 500 && <AppBar title={`ใส่หมายเลขอุปกรณ์ที่ติดตั้ง ${props.workOrderData.orderId}`}></AppBar> }
        </View>
        <ScrollView>
          {scan && (
            <Scanner
              title="CDE Code / Equipment No"
              onValue={onValueScanner}
              onClose={() => setScan(false)}
            />
          )}
          <View style={{paddingLeft: 5, paddingRight: 5, paddingTop: 5}}>
            {cdeCode()}
          </View>
{/* 
          <View style={{paddingLeft: 5, paddingRight: 5, paddingTop: 5}}>
            {equipmentDetail()}
          </View> */}
          {NotMatchModal()}
        </ScrollView>
      </Animated.View>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderDeviceNumberPage;
