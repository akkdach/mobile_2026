import { Icon, Modal } from '@ant-design/react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Animated, Dimensions, FlatList, Image, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Card, DataTable } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DataNotFound from '../../../components/DataNotFound';
import DropdownSelect from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import TextInputComponent from '../../../components/TextInput';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { fetchPostActionApprove, fetchtGetUnderVanSub, fetchtGetWorkOrderVanSub } from '../../../services/workOrderListChangeApprove';
import { FullArrayTextSearch } from '../../../utils/FullTextSearch';
import styles from './ApproveOTPageCss';
import { LoginResponseInterface } from '../../../models/login';
import LocalStorageKey from '../../../constants/LocalStorageKey';
import { _getData } from '../../../utils/AsyncStorage';
import moment from 'moment';
import { convertDateToThaiMonthDayThai } from '../../../utils/Date';
import CountDown from 'react-native-countdown-component';
import { ROUTE } from '../../../constants/RoutePath';
import { fetchWorkListAppoveOTGet, fetchWorkListAppoveOTPost, fetchtWorkListApproveOTUnderSupForMobile } from '../../../services/workOrderListApproveOT';

type InterfaceProps = {};
type Inputs = {
  searchText: string;
};
const coca_logo = require('../../../../assets/images/coca_logo.png');
const dataSet = require('./workOrderListApproveOT.json');

