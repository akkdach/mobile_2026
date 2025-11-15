import {Button, Icon, Modal} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    Dimensions,
    Linking,
  Text,
    TextInput,
  View,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import * as router from 'react-native-router-flux';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {ROUTE} from '../../../constants/RoutePath';
import {styleLg,styleSm} from './InspectorWorkItenPageCss';
import moment from 'moment-timezone';
import { fetchtWorkOrderCustomer } from '../../../services/workOrderCustomer';
import { IWorkOrderCustomer } from '../../../models/WorkOrderCustomer';
import { Controller, useForm } from 'react-hook-form';
import styleSheet from '../../../components/StyleSheet';
import { checkInShop, getCheckInShop } from '../../../services/work_order_list_service';
import { LoginResponseInterface } from '../../../models/login';
import { _getData } from '../../../utils/AsyncStorage';
import LocalStorageKey from '../../../constants/LocalStorageKey';

type InspectorShopCheckInProps = {
    checkInModal: boolean
    workOrderDetail: any
    onClickModalCheckIn: Function
}

type Inputs = {
    mileInStore: string;
};

const InspectorShopCheckIn: React.FC<InspectorShopCheckInProps> = ({checkInModal, workOrderDetail, onClickModalCheckIn}) => {
    const [customerData, setCustomerMaster] = useState<IWorkOrderCustomer | null>(null);
    const [mileInStoreTextError, setMileInStoreTextError] = useState('');
    const { control, getValues, reset, setValue, watch } = useForm<Inputs>();
    // const [multipleOrderManage, setMultipleOrderManage] = useState<any>([]);

    const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
    const [styles, setStyles] = useState<any>({});
    useEffect(() => {
      console.log(screenInfo)
      if (screenInfo.width < 500) {
        setStyles(styleSm);
      } else {
        setStyles(styleLg);
      }
  
    }, [screenInfo]);
    
    useEffect(() => {
        getWorkOrderCustomer();
        getCheckIn();
    }, [checkInModal]);

    const getUserInfo = async () => {
        const result: any = await _getData({ key: LocalStorageKey.userInfo });
        const userInformation = JSON.parse(result);
        const user = new LoginResponseInterface(userInformation);

        return user
    }
  
    const getWorkOrderCustomer = async () => {
      try {
        const result: any = await fetchtWorkOrderCustomer(workOrderDetail.orderId);
        setCustomerMaster(result);
      } catch (error) {
        setCustomerMaster(null);
      }
    };

    const getCheckIn = async () => {
        const userInfo = await getUserInfo()
        let data = {
          OrderId: `${workOrderDetail.orderId}`,
          WorkCenter: `${userInfo?.wk_ctr}`,
        };
        if (checkInModal) {
          let response = await getCheckInShop(data);
          if (response.isSuccess) {
            let startMile = `${response?.dataResult?.workIn.startMile}`;
            let number = [];
            if (startMile != '' && startMile.length < 6) {
              let lengthNumber = 6 - startMile.length;
              for (let index = 0; index < lengthNumber; index++) {
                number.push(0);
              }
            }
            startMile = `${number.join('')}${startMile}`;
            if (startMile) {
              setValue('mileInStore', startMile);
            }
          }
        }
    };

    const _onClickCheckIn = () => {
        let mileInStore = getValues('mileInStore');
        
        if (mileInStore.length != 6) {
          setMileInStoreTextError('กรุณากรอกเลขไมล์ 6 หลักให้ครบถ้วน');
          setValue('mileInStore', '');
          return;
        }
        setMileInStoreTextError('');
        Alert.alert('แจ้งเตือน', 'ต้องการยืนยันการเข้าทำงานร้าน ?', [
          {
            text: 'ยกเลิก',
            style: 'cancel',
          },
          {
            text: 'ตกลง',
            onPress: async () => {
              try {
                const userInfo = await getUserInfo()
                let data = {
                    mileAge: Number(getValues('mileInStore')),
                    orderId: `${workOrderDetail.orderId}`,
                    workCenter: `${userInfo?.wk_ctr}`,
                };
                let response = await checkInShop(data);
                if (response.isSuccess) {
                    onClickModalCheckIn();
                    setValue('mileInStore', '');
                }
                // setLoading(true);
                // multipleOrderManage.map(async (val: any, index: any) => {
                //   let data = {
                //     mileAge: Number(getValues('mileInStore')),
                //     orderId: `${val.orderId}`,
                //     workCenter: `${userInfo?.wk_ctr}`,
                //   };
                //   let response = await checkInShop(data);
                //   if (multipleOrderManage.length === index + 1) {
                //     if (response.isSuccess) {
                //     //   setLoading(false);
                //     //   setVisibleModalOrderSelect(!visibleModalOrderSelect);
                //     onClickModalCheckIn();
                //       setMultipleOrderManage([]);
                //       setValue('mileInStore', '');
                //     }
                //   }
                // });
              } catch (error) {
                // setLoading(false);
                // setStateCheckInModal(!checkInModal);
                // setVisibleModalOrderSelect(!visibleModalOrderSelect);
                // setMultipleOrderManage([]);
                AlertDataNotSuccess();
              }
            },
          },
        ]);
    };

    const AlertDataNotSuccess = () => {
        Alert.alert('แจ้งเตือน', 'ทำรายการไม่สำเร็จ ?', [
          {
            text: 'ตกลง',
            onPress: async () => {
                onClickModalCheckIn();
            },
          },
        ]);
    };

    const DrawHorizontalWidget = () => {
        return (
          <View
            style={{
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <View
              style={{
                borderBottomColor: '#00000029',
                borderBottomWidth: 1,
              }}
            />
          </View>
        );
    };

    const BottomWidget = (
        title?: string,
        action?: any,
        colorBackground?: any,
      ) => {
        const styleBtn = [];
        if (colorBackground) {
          styleBtn.push(styles.btn);
          styleBtn.push({backgroundColor: colorBackground});
        } else {
          styleBtn.push(styles.btnCloseJob);
        }
        return (
          <View style={{alignItems: 'center'}}>
            <Button style={styleBtn} onPress={action}>
              <Text
                style={{
                  color: 'white',
                  fontSize: screenInfo.width > 500 ? 22 : 16,
                  fontFamily: Fonts.Prompt_Medium,
                }}>
                {title}
              </Text>
            </Button>
          </View>
        );
    };

    const ModalCheckIn = () => {
        return (
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 650 : screenInfo.width-10 }}
            visible={checkInModal}>
            <View>
              <View>
                <Text style={styles.titleCheck}>เลขไมล์ถึงร้าน</Text>
                {DrawHorizontalWidget()}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: screenInfo.width > 500 ? 'space-between' : 'center',
                  padding: 20,
                  paddingTop: 30,
                }}>
                {screenInfo.width > 500 && (<View
                  style={{
                    flex: 1,
                    borderRadius: 100,
                    width: 80,
                    height: 110,
                    backgroundColor: COLOR.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="shop" size={50} color={COLOR.white} />
                </View>)}
                <View
                  style={{
                    flex: 4,
                    paddingLeft: 20,
                    alignItems:screenInfo.width > 500 ? 'left'  : 'center'
                  }}>
                  <Text style={styles.titleDetails}>
                    {customerData?.customerName}
                  </Text>
                  <Text style={styles.titleDetails}>
                    รหัสลูกค้า: {customerData?.customer}
                  </Text>
                  <Text style={styles.textDetails}>{customerData?.address}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Text style={styles.titleDetails}>
                        โทรศัพท์: {customerData?.phone}
                      </Text>
                    </View>
                    <View>
                      <Icon
                        color={COLOR.primary}
                        style={{ position: 'absolute', paddingLeft: 20 }}
                        onPress={() => {
                          Linking.openURL(`tel:${customerData?.phone}`);
                        }}
                        name="phone"
                        size={24}
                      />
                    </View>
                  </View>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: screenInfo.width> 500 ? 'space-between' : 'center',
                        }}>
                        <View
                          style={{
                            flex: 4,
                            marginTop: 10,
                          }}>
                          <TextInput
                            value={value}
                            placeholder={'ระบุเลขไมล์'}
                            keyboardType="number-pad"
                            style={[styleSheet.input, { height: 52 }]}
                            maxLength={6}
                            onChangeText={(value: string) => onChange(value)}
                          />
                          <Text
                            style={{
                              fontFamily: Fonts.Prompt_Light,
                              fontSize: 14,
                              color: COLOR.neonRed,
                              textAlign: 'center',
                            }}>
                            {mileInStoreTextError}
                          </Text>
                        </View>
                      </View>
                    )}
                    name="mileInStore"
                    defaultValue=""
                  />
                </View>
              </View>
            </View>
            {DrawHorizontalWidget()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <View style={{ flex: 2 }}>
                {BottomWidget(
                  'ยกเลิก',
                  () => (onClickModalCheckIn(), setValue('mileInStore', '')),
                  '#818181',
                )}
              </View>
              <View style={{ flex: 2 }}>
                {BottomWidget(
                    'ยืนยันการเข้างาน', 
                    () => _onClickCheckIn(),
                    COLOR.secondary_primary_color
                )}
              </View>
            </View>
          </Modal>
        );
    };
  
    return (
      <>
        {ModalCheckIn()}
      </>
    );
  };

export default InspectorShopCheckIn;