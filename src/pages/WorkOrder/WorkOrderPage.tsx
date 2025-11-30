import { Button, Icon, Modal } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import Swipeout from 'react-native-swipeout';
import AppBar from '../../components/AppBar';
import DataNotFound from '../../components/DataNotFound';
import DropdownSelect from '../../components/DropdownSelect';
import { DropdownSelectMultipleItemProps } from '../../components/DropdownSelectMultiple';
import Loading from '../../components/loading';
import styleSheet from '../../components/StyleSheet';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import LocalStorageKey from '../../constants/LocalStorageKey';
import { ROUTE } from '../../constants/RoutePath';
import { LoginResponseInterface } from '../../models/login';
import {
  IWorkOrder,
  IWorkOrderFilter,
  IWorkOrderOrder,
} from '../../models/WorkOrder';
import { IWorkOrderCustomer } from '../../models/WorkOrderCustomer';
import { NotifyContext } from '../../reducer/NotifyContext';
import { fetchWorkOrderList } from '../../services/workOrder';
import { fetchtWorkOrderCustomer } from '../../services/workOrderCustomer';
import { getWorkCenter } from '../../services/work_center_service';
import { checkWorkInWorkOut } from '../../services/work_in_work_out';
import { checkInShop } from '../../services/work_order_list_service';
import { _getData, _getDataJson, _removeData, _storeData } from '../../utils/AsyncStorage';
import { convertDateToThaiMonthDayThai } from '../../utils/Date';
import { FilterArrStrGroup, FullTextSearch } from '../../utils/FullTextSearch';
import styles from './WorkOrderPageCss';
const coca_logo = require('../../../assets/images/coca_logo.png');
import CountDown from 'react-native-countdown-component';
import { useNavigation, StackActions } from '@react-navigation/native';

type Inputs = {
  searchText: string;
  mileInStore: string;
};

