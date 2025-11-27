import {Button, Icon, Modal} from '@ant-design/react-native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import DropDownPicker from 'react-native-dropdown-picker';
import {Card, Checkbox} from 'react-native-paper';
import Swipeout from 'react-native-swipeout';
import AppBar from '../../components/AppBar';
import DataNotFound from '../../components/DataNotFound';
import Loading from '../../components/loading';
import styleSheet from '../../components/StyleSheet';
import {COLOR} from '../../constants/Colors';
import {Fonts} from '../../constants/fonts';
import LocalStorageKey from '../../constants/LocalStorageKey';
import {ROUTE} from '../../constants/RoutePath';
import {IMenu} from '../../models/menu';
import {IWorkOrder} from '../../models/WorkOrder';
import {
  fetchtCreateVisit,
  fetchtDeleteVisit,
  fetchtVisitInspector,
} from '../../services/visitInspector';
import {fetchWorkOrderList} from '../../services/workOrder';
import {getWorkCenter} from '../../services/work_center_service';
import {_getData} from '../../utils/AsyncStorage';
import {convertDateToThaiMonthDayThai} from '../../utils/Date';
import {FullTextSearch} from '../../utils/FullTextSearch';
import {generateKey} from '../../utils/Random';
import {styleLg,styleSm} from './InspectorPageCss';
import { useNavigation, StackActions } from '@react-navigation/native';

const coca_logo = require('../../../assets/images/coca_logo.png');

interface CardWorkOrderTypes {
  day: string;
  orders: {
    orderId?: string;
    type?: string;
    objType?: string;
    equipment?: string;
    logo?: string;
    description?: string;
    dateFinish?: string;
    timeFinish?: string;
    account?: string;
    orderTypeDescription?: string;
    countDownTimeLimit?: string;
    billNo?: string;
    customerId?: string;
    isConnectivity?: boolean;
    colorStatus?: string;
    errorMessage?: string;
    warranty?: string;
    webStatus?: string;
    workType?: string;
  }[];
}

type Inputs = {
  searchText: string;
  searchTextList: string;
  mileInStore: string;
};