const ApproveOTPage = (props) => {
  const params = props.route?.params;
  const { control, getValues, reset, setValue, watch } = useForm<Inputs>();
  const [isLoading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<LoginResponseInterface>();
  const [fetchError, setFetchError] = useState(null);
  const [orderList, setOrderList] = useState<any>();
  const [orderListMaster, setOrderListMaster] = useState<any>();
  const [orderTypeList, setOrderTypeList] = useState<any>();
  const [vanSelect, setVanSelect] = useState<any>(null);
  const [underVanSubItems, setUnderVanSub] = useState<any>([]);
  const [isModalVisible, setModalVisible] = useState(false)
  const [workOrderSelect, setWorkOrderSelect] = useState<any>(null)
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const result: any = await _getData({ key: LocalStorageKey.userInfo });
        const userInformation = JSON.parse(result);
        const user = new LoginResponseInterface(userInformation);
        setUserInfo(user);

        await workListApproveOTUnderSupForMobile(user?.wk_ctr);
        await ApproveOTList(user?.wk_ctr);
      } catch (err: any) {
        setFetchError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);
  

  const ApproveOTList = async (wk_ctr: any) => {
    const data: any = (await fetchWorkListAppoveOTGet(wk_ctr)).dataResult
    setOrderList(data.workorders);
    setOrderListMaster(data.workorders);
    setOrderTypeList(data.approveOTList);
  };

  const workListApproveOTUnderSupForMobile = async (wk_ctr: any) => {
    const data: any = (await fetchtWorkListApproveOTUnderSupForMobile(wk_ctr)).dataResult
    setUnderVanSub(data.map((item: any) => {
      return { label: item.wk_ctr, value: item.wk_ctr }
    }))
  };

  watch(observe => {
    console.log('[observe.searchText]', observe.searchText)
    if (observe.searchText && observe.searchText.length >= 3) {
      console.log('[orderListMaster]', JSON.stringify(orderListMaster, null, 2))
      if (orderListMaster) {
        console.log(' FullArrayTextSearch', JSON.stringify(FullArrayTextSearch(orderListMaster as any[], observe.searchText) as any, null, 2))
        setOrderList(
          FullArrayTextSearch(orderListMaster as any[], observe.searchText) as any,
        );
      }
    } else if (
      observe.searchText === null ||
      observe.searchText === undefined ||
      observe.searchText.length === 0
    ) {
      setOrderList(orderListMaster);
    }
  });

  const BuildOrderType = () => {
    return (
      <View style={{
        flex: 2
      }}>
          <View style={{ display: 'flex' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.orderTextStyle, {borderBottomWidth: 0}]}>
                <Text>&nbsp;</Text>
              </View>
              <View style={[styles.orderTextStyle, {borderBottomWidth: 0}]}>
                <Text>Quota</Text>
              </View>
              <View style={[styles.orderTextStyle, {borderBottomWidth: 0}]}>
                <Text>Actual</Text>
              </View>
              <View style={[styles.orderTextStyle, { borderRightWidth: 1, borderBottomWidth: 0 }]}>
                <Text>Balance</Text>
              </View>
            </View>
            <View>
              {
                orderTypeList?.length > 0 ? orderTypeList?.map((item: any, index: number) => {
                  return (
                    <View key={"order-type-"+index} style={{ flexDirection: 'row' }}>
                      <View style={[styles.orderTextStyle, { borderTopWidth: 1, borderBottomWidth: orderTypeList.length - 1 === index ? 1 : 0 }]}>
                        <Text>{item.title}</Text>
                      </View>
                      <View style={[styles.orderTextStyle, { borderTopWidth: 1, borderBottomWidth: orderTypeList.length - 1 === index ? 1 : 0 }]}>
                        <Text>{item.quota}</Text>
                      </View>
                      <View style={[styles.orderTextStyle, { borderTopWidth: 1, borderBottomWidth: orderTypeList.length - 1 === index ? 1 : 0 }]}>
                        <Text>{item.actual}</Text>
                      </View>
                      <View style={[styles.orderTextStyle, { borderRightWidth: 1, borderBottomWidth: orderTypeList.length - 1 === index ? 1 : 0 }]}>
                        <Text>{item.balance}</Text>
                      </View>
                    </View>
                  ); 
                }) : <View style={{ 
                  borderWidth: 1, 
                  padding: 15, 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}><Text>ไม่พบรายการ</Text></View>
              }
            </View>
          </View>
      </View>
    )
  }

  const BuildProfile = () => {
    return (
      <View
        style={{
          flex: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'flex-end',
            right: 20,
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.gray,
              }}>
              ชื่อ:&nbsp;
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.secondary_primary_color,
              }}>
              {userInfo?.fullName}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'flex-end',
            right: 20,
          }}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.gray,
              }}>
              WorkCenter:&nbsp;
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.secondary_primary_color,
              }}>
              {userInfo?.wk_ctr}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const tranferApproveOT = (item: any) => {
    setWorkOrderSelect(item)
    setModalVisible(true)
  }
  
  const onChangeVan = async (val?: any) => {
    setModalVisible(false)
    setLoading(true)
    await fetchWorkListAppoveOTPost({
      orderId: workOrderSelect.workOrder,
      approveAction: 'change_van',
      referToWorkCenter: val
    })
    setLoading(false)
    await ApproveOTList(userInfo?.wk_ctr)
  }

  const confirmApproveOT = async (item: any) => { 
    setLoading(true)
    await fetchWorkListAppoveOTPost({
      orderId: item.orderId,
      approveAction: 'approved',
      referToWorkCenter: ''
    })
    setLoading(false)
    await ApproveOTList(userInfo?.wk_ctr)
  }

  const onSelectWorker = () => {
    return (
        <DropdownSelect
          selects={vanSelect}
          dataItem={underVanSubItems}
          placeholder={'เลือกช่าง'}
          textStyle={{
            color: COLOR.primary,
            fontSize: 34,
            fontFamily: Fonts.Prompt_Medium
          }}
          containerStyle={{
            width: '100%',
            height: '100%',
            marginLeft: '75%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          contentContainerStyle={{ borderRadius: 10 }}
          onValueChange={val => onChangeVan(val)}
          isShowLabel={true}
        />
    )
  }

  const ModalApproveChange = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={{ width: 650 }}
        visible={isModalVisible}>
        <View>
          <View style={{ alignItems: 'flex-end', paddingBottom: 5 }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => setModalVisible(false)}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View style={{ display: 'flex', marginLeft: 30, paddingBottom: 20 }}>
            <Text style={styles.dataTableCell}><Text style={{ fontWeight: 'bold' }}>Work Order</Text>: {workOrderSelect?.orderId ? workOrderSelect?.orderId : '-'}</Text>
            <Text style={styles.dataTableCell}><Text style={{ fontWeight: 'bold' }}>Van Tech</Text>: {workOrderSelect?.vanTech ? workOrderSelect?.vanTech : '-'}</Text>
          </View>

          {DrawHorizontalWidget()}
         
          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingLeft: 15, paddingRight: 30, paddingTop: 50, paddingBottom: 50, flex: 1 }}>
              <TouchableHighlight>
                <View style={{
                  borderWidth: 2,
                  borderColor: COLOR.primary,
                  backgroundColor: '#fff',
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {onSelectWorker()}
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const convertDateTimeDeff = (endDate: any, orderId?: any) => {
    if (endDate) {
      let startTime = moment();
      const endTime = moment(endDate);
      const timeDiff = endTime.diff(startTime, 'seconds');
      return timeDiff;
    }
    return 0;
  };

  const buildCardApproveOT = useCallback(({ item }) => {
    return (
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        key={item.vanTech}>
        <View
          style={{
            flex: 0.5,
            borderBottomWidth: 2,
            borderBottomColor: '#D0D0D0',
          }}>
          <Text
            style={{
              paddingLeft: 14,
              fontFamily: Fonts.Prompt_Medium,
              fontSize: 16,
              paddingTop: 10,
            }}>
            {item.vanTech}
          </Text>
        </View>
        <View
          style={{
            flex: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#D0D0D0',
            borderLeftWidth: 2,
            borderLeftColor: '#D0D0D0',
          }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 4 }} key={item.orderId}>
              <TouchableHighlight
                onLongPress={() => { }}
                underlayColor="#fff"
                onPress={() =>
                  Alert.alert('แจ้งเตือน', 'ต้องการอนุมัติหรือไม่ ?', [
                    {
                      text: 'ยกเลิก',
                      style: 'cancel',
                      onPress: async () => {
                        tranferApproveOT(item)
                      }
                    },
                    {
                      text: 'ตกลง',
                      onPress: async () => {
                        confirmApproveOT(item)
                      },
                    },
                  ])
                }>
                <View style={[{ marginTop: 10, marginLeft: 4, marginRight: 20 }]}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.1 }}>
                      <View
                        style={{
                          height: 14,
                          width: 14,
                          borderRadius: 50,
                          borderColor: '#D0D0D0',
                          borderWidth: 2,
                        }}
                      />
                    </View>
                    <View style={{ flex: 4 }}>
                      <Card
                        style={{
                          backgroundColor: item.colorStatus ? item.colorStatus : '#333333',
                          borderColor: item.colorStatus ? item.colorStatus : '#333333',
                          // backgroundColor: item.colorStatus,
                          // borderColor: item.colorStatus,
                        }}>
                        <Card.Content>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'column',
                                flex: 2,
                              }}>
                              <View style={{ flex: 2 }}>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                    fontFamily: Fonts.Prompt_Medium,
                                  }}>
                                  {item.orderId} : {item.type} ({item.objType})
                                  {item.logo && (
                                    <View>
                                      <View
                                        style={{
                                          position: 'absolute',
                                          marginTop: -20,
                                          marginLeft: 6,
                                        }}>
                                        <Image
                                          style={{
                                            width: 24,
                                            height: 24,
                                            borderColor: 'white',
                                            borderWidth: 2,
                                            borderRadius: 50,
                                          }}
                                          source={coca_logo}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </Text>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  Equipment: {item.equipment}
                                </Text>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 14,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  {item.description}
                                </Text>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 14,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  วันที่เริ่มทำ:{' '}
                                  {item.dateFinish
                                    ? moment(item.dateFinish).format('DD/MM/YYYY')
                                    : ''}{' '}
                                  เวลา:{' '}
                                  {item.timeFinish ? `${item.timeFinish} น.` : ''}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'column',
                                flex: 2,
                              }}>
                              <View style={{ flex: 2, alignItems: 'flex-end' }}>
                              <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  Status: {item.approveOt} 
                                </Text>
                              </View>
                              <View style={{ flex: 2, alignItems: 'flex-end' }}>
                              <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  Req OT: {item.reqOT} นาที
                                </Text>
                              </View>
                              <View style={{ flex: 2, alignItems: 'flex-end' }}>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  รหัสลูกค้า: {item.customerId}
                                </Text>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 14,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  {item.account}
                                </Text>
                                <Text
                                  style={{
                                    color: '#FFFFFF',
                                    fontSize: 14,
                                    fontFamily: Fonts.Prompt_Light,
                                  }}>
                                  { }
                                </Text>
                                <View style={{ marginTop: -14 }}>
                                  <CountDown
                                    until={Number(
                                      convertDateTimeDeff(item.countDownTimeLimit),
                                    )}
                                    digitTxtStyle={{ color: COLOR.white }}
                                    size={12}
                                    timeLabels={{
                                      d: '',
                                      h: '',
                                      m: '',
                                      s: '',
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    );
  }, []);

  const DrawHorizontalWidget = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 14,
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

  const SearchItem = () => (
    <View
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
      }}
      key={`search-item-work-order`}>
      <View style={{flex: 3, marginTop: 36}}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={[styles.input, {height: 52}]}
              placeholderTextColor={'#FFFFFF'}
              placeholder="Search"
              value={value}
              onBlur={onBlur}
              onChangeText={textSearch => onChange(textSearch)}
            />
          )}
          name="searchText"
          defaultValue=""
        />
      </View>
    </View>
  );


  const LayoutApproveOT = () => {
    return <View>
      <View style={{ flexDirection: 'row' }}>
        {BuildOrderType()}
        {BuildProfile()}
      </View>
      {DrawHorizontalWidget()}
      {SearchItem()}
      <View
        style={{
          marginTop: 10,
          // maxHeight: params.appBar === undefined || params.appBar ? 890 : 820,
        }}>
        {orderList && orderList.length > 0 ? (
          <FlatList
            data={orderList}
            initialNumToRender={5}
            removeClippedSubviews
            renderItem={buildCardApproveOT}
          // keyExtractor={keyExtractor}
          />
        ) : !isLoading ? (
          <View style={{ marginTop: 120 }}>
            <DataNotFound />
          </View>
        ) : null}
      </View>
    </View >
  }

  return (
    <>
      <Animated.View>
        <View style={{ width: '100%' }}>
          <AppBar title="Approve OT"></AppBar>
        </View>
        <SafeAreaView>
          <View style={{ padding: 10, height: '100%' }}>
            {LayoutApproveOT()}
          </View>
        </SafeAreaView>
        {ModalApproveChange()}
      </Animated.View>

      <Loading loading={isLoading} />
    </>
  );
};

export default ApproveOTPage;