const WorkOrderPage = (props: any) => {
  const [listItem, setListItem] = useState<any[]>([]);
  const [visibleData, setVisibleData] = useState(listItem.slice(0, 2));
  const [batchSize] = useState(2);


  const [workNotify, setWorkNotify] = useContext(NotifyContext);
  const roleSelectWorkCenter = ['Admin', 'Manager', 'Supervisor'];
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [visibleModalOrderSelect, setVisibleModalOrderSelect] = useState(false);
  const [multipleOrderManage, setMultipleOrderManage] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<LoginResponseInterface>();
  const [orderList, setOrderList] = useState<IWorkOrder[] | null>();
  const [orderListMaster, setOrderListMaster] = useState<IWorkOrder[] | null>();
  const [orderListFilter, setOrderListFilter] = useState<
    IWorkOrderFilter[] | null
  >();
  const { control, getValues, reset, setValue, watch } = useForm<Inputs>();
  const [workIn, setWorkIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useRole, setUseRole] = useState(false);
  const [idRemove, setIdRemove] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [checkInModal, setStateCheckInModal] = useState(false);
  const [customerData, setCustomerData] = useState<IWorkOrderCustomer | null>();
  const [mileInStoreTextError, setMileInStoreTextError] = useState('');
  const [valueWorkCenter, setValueWorkCenter] = useState<any>(null);
  const [itemsWorkCenter, setItemsOrderCode] = useState<any[]>([]);
  const [selectsItem, setValueSelectsItem] = useState<
    DropdownSelectMultipleItemProps[]
  >([
    {
      label: 'งานซ่อมบำรุงรักษาเชิงป้องกัน',
      value: ['ZC01', 'BN01'],
      checked: true,
    },
    {
      label: 'งานซ่อมลูกค้าทั่วไป',
      value: ['ZC02', 'BN02'],
      checked: true,
      webstatus: false,
    },
    { label: 'งานซ่อม  7-11', value: ['ZC03'], checked: true, webstatus: false },
    {
      label: 'งานติดตั้ง',
      value: ['ZC04', 'BN04'],
      checked: true,
      webstatus: false,
    },
    {
      label: 'งานถอดถอน',
      value: ['ZC09', 'BN09'],
      checked: true,
      webstatus: false,
    },
    {
      label: 'งาน Survey',
      value: ['ZC00', 'BN00'],
      checked: true,
      webstatus: false,
    },
    {
      label: 'งาน EQ Set up',
      value: ['ZC16', 'BN16'],
      checked: true,
      webstatus: false,
    },
    {
      label: 'งาน Refurbish',
      value: ['ZC15', 'BN15'],
      checked: true,
      webstatus: false,
    },
    {
      label: 'งานที่ยังไม่ปิด',
      value: ['2', '3'],
      checked: true,
      webstatus: true,
    },
    { label: 'งานที่ปิดแล้ว', value: ['4'], checked: true, webstatus: true },
  ]);
  const navigation = useNavigation();
  var swipeoutBtns = [
    {
      component: (
        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            marginTop: 46,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.Prompt_Medium,
              color: COLOR.white,
            }}>
            DELETE
          </Text>
        </View>
      ),
      onPress: () => {
        if (idRemove) {
          if (multipleOrderManage.length > 0) {
            let removeData = multipleOrderManage.filter(
              (val: any) => val.orderId != idRemove,
            );
            if (removeData) {
              setMultipleOrderManage([...removeData]);
            } else {
              setMultipleOrderManage([]);
            }
          }
        }
      },
      fontSize: 26,
      backgroundColor: '#CB4335',
    },
  ];

  useCallback(() => {
    checkCheckIn();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const result: any = await _getData({ key: LocalStorageKey.userInfo });
        const userInformation = JSON.parse(result);
        const user = new LoginResponseInterface(userInformation);

        if (roleSelectWorkCenter.includes(user.role)) {
          const workCenter = await getWorkCenter();
          setItemsOrderCode(workCenter);
          setUseRole(roleSelectWorkCenter.includes(user.role));
          setValueWorkCenter(user?.wk_ctr);
        }
        setUserInfo(user);
        await WorkOrderList(user?.wk_ctr);
      } catch (err: any) {
        setFetchError(err);
      } finally {
        setLoading(false);
        setWorkNotify(0);
      }
    })();
  }, [props]);

  const stylesSM = StyleSheet.create({
    dropdownCtr: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      width: '100%',
      height: 42,
      borderRadius: 4,
      paddingTop: 4,
      marginTop: 10,
      marginLeft: 27,
      alignItems: 'flex-start',
      paddingLeft: 10,
    },
    dropdownWorkCtr: {
      color: COLOR.white,
      fontSize: 12,
      marginTop: 0,
    },
    fullname: {
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 14,
      color: COLOR.secondary_primary_color,
    }, wkCtrText: {
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 10,
      color: COLOR.secondary_primary_color,
    },
    text2: {
      fontSize: 12
    },
    text3: {
      fontSize: 10
    }, cocaLogo: {
      width: 16,
      height: 16,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 50,
      marginTop: 8,
      position: 'absolute'
    },
    modalMemu: {
      fontFamily: Fonts.Prompt_Light,
      marginTop: 8,
      fontSize: 10,
      marginLeft: 5,
    }
  });

  const stylesLG = StyleSheet.create({
    modalMemu: {
      fontFamily: Fonts.Prompt_Light,
      marginTop: 8,
      fontSize: 16,
    },
    dropdownCtr: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      width: '100%',
      height: 42,
      borderRadius: 4,
      paddingTop: 4,
      marginTop: 10,
      alignItems: 'flex-start',
      paddingLeft: 20,
    },
    dropdownWorkCtr: {
      color: COLOR.white,
      fontSize: 16,
      marginTop: -4,
    }, fullname: {
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 20,
      color: COLOR.secondary_primary_color,
    }, wkCtrText: {
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 20,
      color: COLOR.secondary_primary_color,
    },
    text2: {
      fontSize: 18
    },
    text3: {
      fontSize: 14
    }, cocaLogo: {
      width: 24,
      height: 24,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 50,
    }
  });

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSM);
    } else {
      setStyles(stylesLG);
    }

  }, [screenInfo]);

  const PlanInfo = ({ row }: any) => {
    return (
      <View style={stylesPlan.container}>
        <Text style={stylesPlan.title}>📅 แผนงาน (Plan)</Text>

        <Text style={stylesPlan.label}>
          <Text style={stylesPlan.icon}>🟢</Text> <Text style={stylesPlan.bold}>เริ่ม:</Text>{' '}
          {row.productioN_START_DATE_TIME ? moment(row.productioN_START_DATE_TIME).format('DD/MM/YYYY เวลา hhmm') : ''}
        </Text>

        <Text style={stylesPlan.label}>
          <Text style={stylesPlan.icon}>🔴</Text> <Text style={stylesPlan.bold}>สิ้นสุด:</Text>{' '}
          {row.dateFinish ? moment(row.dateFinish).format('DD/MM/YYYY') : '—'} เวลา:{' '}
          {row.timeFinish ? `${row.timeFinish} น.` : '—'}
        </Text>
        {convertDateTimeDeff(row.dateFinish) > 0 && <CountDown
          until={Number(convertDateTimeDeff(row.dateFinish))}
          size={14}
          digitStyle={{
            backgroundColor: '#FFD700', // สีพื้นหลังของตัวเลข
            borderRadius: 5,
            borderColor: '#FFA500',
            borderWidth: 1,
          }}
          digitTxtStyle={{
            color: '#1E1E2F', // สีตัวอักษร
            fontWeight: 'bold',
            fontFamily: 'Prompt-Bold',
          }}
          timeLabels={{
            d: 'วัน',
            h: 'ชม.',
            m: 'นาที',
            s: 'วินาที',
          }}
          timeToShow={['D', 'H', 'M', 'S']} // แสดงวันด้วย
          showSeparator
        />}
      </View>
    );
  };

  const SlaInfo = ({ row }: any) => {
    return (
      <View style={stylesPlan.container}>
        <Text style={stylesPlan.title}>📅 ระยะเวลาการให้บริการ (SLA)</Text>

        <Text style={stylesPlan.label}>
          <Text style={stylesPlan.icon}>🟢</Text> <Text style={stylesPlan.bold}>เริ่ม:</Text>{' '}
          {row.slA_START_DATE ? moment(row.slA_START_DATE).format('DD/MM/YYYY เวลา HH:mm') : '—'}
        </Text>

        <Text style={stylesPlan.label}>
          <Text style={stylesPlan.icon}>🔴</Text> <Text style={stylesPlan.bold}>สิ้นสุด:</Text>{' '}
          {row.slA_FINISH_DATE ? moment(row.slA_FINISH_DATE).format('DD/MM/YYYY เวลา HH:mm') : '—'}
        </Text>
        <View style={{ marginTop: 0 }}>
        </View>
      </View>
    );
  };

  const renderItem = useCallback(({ item }) => {
  const renderOrderItem = ({ item: row, index }:any) => (
    <TouchableHighlight
      key={row.orderId}
      underlayColor="#fff"
      onLongPress={() =>
        Alert.alert('แจ้งเตือน', 'ต้องการเลือกใบงานนี้ใช่หรือไม่ ?', [
          { text: 'ยกเลิก', style: 'cancel' },
          {
            text: 'ตกลง',
            onPress: () => selectWorkOrder(row, item.day),
          },
        ])
      }
      onPress={async () => {
        reset({ searchText: '' });
        const result = await _getData({ key: LocalStorageKey.userInfo });
        const userInformation = JSON.parse(result);
        navigation.dispatch(StackActions.push(ROUTE.WORKORDERLIST, {
          backReloadPage: true,
          orderId: row.orderId,
          type: row.type,
          objType: row.objType,
          pmType: row.pmtype,
          workCenter: userInformation?.wk_ctr,
          orderTypeDescription: row.orderTypeDescription,
          IsConnectivity: row?.isConnectivity,
          errorMessage: row.errorMessage,
          webStatus: row.webStatus,
        }))
      }}>
      <View style={{ marginTop: 10, marginLeft: 10, marginRight: 20 }}>
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
                backgroundColor: row.colorStatus,
                borderColor: row.colorStatus,
              }}>
              <Card.Content>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'column', flex: 2 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[{ color: '#FFFFFF', fontWeight: 'bold', fontFamily: Fonts.Prompt_Medium }, styles.text2]}>
                        {row.orderId} : {row.type} ({row.objType})
                      </Text>
                      {row.logo && (
                        <Image
                          style={[styles.cocaLogo ?? { width: 16, height: 16, marginTop: 3 }]}
                          source={coca_logo}
                        />
                      )}
                      <Text style={[{ color: '#FFFFFF', fontWeight: 'bold', fontFamily: Fonts.Prompt_Light }, styles.text2]}>
                        Equipment: {row.equipment}
                      </Text>
                      <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: Fonts.Prompt_Light }}>
                        {row.description}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                      <Text style={[{ color: '#FFFFFF', fontFamily: Fonts.Prompt_Light }, styles.text3]}>
                        รหัสลูกค้า: {row.customerId}
                      </Text>
                      <Text style={[{ color: '#FFFFFF', fontFamily: Fonts.Prompt_Light }, styles.text3]}>
                        {row.account}
                      </Text>
                      <Text style={[{ color: '#FFFFFF', fontFamily: Fonts.Prompt_Light }, styles.text3]}>
                        สาขา {row.account}
                      </Text>
                    </View>
                  </View>
                </View>
                <PlanInfo row={row} />
                {row.slA_FINISH_DATE && <SlaInfo row={row} />}
              </Card.Content>
            </Card>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} key={item.day}>
      <View style={{ flex: 0.5, borderBottomWidth: 2, borderBottomColor: '#D0D0D0' }}>
        <Text style={{ paddingLeft: 14, fontFamily: Fonts.Prompt_Medium, fontSize: 16, paddingTop: 10 }}>
          {item.day ? convertDateToThaiMonthDayThai(item.day) : ''}
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
        <FlatList
          data={item.orders}
          renderItem={renderOrderItem}
          keyExtractor={(row) => row.orderId.toString()}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
}, []);

  const renderItem2 = useCallback(({ item }) => {
    let items = [];
    if (item.orders) {
      items = item.orders.map((row: any) => {
        return (
          <View style={{ flex: 4 }} key={row.orderId}>
            <TouchableHighlight
              onLongPress={() =>
                Alert.alert('แจ้งเตือน', 'ต้องการเลือกใบงานนี้ใช่หรือไม่ ?', [
                  {
                    text: 'ยกเลิก',
                    style: 'cancel',
                  },
                  {
                    text: 'ตกลง',
                    onPress: async () => {
                      selectWorkOrder(row, item.day);
                    },
                  },
                ])
              }
              underlayColor="#fff"
              onPress={async () => {
                reset({ searchText: '' });
                const result: any = await _getData({ key: LocalStorageKey.userInfo });
                const userInformation = JSON.parse(result);
                navigation.dispatch(StackActions.push(ROUTE.WORKORDERLIST, {
                  backReloadPage: true,
                  orderId: row.orderId,
                  type: row.type,
                  objType: row.objType,
                  pmType: row.pmtype,
                  workCenter: userInformation?.wk_ctr,
                  orderTypeDescription: row.orderTypeDescription,
                  IsConnectivity: row?.isConnectivity,
                  errorMessage: row.errorMessage,
                  webStatus: row.webStatus,
                }))
              }}>
              <View style={[{ marginTop: 10, marginLeft: 10, marginRight: 20 }]}>
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
                        backgroundColor: row.colorStatus,
                        borderColor: row.colorStatus,
                      }}>
                      <Card.Content>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flexDirection: 'column',
                              flex: 2,
                            }}>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[{
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  fontFamily: Fonts.Prompt_Medium,
                                }, styles.text2]}>
                                {row.orderId} : {row.type} ({row.objType})
                                {row.logo && (
                                  <View>
                                    <View
                                      style={{
                                        position: 'absolute',
                                        marginTop: -20,
                                        marginLeft: 6,
                                      }}>
                                      <Image
                                        style={[styles.cocaLogo ?? { width: 16, height: 16, marginTop: 3 }]}
                                        source={coca_logo}
                                      />
                                    </View>
                                  </View>
                                )}
                              </Text>
                              <Text
                                style={[{
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  fontFamily: Fonts.Prompt_Light,
                                }, styles.text2]}>
                                Equipment: {row.equipment}
                              </Text>
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontSize: 14,
                                  fontFamily: Fonts.Prompt_Light,
                                }}>
                                {row.description}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'column',
                              flex: 1,
                            }}>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                              <Text
                                style={[{
                                  color: '#FFFFFF',
                                  fontFamily: Fonts.Prompt_Light,
                                }, styles.text3]}>
                                รหัสลูกค้า: {row.customerId}
                              </Text>
                              <Text
                                style={[{
                                  color: '#FFFFFF',
                                  fontFamily: Fonts.Prompt_Light,
                                }, styles.text3]}>
                                {row.account}
                              </Text>
                              <Text
                                style={[{
                                  color: '#FFFFFF',
                                  fontFamily: Fonts.Prompt_Light,
                                }, styles.text3]}>
                                สาขา {row.account}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <PlanInfo row={row} />
                          {row.slA_FINISH_DATE && <SlaInfo row={row} />}
                        </View>
                      </Card.Content>
                    </Card>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        );
      });
    }
    return (
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        key={item.day}>
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
            {item.day ? convertDateToThaiMonthDayThai(item.day) : ''}
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
          <View style={{ flexDirection: 'column' }}>{items}</View>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback(item => item.day, []);

  function fullTextSearch(data: any[], keyword: string) {
    const lowerKeyword = keyword.toLowerCase();

    return data.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerKeyword)
      )
    );
  }

  watch(observe => {
    if (observe.searchText && observe.searchText.length >= 3) {
      if (orderListFilter) {
        const filteredData = FullTextSearch(orderListFilter, 'day', observe.searchText)
        setOrderList(filteredData);
      }
    } else if (
      observe.searchText === null ||
      observe.searchText === undefined ||
      observe.searchText.length === 0
    ) {
      setOrderList(orderListMaster);
    }
  });

  const checkCheckIn = async () => {
    try {
      const resultCheckWorkInWorkOut = await checkWorkInWorkOut();
      if (Number(resultCheckWorkInWorkOut.workIn.startMile) > 0) {
        setWorkIn(true);
      } else {
        setWorkIn(false);
      }
    } catch (error) { }
  };

  const getWorkOrderCustomer = async () => {
    try {
      if (multipleOrderManage.length > 0) {
        let getOrderId = multipleOrderManage[0];
        const result = await fetchtWorkOrderCustomer(getOrderId.orderId);
        setCustomerData(result);
      }
    } catch (error) {
      setCustomerData(null);
    }
  };

  const WorkOrderList = async (wk_ctr: any) => {
    const orderList = await fetchWorkOrderList(wk_ctr);
    _storeData({ key: 'orderList', value: orderList.data.dataResult });
    setOrderList(orderList.data.dataResult);
    setOrderListMaster(orderList.data.dataResult);
    const newResult = (orderList.data.dataResult as IWorkOrder[]).map(val => {
      return {
        orders: val.orders.map(order => {
          return {
            ...order,
            day: val.day,
          };
        }),
      };
    }, []);
    setOrderListFilter(newResult);
    const data: any = await _getData({ key: 'filterOrder' });
    if (data) {
      setValueSelectsItem([...JSON.parse(data).value]);
    }
  };

  const onValueChange = (data: DropdownSelectMultipleItemProps, index: any) => {
    selectsItem[index] = data;
    _removeData({ key: 'filterOrder' });
    setValueSelectsItem([...selectsItem]);
    _storeData({
      key: 'filterOrder',
      value: { type: 'work_notify', value: selectsItem },
    });
  };

  const _onClickModal = () => {
    setStateVisibleModal(!visibleModal);
  };

  const _onClickModalOrderSelect = () => {
    setVisibleModalOrderSelect(!visibleModalOrderSelect);
  };

  const _onSubmitSearch = () => {
    reset({ searchText: '' });
    const newWorkOrderArr = (orderListMaster as IWorkOrder[]).map(val => [
      ...val.orders.map(order => {
        return {
          ...order,
          day: val.day,
        };
      }),
    ]);

    const mapField = selectsItem
      .filter(val => val.checked)
      .map(val => val.value);
    const filterGroup = [].concat.apply([], mapField);
    const masterArr = [].concat(...(newWorkOrderArr as any));

    const masterCheckWebStatusArr = FilterArrStrGroup(
      masterArr,
      'webStatus',
      'day',
      filterGroup,
    ) as any;

    const newMasterCheckWebStatus = (
      masterCheckWebStatusArr as IWorkOrder[]
    ).map(val => [
      ...val.orders.map(order => {
        return {
          ...order,
          day: val.day,
        };
      }),
    ]);

    const masterCheckWebStatus = [].concat(...(newMasterCheckWebStatus as any));

    const lastOrder = FilterArrStrGroup(
      masterCheckWebStatus,
      'type',
      'day',
      filterGroup,
    ) as any;

    setOrderList(lastOrder);
    const newResult = (lastOrder as IWorkOrder[]).map(val => {
      return {
        orders: val.orders.map(order => {
          return {
            ...order,
            day: val.day,
          };
        }),
      };
    }, []);
    setOrderListFilter(newResult);
    _onClickModal();
  };

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

  const BottomWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button
          style={[
            styles.btn,
            colorBackground && { backgroundColor: colorBackground },
            { height: 52 },
          ]}
          onPress={action}>
          <Text style={{ color: 'white', fontSize: screenInfo.width > 500 ? 18 : 14 }}>{title}</Text>
        </Button>
      </View>
    );
  };

  const onSwipeOpen = (id: any) => {
    setIdRemove(id);
  };

  const convertDateTimeDeff = (endDate: any, orderId?: any) => {
    if (endDate) {
      let startTime = moment();
      const endTime = moment(endDate);
      const timeDiff = endTime.diff(startTime, 'seconds');
      return timeDiff;
    }
    return 0;
  };

  const ModalCheckIn = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={{ width: screenInfo.width > 500 ? 650 : screenInfo.width - 20 }}
        visible={checkInModal}>
        <View>
          <View>
            <Text style={styles.titleCheck}>เลขไมล์ถึงร้าน</Text>
            {DrawHorizontalWidget()}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              paddingTop: 30,
            }}>
            <View
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
            </View>
            <View
              style={{
                flex: 4,
                paddingLeft: 20,
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
                      justifyContent: 'space-between',
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
              () => (_onClickModalCheckIn(), setValue('mileInStore', '')),
              '#818181',
            )}
          </View>
          <View style={{ flex: 2 }}>
            {BottomWidget('ยืนยันการเข้างาน', () => _onClickCheckIn(), COLOR.primary)}
          </View>
        </View>
      </Modal>
    );
  };

  const _onClickModalCheckIn = () => {
    setStateCheckInModal(!checkInModal);
    if (!customerData) {
      getWorkOrderCustomer();
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
            setLoading(true);
            multipleOrderManage.map(async (val: any, index: any) => {
              let data = {
                mileAge: Number(getValues('mileInStore')),
                orderId: `${val.orderId}`,
                workCenter: `${userInfo?.wk_ctr}`,
              };
              let response = await checkInShop(data);
              if (multipleOrderManage.length === index + 1) {
                if (response.isSuccess) {
                  setLoading(false);
                  setStateCheckInModal(!checkInModal);
                  setVisibleModalOrderSelect(!visibleModalOrderSelect);
                  setMultipleOrderManage([]);
                  setValue('mileInStore', '');
                }
              }
            });
          } catch (error) {
            setLoading(false);
            setStateCheckInModal(!checkInModal);
            setVisibleModalOrderSelect(!visibleModalOrderSelect);
            setMultipleOrderManage([]);
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
          setStateCheckInModal(!checkInModal);
        },
      },
    ]);
  };

  const renderItemOrderWorkSelect = ({ item, index }: any) => {
    return item;
  };


  const handleLoadMore = () => {
    const nextData = listItem.slice(0, visibleData.length + batchSize);
    if (nextData.length > visibleData.length) {
      setVisibleData(nextData);
    }
  };


  const orderWorkSelect = () => {
    let listItems: any = [];
    if (visibleModalOrderSelect && multipleOrderManage.length > 0) {
      multipleOrderManage.map((val: IWorkOrderOrder, idx: number) => {
        listItems.push(
          <View
            style={{ marginTop: 4, marginRight: 10 }}
            key={`view-${val.orderId}-${idx}`}>
            <Swipeout
              autoClose={true}
              buttonWidth={80}
              right={swipeoutBtns}
              onOpen={() => onSwipeOpen(val.orderId)}
              backgroundColor={COLOR.white}
              key={`Swipeout-${val.orderId}-${idx}`}>
              <View style={{ flex: 4 }} key={`${val.orderId}-${idx}`}>
                <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                  <View style={[{ marginLeft: 4 }]}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 4 }}>
                        <Card
                          style={{
                            backgroundColor:
                              val.errorMessage && val.errorMessage?.length > 0
                                ? '#D6DBDF'
                                : val?.colorStatus,
                            borderColor:
                              val.errorMessage && val.errorMessage?.length > 0
                                ? '#D6DBDF'
                                : val?.colorStatus,
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
                                      fontSize: screenInfo.width > 500 ? 18 : 14,
                                      fontFamily: Fonts.Prompt_Medium,
                                    }}>
                                    {val?.orderId} : {val?.type} ({val?.objType}
                                    )
                                    {val.logo && (
                                      <View>
                                        <View
                                          style={{
                                            position: 'absolute',
                                            marginTop: -20,
                                            marginLeft: 6,
                                          }}>
                                          <Image
                                            style={[styles.cocaLogo]}
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
                                      fontSize: screenInfo.width > 500 ? 18 : 14,
                                      fontFamily: Fonts.Prompt_Light,
                                    }}>
                                    Equipment: {val?.equipment}
                                  </Text>
                                  <Text
                                    style={{
                                      color: '#FFFFFF',
                                      fontSize: screenInfo.width > 500 ? 14 : 10,
                                      fontFamily: Fonts.Prompt_Light,
                                    }}>
                                    {val?.description}
                                  </Text>
                                  <Text
                                    style={{
                                      color: '#FFFFFF',
                                      fontSize: screenInfo.width > 500 ? 14 : 10,
                                      fontFamily: Fonts.Prompt_Light,
                                    }}>
                                    วันที่เริ่มทำ:{' '}
                                    {val?.dateFinish
                                      ? moment(val?.dateFinish).format(
                                        'DD/MM/YYYY',
                                      )
                                      : ''}{' '}
                                    เวลา:{' '}
                                    {val?.timeFinish
                                      ? `${val?.timeFinish} น.`
                                      : ''}
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
                                      fontSize: screenInfo.width > 500 ? 16 : 12,
                                      fontFamily: Fonts.Prompt_Light,
                                    }}>
                                    รหัสลูกค้า: {val?.customerId}
                                  </Text>
                                  <Text
                                    style={{
                                      color: '#FFFFFF',
                                      fontSize: screenInfo.width > 500 ? 14 : 10,
                                      fontFamily: Fonts.Prompt_Light,
                                    }}>
                                    {val?.account}
                                  </Text>
                                  <View style={{ marginTop: screenInfo.width > 500 ? -14 : 5 }}>
                                    <CountDown
                                      until={Number(
                                        convertDateTimeDeff(
                                          val?.countDownTimeLimit,
                                        ),
                                      )}
                                      digitTxtStyle={{ color: COLOR.white }}
                                      size={12}
                                      timeLabels={{ d: '', h: '', m: '', s: '' }}
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
            </Swipeout>
          </View>,
        );
      });
      setListItem(listItems);
    }
    return (
      <Modal
        transparent
        key={'BuildModalDrawer-orderWorkSelect'}
        animationType={'none'}
        maskClosable
        style={{
          width: screenInfo.width > 500 ? 680 : screenInfo.width - 20,
          height: '100%',

        }}
        visible={visibleModalOrderSelect}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'center' }}>
                  <Button
                    style={[styles.btn, { height: 42, borderRadius: 10, backgroundColor: COLOR.primary }]}
                    onPress={() => _onClickModalOrderSelect()}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      {'เพิ่มงาน'}
                    </Text>
                  </Button>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Button
                    style={[
                      styles.btn,
                      {
                        height: 42,
                        borderRadius: 10,
                        backgroundColor: COLOR.error,
                      },
                    ]}
                    onPress={() => setMultipleOrderManage([])}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      {'ลบทั้งหมด'}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => {
                  _onClickModalOrderSelect();
                }}>
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', paddingBottom: 100 }}>
          <View style={{ marginTop: 10, maxHeight: 650, height: '90%', paddingBottom: 100 }}>
            <FlatList
              data={listItem}
              initialNumToRender={1}
              renderItem={renderItemOrderWorkSelect}
              keyExtractor={(item, index) => `select-list-${index}`}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', }}>
              <Button
                style={[styles.btn, { height: 46, borderRadius: 10, width: screenInfo.width > 500 ? 200 : 100, backgroundColor: COLOR.primary, gap: -2 }]}
                onPress={() => {
                  _onClickModalCheckIn();
                }}>
                <Text style={{ color: 'white', fontSize: screenInfo.width > 500 ? 16 : 14 }}>
                  {'เลขไมล์ถึงร้าน'}
                </Text>
              </Button>
            </View>
            <View style={{ alignItems: 'center', paddingRight: 3 }}>
              <Button
                style={[styles.btn, { height: 46, borderRadius: 10, width: screenInfo.width > 500 ? 200 : 100, backgroundColor: COLOR.primary, gap: 1 }]}
                onPress={() => {
                  if (multipleOrderManage.length > 0) {
                    navigation.dispatch(StackActions.push(ROUTE.WORK_PROCEDURE_MULTIPLE, {
                      orderId: multipleOrderManage[0].orderId,
                      multipleOrderManage,
                    }));
                    setVisibleModalOrderSelect(!visibleModalOrderSelect);
                  }
                }}>
                <Text style={{ color: 'white', fontSize: screenInfo.width > 500 ? 16 : 14 }}>{'เช็คอิน'}</Text>
              </Button>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Button
                style={[styles.btn, { height: 46, borderRadius: 10, width: screenInfo.width > 500 ? 200 : 100, backgroundColor: COLOR.primary }]}
                onPress={() => {
                  if (!workIn) {
                    Alert.alert(
                      'แจ้งเตือน',
                      'กรุณาเช็คอินออกไปปฏิบัตงาน ก่อนเริ่มปฏิบัติงาน ?',
                      [
                        {
                          text: 'ตกลง',
                          onPress: async () => {
                            navigation.dispatch(StackActions.replace(ROUTE.START_WORK));
                          }
                        },
                      ],
                    );
                    return;
                  } else {
                    if (multipleOrderManage.length > 0) {
                      navigation.dispatch(StackActions.push(
                        ROUTE.SATISFACTION_ASSESSMENT_MULTIPLE_FORM_PAGE,
                        {
                          orderId: multipleOrderManage[0].orderId,
                          multipleOrderManage,
                          type: multipleOrderManage[0].type,
                        },
                      ));
                      setVisibleModalOrderSelect(!visibleModalOrderSelect);
                    }
                  }
                }}>
                <Text style={{ color: 'white', fontSize: screenInfo.width > 500 ? 16 : 14 }}>
                  {'สรุปปิดงาน'}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const selectWorkOrder = async (data: any, day: any) => {
    if (!['ZC15', 'ZC16', 'BN17', 'BN18'].includes(data.type)) {
      let checkData = multipleOrderManage.some(
        (val: any) => val.customerId === data.customerId,
      );

      if (!checkData) {
        const orderlist2 = (await _getDataJson({ key: 'orderList' })) as any;
        let dataList: any = orderlist2?.filter((val: any) => val.day === day)[0];
        let dataListOrder = dataList?.orders?.filter(
          (val: any) =>
            val.customerId === data.customerId && Number(val.webStatus) != 4,
        );
        if (dataListOrder.length > 0) {
          setMultipleOrderManage([...dataListOrder]);
          _onClickModalOrderSelect();
        } else {
          Alert.alert('แจ้งเตือน', 'งานที่ปิดแล้วไม่สามารถทำรายการได้ ?', [
            {
              text: 'ตกลง',
            },
          ]);
        }
      } else {
        _onClickModalOrderSelect();
      }
    } else {
      Alert.alert('แจ้งเตือน', 'ไม่สามารถทำรายการได้ ZC15, ZC16, BN17, BN18', [
        {
          text: 'ตกลง',
          onPress: async () => {
            setStateCheckInModal(!checkInModal);
          },
        },
      ]);
    }
  };


  const BuildModalDrawer = () => {
    const renderItem = ({ item, index }: any) => {
      return item;
    };

    let listItem: any = [];
    if (selectsItem && selectsItem?.length > 0) {
      selectsItem?.forEach((val: DropdownSelectMultipleItemProps, index) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              onValueChange({ ...val, ...{ checked: !val.checked } }, index);
            }}
            key={`${val.label}-${val.value}-${index}`}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 8,
                padding: 10,
                backgroundColor: '#F9F9F9',
                borderRadius: 50,
              }}
              key={index}>
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <Checkbox
                  key={`checkbox-${index}`}
                  status={selectsItem[index].checked ? 'checked' : 'unchecked'}
                />
              </View>
              <View style={{ flex: screenInfo.width > 500 ? 2 : 2 }}>
                <Text
                  style={[styles.modalMemu]}>
                  {val?.label}
                </Text>
              </View>
              <View style={{ flex: screenInfo.width > 500 ? 1 : 0.5 }}>
                {selectsItem[index].checked && (
                  <Icon
                    name="check-circle"
                    size={30}
                    style={{
                      color: COLOR.primary,
                    }}
                    key={`${index}`}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>,
        );
      });
    }
    return (
      <Modal
        transparent
        key={'BuildModalDrawer'}
        animationType={'none'}
        maskClosable
        style={{
          width: screenInfo.width > 500 ? 550 : 400,
          height: screenInfo.width > 500 ? '100%' : '100%',
          marginRight: screenInfo.width > 500 ? 300 : 0,
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
        }}
        visible={visibleModal}>
        <View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                _onClickModal();
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View style={{ padding: screenInfo.width > 500 ? 40 : 5, maxHeight: '90%' }}>
            {/* <FlatList
              data={listItem}
              initialNumToRender={6}
              renderItem={renderItem}
              keyExtractor={(item, index) => `select-list-${index}`}
            /> */}
            <FlatList
              data={visibleData}
              renderItem={renderItemOrderWorkSelect}
              keyExtractor={(item, index) => `select-list-${index}`}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={10}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />

          </View>
          <View style={{ padding: screenInfo.width > 500 ? 30 : 5 }}>
            {BottomWidget('ตกลง', () => {
              _onSubmitSearch();
            }, COLOR.primary)}
          </View>
        </View>
      </Modal>
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
      <View style={{ flex: 3, marginTop: 36 }}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styleSheet.input, { height: 52 }]}
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

  const BuildIconDower = () => {
    return (
      <View>
        <TouchableHighlight
          underlayColor="none"
          style={{
            marginTop: 30,
            width: 60,
            height: 60,
            backgroundColor: COLOR.secondary_primary_color,
          }}
          onPress={() => {
            _onClickModal();
          }}>
          <Icon
            name="menu"
            color={COLOR.white}
            size={30}
            style={{ marginLeft: 15, marginTop: 16 }}
          />
        </TouchableHighlight>
      </View>
    );
  };




  const BuildWorkCenter = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginTop: -16, left: 10, flex: useRole ? 0.5 : 3 }}>
          {BuildIconDower()}
        </View>
        {useRole ? (
          <View style={{ flex: 2, marginTop: 4 }}>
            <DropdownSelect
              selects={valueWorkCenter}
              dataItem={itemsWorkCenter}
              placeholder={'Select Work Center'}
              textStyle={[styles.dropdownWorkCtr]}
              containerStyle={[styles.dropdownCtr]}
              iconStyle={{ paddingTop: 10, paddingLeft: 52 }}
              isIcon={true}
              iconSize={16}
              isShowLabel={true}
              contentContainerStyle={{ borderRadius: 10 }}
              onValueChange={(val: any) => {
                setValueWorkCenter(val);
                WorkOrderList(val);
              }}
            />
          </View>
        ) : null}
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
                style={[styles.fullname]}>
                ชื่อ:&nbsp;
              </Text>
            </View>
            <View>
              <Text
                style={[styles.fullname]}>
                {userInfo?.fullName}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'flex-end',
              right: 20,
            }}>
            <View>
              <Text
                style={[styles.wkCtrText]}>
                WorkCenter:&nbsp;
              </Text>
            </View>
            <View>
              <Text
                style={[styles.wkCtrText]}>
                {userInfo?.wk_ctr}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderWorkOrder = () => {
    return [
      props.appBar === undefined || props.appBar ? (
        <AppBar
          title="Work Order"
          key={'app-bar-work-order'}
          replacePath={'main'}></AppBar>
      ) : null,
      <View key={'scroll-view-work-order'}>
        {BuildWorkCenter()}
        {SearchItem()}
        {DrawHorizontalWidget()}

        <View
          style={{
            marginTop: 10,
            maxHeight: props.appBar === undefined || props.appBar ? 890 : 820,
            paddingBottom: screenInfo.width > 500 ? 0 : 370
          }}>
          {orderList && orderList.length > 0 ? (
            <FlatList
              data={orderList}
              initialNumToRender={5}
              removeClippedSubviews
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          ) : !loading ? (
            <View style={{ marginTop: 120 }}>
              <DataNotFound />
            </View>
          ) : null}
        </View>
      </View>,
    ];
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
        <View>
          <Animated.View key={`work-order-animation`}>
            {renderWorkOrder()}
            {BuildModalDrawer()}
            {orderWorkSelect()}
            {ModalCheckIn()}
          </Animated.View>
        </View>
      </ImageBackground>
      <Loading loading={loading} />
    </>
  );
};

export default WorkOrderPage;

const stylesPlan = StyleSheet.create({
  container: {
    marginTop: 3,
    backgroundColor: '#1E1E2F',
    padding: 5,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'Prompt-Bold',
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Prompt-Light',
  },
  bold: {
    fontWeight: 'bold',
    color: '#00CED1',
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
});