const InspectorPage = (props: any) => {
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
      onPress: () => onSwipeOpen(),
      fontSize: 26,
      backgroundColor: '#CB4335',
    },
  ];
  const [menus, menusSet] = useState<IMenu[]>([]);
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState<any>(undefined);
  const [open, setOpen] = useState(false);
  const [valueWorkCenter, setValueWorkCenter] = useState(null);
  const [items, setItems] = useState<any>([]);
  const [workOrderSelect, setWorkOrderSelect] = useState<any>();
  const [workOrderList, setWorkOrderList] = useState<any>();
  const [workOrderSelectVisit, setWorkOrderSelectVisit] = useState<any>();
  const {control, getValues, reset, setValue, watch} = useForm<Inputs>();
  const [orderListFilter, setOrderListFilter] = useState<IWorkOrder[] | null>();
  const [orderListFilterVisit, setOrderListFilterVisit] = useState<
    IWorkOrder[] | null
  >();
  const [loading, setLoading] = useState(true);
  const [workOrderId, setWorkOrderId] = useState<any>();
  const [userInfo, setUserInfo] = useState<{fullName: string; role: string}>({
    fullName: '',
    role: '',
  });

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, [screenInfo]);


  useEffect(() => {
    menusSet([
      {
        title: 'Inspector',
        iconName: 'clipboard-check',
        size: 70,
        route: ROUTE.MAIN,
      },
    ]);

    (async () => {
      try {
        const result = await _getData({key: LocalStorageKey.userInfo});
        const userInformation = JSON.parse(`${result}`);
        setUserInfo({
          fullName: userInformation.fullName,
          role: userInformation.role,
        });
        const workCenter = await getWorkCenter();
        setItems(workCenter);
      } catch (err: any) {
      } finally {
      }
    })();
  }, []);

  useEffect(() => {
    getWorkOrderVisitInspectorList();
  }, []);

  useEffect(() => {
    if(props.refresh) {
      getWorkOrderVisitInspectorList();
    }
  }, [props]);

  const getWorkOrderVisitInspectorList = async () => {
    const orderList = await fetchtVisitInspector();
    if (orderList) {
      setWorkOrderList(orderList);
      setOrderListFilterVisit(orderList);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (valueWorkCenter != null) {
      getWorkOrderVisit(valueWorkCenter);
    }
  }, [valueWorkCenter]);

  const getWorkOrderVisit = async (wk_ctr: any) => {
    setLoading(true);
    const orderList = await fetchWorkOrderList(wk_ctr);
    if (orderList) {
      setWorkOrderSelect(orderList.data.dataResult);
      setOrderListFilter(orderList.data.dataResult);
      _onClickModal();
      setLoading(false);
    }
  };

  const onSwipeOpen = async () => {
    Alert.alert('แจ้งเตือน', `คุณต้องการลบ Order  ${workOrderId}?`, [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ยืนยัน',
        onPress: async () => {
          setLoading(true);
          try {
            let data: any = [workOrderId];
            await fetchtDeleteVisit(data);
            getWorkOrderVisitInspectorList();
          } catch (error) {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const _onClickModal = () => {
    setStateVisibleModal(!visibleModal);
    setOpen(false);
    setWorkOrderSelectVisit({});
    setValue('searchText', '');
  };

  watch(observe => {
    if (observe.searchText && observe.searchText.length >= 3) {
      if (orderListFilter) {
        const newResult = (orderListFilter as IWorkOrder[]).map(val => {
          return {
            orders: val.orders.map(order => {
              return {
                ...order,
                day: val.day,
              };
            }),
          };
        }, []);
        setWorkOrderSelect(
          FullTextSearch(newResult as any[], 'day', observe.searchText) as any,
        );
      }
    } else if (
      observe.searchText === null ||
      observe.searchText === undefined ||
      observe.searchText.length === 0
    ) {
      setWorkOrderSelect(orderListFilter);
    }
  });

  watch(observe => {
    if (observe.searchTextList && observe.searchTextList.length >= 3) {
      if (orderListFilterVisit) {
        const newResult = (orderListFilterVisit as IWorkOrder[]).map(val => {
          return {
            orders: val.orders.map(order => {
              return {
                ...order,
                day: val.day,
              };
            }),
          };
        }, []);
        setWorkOrderList(
          FullTextSearch(
            newResult as any[],
            'day',
            observe.searchTextList,
          ) as any,
        );
      }
    } else if (
      observe.searchTextList === null ||
      observe.searchTextList === undefined ||
      observe.searchTextList.length === 0
    ) {
      setWorkOrderList(orderListFilterVisit);
    }
  });

  const renderItemVisit = ({item, index}: any) => {
    return item;
  };

  const createVisit = async () => {
    // Alert.alert('Create Visit');
    setLoading(true);
    try {
      let data: any = [];
      if (workOrderSelectVisit) {
        for (var key in workOrderSelectVisit) {
          if (workOrderSelectVisit.hasOwnProperty(key)) {
            data.push(workOrderSelectVisit[key].value);
          }
        }
      }
      _onClickModal();
      const result = await fetchtCreateVisit(data);
      getWorkOrderVisitInspectorList();
    } catch (error) {
      setLoading(false);
    }
  };

  const BuildModalDrawer = () => {
    const listOrder: any = [];
    if (visibleModal) {
      if (workOrderSelect && workOrderSelect?.length > 0) {
        workOrderSelect.forEach((order: any, index: any) => {
          listOrder.push(CardWorkOrderVisit(index, order, () => {}));
        });
      }
    }
    return (
      <Modal
        transparent
        key={'BuildModalDrawer'}
        animationType={'none'}
        maskClosable
        style={[styles.modalWidth,{
          height: '100%',
        }]}
        visible={visibleModal}>
        <View>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                _onClickModal();
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View style={{paddingLeft: 40, paddingRight: 40}}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: 26,
                  color: COLOR.secondary_primary_color,
                }}>
                WorkCenter : {valueWorkCenter}
              </Text>
            </View>
            <View>{SearchItemWorkCenter()}</View>
          </View>
          <View
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              height: 850,
              marginTop: 20,
            }}>
            {listOrder.length > 0 ? (
              <FlatList
                data={listOrder}
                initialNumToRender={5}
                renderItem={renderItemVisit}
                keyExtractor={(item, index) => `check-list-qi-${index}`}
              />
            ) : (
              <View style={{marginTop: 120}}>
                <DataNotFound />
              </View>
            )}
          </View>
          <View style={{padding: 30}}>
            {BottomWidget('ตกลง', () => {
              createVisit();
            })}
          </View>
        </View>
      </Modal>
    );
  };

  const BottomWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Button
          style={[
            styles.btn,
            colorBackground && {backgroundColor: colorBackground},
            {height: 40, borderRadius: 6},
          ]}
          onPress={action}>
          <Text style={{color: 'white', fontSize: 14}}>{title}</Text>
        </Button>
      </View>
    );
  };

  const BuildWorkCenter = () => {
    return (
      <>
      
        <View style={{ flexDirection: 'row' }} key={('work-center')}>
          <View style={{ flex: 0.8, paddingLeft: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 3 }}>
                <DropDownPicker
                  style={{
                    borderColor: COLOR.secondary_primary_color,
                    borderWidth: 2,
                    marginTop: 16,
                    height: 40,
                    left: 26,
                  }}
                  open={open}
                  value={valueWorkCenter}
                  items={items}
                  searchable={true}
                  placeholder="Select Work Center Visit"
                  searchPlaceholder="Search..."
                  placeholderStyle={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: screenInfo.width > 500 ? 16 : 12,
                    color: COLOR.secondary_primary_color,
                  }}
                  textStyle={{
                    fontFamily: Fonts.Prompt_Medium,
                    color: COLOR.secondary_primary_color,
                  }}
                  listItemLabelStyle={{
                    fontFamily: Fonts.Prompt_Medium,
                    color: COLOR.white,
                  }}
                  setOpen={setOpen}
                  setValue={setValueWorkCenter}
                  searchTextInputStyle={{
                    color: COLOR.white,
                    borderColor: COLOR.white,
                    borderWidth: 2,
                  }}
                  searchContainerStyle={{
                    borderBottomColor: COLOR.white,
                  }}
                  searchPlaceholderTextColor={COLOR.white}
                  dropDownContainerStyle={{
                    backgroundColor: COLOR.secondary_primary_color,
                    borderBottomColor: COLOR.secondary_primary_color,
                    borderWidth: 2,
                    borderColor: COLOR.secondary_primary_color,
                  }}
                  setItems={setItems}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }} key={generateKey('work-center')}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'flex-end',
                right:95,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: screenInfo.width > 500 ? 20 : 12,
                    color: COLOR.gray,
                  }}>
                  ชื่อ : 
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: screenInfo.width > 500 ? 20 : 12,
                    color: COLOR.secondary_primary_color,
                    marginRight: 10,
                  }}>
                   {userInfo.fullName}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: screenInfo.width > 500 ? 20 : 12,
                    color: COLOR.gray,
                  }}>
                  ตำแหน่ง : 
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: screenInfo.width > 500 ? 20 : 12,
                    color: COLOR.secondary_primary_color,
                  }}>
                  {userInfo.role}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
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

  const CardWorkOrderVisit = (
    key: any,
    args?: CardWorkOrderTypes,
    route?: any,
  ) => {
    return (
      <View
        style={{flexDirection: 'row', justifyContent: 'space-between'}}
        key={`${args?.day}-${key}`}>
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
              fontSize: screenInfo.width > 500 ? 20 : 12,
              paddingTop: 10,
            }}>
            {args?.day ? convertDateToThaiMonthDayThai(args?.day) : ''}
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
          <View style={{flexDirection: 'column'}}>
            {args?.orders.map((val: any, idx: number) => {
              return (
                <View
                  style={{marginTop: 4, marginRight: 10}}
                  key={`view-${val?.orderId}-${idx}`}>
                  <View style={{flex: 4}} key={`${val?.orderId}-${idx}`}>
                    <View style={[{marginLeft: 4}]}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: screenInfo.width > 500 ? 0.1 :0.1}}>
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
                        <View style={{flex: 4}}>
                          <Card
                            style={{
                              backgroundColor: val?.colorStatus,
                              borderColor: val?.colorStatus,
                            }}>
                            <Card.Content>
                              <View
                                style={{
                                  position: 'absolute',
                                  left: 0,
                                  right: 0,
                                  justifyContent: 'flex-end',
                                  alignItems: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    left: 0,
                                    width: 30,
                                    height: 30,
                                  }}>
                                  <Checkbox
                                    status={
                                      workOrderSelectVisit != null &&
                                      workOrderSelectVisit[`${val?.orderId}`]
                                        ?.checked
                                        ? 'checked'
                                        : 'unchecked'
                                    }
                                    onPress={() => {
                                      console.info('onPress chekbox',workOrderSelectVisit,
                                        workOrderSelectVisit[val?.orderId])
                                      if (
                                        workOrderSelectVisit != null &&
                                        workOrderSelectVisit[val?.orderId]
                                      ) {
                                        setWorkOrderSelectVisit({
                                          ...workOrderSelectVisit,
                                          ...{
                                            [`${val?.orderId}`]: {
                                              checked: false,
                                              value: val?.orderId,
                                            },
                                          },
                                        });
                                      } else {
                                        setWorkOrderSelectVisit({
                                          ...workOrderSelectVisit,
                                          ...{
                                            [`${val?.orderId}`]: {
                                              checked: true,
                                              value: val?.orderId,
                                            },
                                          },
                                        });
                                      }
                                    }}
                                  />
                                </View>
                              </View>
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
                                  <View style={{flex: 2}}>
                                    <Text
                                      style={[styles.txt18,{
                                        color: '#FFFFFF',
                                        fontWeight: 'bold',
                                        fontFamily: Fonts.Prompt_Medium,
                                      }]}>
                                      {val?.orderId} : {val?.type} (
                                      {val?.objType})
                                      {val.logo && (
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
                                      style={[styles.txt18,{
                                        color: '#FFFFFF',
                                        fontWeight: 'bold',
                                        fontFamily: Fonts.Prompt_Light,
                                      }]}>
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
                                    flex: 2,
                                  }}>
                                  <View
                                    style={{
                                      flex: 2,
                                      alignItems: 'flex-end',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                    }}>
                                    <View>
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
                                    </View>
                                    {/* <View style={{ marginTop: -14 }}>
                                      <CountDown
                                        until={Number(convertDateTimeDeff(
                                          val?.countDownTimeLimit,
                                        ))}
                                        digitTxtStyle={{ color: COLOR.white }}
                                        size={12}
                                        timeLabels={{ d: '', h: '', m: '', s: '' }}
                                      />
                                    </View> */}
                                  </View>
                                </View>
                              </View>
                            </Card.Content>
                          </Card>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const CardWorkOrder = (key: any, args?: CardWorkOrderTypes, route?: any) => {
    return (
      <View
        style={{flexDirection: 'row', justifyContent: 'space-between'}}
        key={`${args?.day}-${key}`}>
        <View
          style={{
            flex: screenInfo.width > 500 ? 0.5 : 0.6,
            borderBottomWidth: 2,
            borderBottomColor: '#D0D0D0',
          }}>
          <Text
            style={{
              paddingLeft: 14,
              fontFamily: Fonts.Prompt_Medium,
              fontSize: screenInfo.width > 500 ? 16 : 10,
              paddingTop: 10,
            }}>
            {args?.day ? convertDateToThaiMonthDayThai(args?.day) : ''}
          </Text>
        </View>
        <View
          style={{
            flex: screenInfo.width > 500 ? 4 : 4,
            borderBottomWidth: 1,
            borderBottomColor: '#D0D0D0',
            borderLeftWidth: 2,
            borderLeftColor: '#D0D0D0',
          }}>
          <View style={{flexDirection: 'column'}}>
            {args?.orders.map((val: any, idx: number) => {
              return (
                <View
                  style={{marginTop: 4, marginRight: 10}}
                  key={`view-${val?.orderId}-${idx}`}>
                  {val?.workType != 'inspector' ? (
                    <Swipeout
                      autoClose={true}
                      buttonWidth={80}
                      right={swipeoutBtns}
                      onOpen={() => setWorkOrderId(val?.orderId)}
                      backgroundColor={COLOR.white}
                      key={`Swipeout-${val.orderId}-${idx}`}>
                      <View style={{flex: 4}} key={`${val?.orderId}-${idx}`}>
                        <TouchableHighlight
                          underlayColor="#fff"
                          onPress={() => {
                            if (route != null) {
                              route;
                            } else {
                              // router.Actions.push(ROUTE.INSPECTOR_WORK_ITEM, {
                              //   workDetail: JSON.stringify(val),
                              // });
                              navigation.dispatch(StackActions.push(ROUTE.INSPECTOR_WORK_ITEM, {
                                workDetail: JSON.stringify(val),
                              }));
                            }
                          }}>
                          <View style={[{marginLeft: 4}]}>
                            <View style={{flexDirection: 'row'}}>
                              <View style={{flex: screenInfo.width > 500 ? 0.1 : 0.1}}>
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
                              <View style={{flex: screenInfo.width > 500 ? 4 : 4}}>
                                <Card
                                  style={{
                                    backgroundColor: val?.colorStatus,
                                    borderColor: val?.colorStatus,
                                  }}>
                                  <Card.Content>
                                    <View style={{position: 'absolute'}}>
                                      <Icon
                                        name="team"
                                        color="#FFFFFF"
                                        size={20}
                                      />
                                    </View>
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
                                        <View style={{flex: 2}}>
                                          <Text
                                            style={{
                                              color: '#FFFFFF',
                                              fontWeight: 'bold',
                                              fontSize: screenInfo.width > 500 ? 18 : 12,
                                              fontFamily: Fonts.Prompt_Medium,
                                            }}>
                                            {val?.orderId} : {val?.type} (
                                            {val?.objType})
                                            {val.logo && (
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
                                              fontSize: screenInfo.width > 500 ? 18 : 12,
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
                                              fontSize:screenInfo.width > 500 ? 14 : 10,
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
                                          flex: 2,
                                        }}>
                                        <View
                                          style={{
                                            flex: 2,
                                            alignItems: 'flex-end',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                          }}>
                                          <View>
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
                                          </View>
                                          {/* <View style={{marginTop: -14}}>
                                            <CountDown
                                              until={Number(
                                                convertDateTimeDeff(
                                                  val?.countDownTimeLimit,
                                                ),
                                              )}
                                              digitTxtStyle={{
                                                color: COLOR.white,
                                              }}
                                              size={12}
                                              timeLabels={{
                                                d: '',
                                                h: '',
                                                m: '',
                                                s: '',
                                              }}
                                            />
                                          </View> */}
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
                  ) : (
                    <TouchableHighlight
                      underlayColor="#fff"
                      onPress={() => {
                        if (route != null) {
                          route;
                        } else {
                          // router.Actions.push(ROUTE.INSPECTOR_WORK_ITEM, {
                          //   workDetail: JSON.stringify(val),
                          // });
                          navigation.dispatch(StackActions.push(ROUTE.INSPECTOR_WORK_ITEM, {
                            workDetail: JSON.stringify(val),
                          }));
                        }
                      }}>
                      <View style={[{marginLeft: 4}]}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.1}}>
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
                          <View style={{flex: 4}}>
                            <Card
                              style={{
                                backgroundColor: val?.colorStatus,
                                borderColor: val?.colorStatus,
                              }}>
                              <Card.Content>
                                <View style={{position: 'absolute'}}>
                                  <Icon
                                    name="file-search"
                                    color="#FFFFFF"
                                    size={20}
                                  />
                                </View>
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
                                    <View style={{flex: 2}}>
                                      <Text
                                        style={{
                                          color: '#FFFFFF',
                                          fontWeight: 'bold',
                                          fontSize: screenInfo.width > 500 ? 18 : 14,
                                          fontFamily: Fonts.Prompt_Medium,
                                        }}>
                                        {val?.orderId} : {val?.type} (
                                        {val?.objType})
                                        {val.logo && (
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
                                          fontSize: screenInfo.width > 500 ? 18 : 14,
                                          fontFamily: Fonts.Prompt_Light,
                                        }}>
                                        Equipment: {val?.equipment} {val?.workType}
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
                                          fontSize:screenInfo.width > 500 ? 14 : 10,
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
                                      flex: 2,
                                    }}>
                                    <View
                                      style={{
                                        flex: 2,
                                        alignItems: 'flex-end',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                      }}>
                                      <View>
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
                                      </View>
                                      {/* <View style={{marginTop: -14}}>
                                        <CountDown
                                          until={Number(
                                            convertDateTimeDeff(
                                              val?.countDownTimeLimit,
                                            ),
                                          )}
                                          digitTxtStyle={{color: COLOR.white}}
                                          size={12}
                                          timeLabels={{
                                            d: '',
                                            h: '',
                                            m: '',
                                            s: '',x
                                          }}
                                        />
                                      </View> */}
                                    </View>
                                  </View>
                                </View>
                              </Card.Content>
                            </Card>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const SearchItemWorkCenter = () => (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={{flex: 3, marginTop: 20}}>
            <TextInput
              style={[
                styleSheet.input,
                {height: 40, fontSize: screenInfo.width > 500 ? 16 :12, width: '100%'},
              ]}
              placeholderTextColor={'#FFFFFF'}
              placeholder="Search"
              value={value}
              onBlur={onBlur}
              onChangeText={textSearch => onChange(textSearch)}
            />
          </View>
        )}
        name="searchText"
        defaultValue=""
      />
    </View>
  );

  const SearchItem = () => (
    <View
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
      }}>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={{flex: 3, marginTop: 20}}>
            <TextInput
              style={[styleSheet.input, {height: 52}]}
              placeholderTextColor={'#FFFFFF'}
              placeholder="Search"
              value={value}
              onBlur={onBlur}
              onChangeText={textSearch => onChange(textSearch)}
            />
          </View>
        )}
        name="searchTextList"
        defaultValue=""
      />
    </View>
  );

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

  const renderWorkOrder = () => {
    const listOrder: any = [];
    if (workOrderList && workOrderList?.length > 0) {
      workOrderList?.forEach((order: any, index: any) => {
        listOrder.push(CardWorkOrder(index, order));
      });
    }

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View >
        
        <View >
          
          {SearchItem()}
          {DrawHorizontalWidget()}
          <View
            style={{
              marginTop: 10,
              maxHeight: 960,
             
            }}>
            {listOrder.length > 0 ? (
              <FlatList
                data={listOrder}
                initialNumToRender={5}
                renderItem={renderItem}
                keyExtractor={(item, index) => `check-list-qi-${index}`}
              />
            ) : (
              <View style={{marginTop: 120}}>
                <DataNotFound />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <AppBar title="Visit / Inspector"></AppBar>
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../assets/images/bg.png')}>
        <View key={`work-order-animation`}>
          <Animated.View key={`work-order-animation`} style={{height:screenInfo.width > 500 ? 'auto' : 340}}>
          {BuildWorkCenter()}
            {renderWorkOrder()}
            {BuildModalDrawer()}
          </Animated.View>
        </View>
      </ImageBackground>
      <Loading loading={loading} />
    </>
  );
};

export default InspectorPage;
