import { Button, Icon, Modal } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Appbar, Checkbox, DataTable, RadioButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppBar from '../../../components/AppBar';
import { DropdownSelectMultipleItemProps } from '../../../components/DropdownSelectMultiple';
import Loading from '../../../components/loading';
import styleSheet from '../../../components/StyleSheet';
import TimeWorkingComponent from '../../../components/TimeWorkingComponent';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { notShowChargeTravel } from '../../../constants/Menu';
import { ROUTE } from '../../../constants/RoutePath';
import { MasterWorkOrderWorker } from '../../../models/master_worker';
import { TimeOperationWorkerInterface } from '../../../models/timeOperationWorker';
import { TimeOperationWorker } from '../../../models/time_operation_worker';
import {
  getMasterActivityTypeMas,
  getMasterWorkOrderWorker,
  getTimeOperationWorker,
  postTimeOperationWorker,
} from '../../../services/operating_time_shop_service';
import { _getData, _getDataJson, _storeData } from '../../../utils/AsyncStorage';
import { getUser } from '../../../utils/helper';
import localStyle from './WorkOrderDetailsWorkCss';
import { stylesLg, stylesSm } from './WorkOrderDetailsWorkCss';
import { useNavigation, StackActions } from '@react-navigation/native';
const background = require('../../../../assets/images/bg.png');

type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  workCenter: string;
  orderTypeDescription: string;
  webStatus: string;
};

const WorkOrderDetailsWorkPage = (props: { workOrderData: InterfaceProps }) => {
  // console.log('props.workOrderData.type::', props.workOrderData.type)
  const [isLoading, setIsLoading] = useState(false);
  const [workTimeLeft, setWorkTimeLeft] = useState<any>();
  const { orderId, workCenter } = props?.workOrderData;
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [lastDateActive, setLastDateActive] = useState<moment.Moment>(
    moment().tz('Asia/Bangkok').add(543, 'year'),
  );
  const [times, setTime] = useState<any>('00:00');
  const [timeOperationWorker, setTimeOperationWorker] = useState<any>();
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([]);
  const [checkedTravelExpenses, setCheckedTravelExpenses] =
    React.useState(false);
  useState<any>();
  const [selectsEmployeeIndex, setSelectsEmployeeIndex] = useState<any>();
  const [visibleSelect, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [indexSelectType, setIndexSelectType] = useState<any>();
  const [startWork, setStartWork] = useState<any>();

  const [employees, setEmployees] = useState<DropdownSelectMultipleItemProps[]>(
    [],
  );
  const [currentActiveEmployees, setCurrentActiveEmployees] = useState<
    DropdownSelectMultipleItemProps[]
  >([]);
  const [currentActiveMasterEmployees, setCurrentActiveMasterEmployees] =
    useState<DropdownSelectMultipleItemProps[]>([]);
  const [selectOperators, setSelectOperators] = useState<
    { keyIdx: number; keyVal?: DropdownSelectMultipleItemProps[] }[]
  >([]);
  const [operatorMaster, setOperatorMaster] = useState<
    DropdownSelectMultipleItemProps[]
  >([]);
  const [updated, setUpdated] = useState<boolean>(false);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    // console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  }, []);

  useEffect(() => {
    // let interval: any;
    // interval = setInterval(() => {
    //   const timesCurrent = moment()
    //     .locale('th')
    //     .add(543, 'year')
    //     .format('HH:mm');
    //   setTime(`${timesCurrent}`);
    // }, 1000);
    _getMasterActivityTypeMas();
    _getTimeOperationWorker();

    // return () => {
    //   clearInterval(interval), clearInterval(startWork);
    // };
  }, []);

  const convertTimeDiff = (startTime: any, endTime: any) => {
    if (startTime != null && endTime != null) {
      return moment(endTime, 'HH:mm').diff(
        moment(startTime, 'HH:mm'),
        'minutes',
      );
    }
    return '0';
  };

  const convertDateTimeDeff = (startDate: any, endDate: any): string => {
    if (startDate && endDate) {
      let startTime = moment(startDate).tz('Asia/Bangkok');
      const endTime = moment(endDate).tz('Asia/Bangkok');
      const timeDiff = endTime.diff(startTime, 'minutes');
      return timeDiff.toString();
    }
    return '0';
  };

  const _getTimeOperationWorker = async () => {
    try {
      setIsLoading(true);
      const userInfo = await getUser();
      let selectsEmployees: DropdownSelectMultipleItemProps[] =
        await _getMasterWorkOrderWorker();
      let response: TimeOperationWorker = await getTimeOperationWorker(orderId);
      setIsLoading(false);
      setCheckedTravelExpenses(response.travelCharge);

      let findEmployeeVal: any;
      if (selectsEmployees.length > 0) {
        const findIndexEmployeeById = selectsEmployees.findIndex(
          emp => emp.value === userInfo.employeeId,
        );
        findEmployeeVal = selectsEmployees[findIndexEmployeeById];
        selectsEmployees.splice(findIndexEmployeeById, 1);
        selectsEmployees.unshift({ ...findEmployeeVal, checked: false });
      }

      const startTimeTemp = (await _getDataJson({ key: 'startTimeTemp' + orderId })) as any;
      var startTimeTempDetail: any;
      if (startTimeTemp?.details) {
        startTimeTempDetail = await startTimeTemp.details;
      }
      // console.log('startTimeTempDetail =>>>', startTimeTempDetail);
      setEmployees(selectsEmployees);
      setCurrentActiveEmployees(selectsEmployees);
      setCurrentActiveMasterEmployees(selectsEmployees);
      setOperatorMaster(selectsEmployees);

      let newData = response.details.map((element :any,i:number)=>{
        if(startTimeTempDetail){
          return {
            ...element,
            startTime:startTimeTempDetail[i].startTime,
            startDate:startTimeTempDetail[i].startDate
          }
        }else{
          return element;
        }

      })

      // console.log('log newdata',{details:newData});
      setTimeOperationWorker({details:newData});


      const operators: {
        keyIdx: number;
        keyVal?: DropdownSelectMultipleItemProps[];
      }[] = [];

      if (response.details && response.details.length > 0) {
        for (const [detailKey, detailVal] of response.details.entries()) {
          if (detailVal.presonnel.length === 0 && findEmployeeVal) {
            operators.push({ keyIdx: detailKey, keyVal: [findEmployeeVal] });
          } else {
            operators.push({
              keyIdx: detailKey,
              keyVal: detailVal.presonnel.map(person => {
                return {
                  label: person.personnalName,
                  value: person.personnalNumber,
                  checked: true,
                };
              }),
            });
          }
        }
      }
      setSelectOperators(operators);
    } catch (error) {
      console.log('error::', error);
      setIsLoading(false);
    }
  };

  const _submitData = async () => {
    Alert.alert('แจ้งเตือน', 'ต้องการบันทึกข้อมูลใช่หรือไม่ ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          timeOperationWorker.travelCharge = checkedTravelExpenses;
          delete timeOperationWorker['standardTime'];

          timeOperationWorker.details.map((val: any, timeOperIdx: number) => {
            let presonnel: any = [];
            val.presonnel.map((item: any) => {
              if (item.checked) {
                presonnel.push({
                  personnalNumber: item.value,
                  personnalName: item.label,
                });
              }
            });
            val.presonnel = selectOperators[timeOperIdx]?.keyVal?.map(oper => {
              return { personnalNumber: oper.value, personnalName: oper.label };
            });
          });
          _postTimeOperationWorker({
            ...timeOperationWorker,
            ...{
              workOrder: orderId,
              startDate: moment(
                moment(timeOperationWorker.startDate).tz('Asia/Bangkok'),
              ),
              endDate: moment(
                moment(timeOperationWorker.endDate).tz('Asia/Bangkok'),
              ),
            },
          });
        },
      },
    ]);
  };

  const _getMasterActivityTypeMas = async () => {
    let activityTypeMas: any = [];
    let response = await getMasterActivityTypeMas();
    response.map(
      (val: {
        activityTypeId: number;
        activityTyper: string;
        activityText: string;
      }) => {
        activityTypeMas.push({
          label: val.activityText,
          value: val.activityTyper,
        });
      },
    );

    setItemsOrderCode(activityTypeMas);
  };

  const _getMasterWorkOrderWorker = async (): Promise<any[]> => {
    let _employees: any = [];
    try {
      let response = await getMasterWorkOrderWorker(orderId);
      if (response) {
        response.map((val: MasterWorkOrderWorker, index: any) => {
          _employees.push({
            label: val.personnelName,
            value: val.personnelNumber,
            webStatus: props.workOrderData.webStatus,
          });
        });
        return _employees;
      }
      return _employees;
    } catch (error) {
      return _employees;
    }
  };

  const _postTimeOperationWorker = async (data: any) => {
    try {
      let checkPresonnel = true;
      if (
        !['ZC15', 'ZC16', 'BN15', 'BN16'].includes(props.workOrderData.type)
      ) {
        for (let index = 0; index < data.details.length; index++) {
          if (data.details[index].presonnel.length === 0) {
            Alert.alert(
              'แจ้งเตือน',
              'กรุณาระบุข้อมูลช่างผู้ปฎิบัติงานให้ครบถ้วน',
              [{ text: 'ปิด' }],
            );
            checkPresonnel = false;
            break;
          }
        }
      }
      if (checkPresonnel) {
        setIsLoading(true);
        let response = await postTimeOperationWorker(data, true);
        setUpdated(false);
        if (response.isSuccess) {
          console.log('PROPS=>>>>', props);
          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
            {
              text: 'ปิด', onPress: () =>
                // Actions.pop() ////2013
              navigation.dispatch(StackActions.pop())
              // Actions.reset()
              //Actions.back()
              //Actions.replace(ROUTE.WORKORDERLIST,props)
            },
          ]);
        } else {
          Alert.alert('แจ้งเตือน', response.message, [{ text: 'ปิด.', onPress: () => {
            // Actions.pop()
            navigation.dispatch(StackActions.pop())
          } }]);
        }
      }
    } catch (error) {
      Alert.alert('แจ้งเตือน', `${error}`, [{ text: 'ปิด..', onPress: () => {
        // Actions.pop()
        navigation.dispatch(StackActions.pop())
      } }]);
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  const DrawHorizontalWidget = () => {
    return (
      <View
        style={{
          paddingLeft: 40,
          paddingRight: 40,
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

  const ButtonWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
    disabled?: boolean,
  ) => {
    const styles = [colorBackground && { backgroundColor: colorBackground }];
    if (!colorBackground) {
      styles.push(localStyle.btn);
    } else {
      styles.push(localStyle.btnPrimary);
    }
    return (
      <View style={{ alignItems: 'center' }}>
        <Button style={styles} onPress={action} disabled={disabled}>
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

  const DataTableTitleWidget = (
    title: string,
    flex?: any,
    justifyContent?: any,
  ) => {
    return (
      <DataTable.Title style={{ flex: flex, justifyContent: justifyContent }}>
        <Text style={[localStyle.dataTableTitle]}>{title}</Text>
      </DataTable.Title>
    );
  };

  const buildStampDateTime = (type: 'start' | 'end', index: number) => {
    const timeOperationWorkerDetail = timeOperationWorker.details;
    // console.log("timeOperationWorkerDetail =>>> ", timeOperationWorkerDetail);
    const currentTime = moment().locale('th').add(543, 'year').format('HH:mm');

    let currentDate = moment();
    const details = timeOperationWorkerDetail[index];
    const change = {
      standardTime: timeOperationWorker.standardTime,
      startDate: timeOperationWorker.startDate,
      endDate: timeOperationWorker.endDate,
      details: null,
      travelCharge: timeOperationWorker.travelCharge,
    };
    if (type === 'start') {
      if (
        timeOperationWorker.startDate === null ||
        timeOperationWorker.startDate === ''
      ) {
        change.startDate = currentDate;
      }
      timeOperationWorkerDetail[index] = {
        ...details,
        startTime: currentTime,
        startDate: currentDate,
        index: index,
      };

      // console.info(timeOperationWorkerDetail[index])
      _storeData({
        key: 'startTimeTemp' + orderId,
        value: {
          orderId: orderId,
          details: timeOperationWorkerDetail,
          startDate: currentDate,
          totalTime: convertDateTimeDeff(details.startDate, moment())
        }
      });

    } else if ((type = 'end')) {
      change.endDate = currentDate;
      timeOperationWorkerDetail[index] = {
        ...details,
        endTime: currentTime,
        endDate: currentDate,
        // startDate: currentDate,
        totalTime: convertDateTimeDeff(details.startDate, moment()),
      };
    }

    change.details = timeOperationWorkerDetail;
    console.log('change', change);
    setTimeOperationWorker(change);
    setUpdated(true);
  };

  const TimeWindowsTable = () => (
    <View style={styles.container}>
      <Grid>
        <Row
          style={[
            styles.cell,
            { backgroundColor: COLOR.primary, height: 'auto', padding: 3 },
          ]}>
          <Col style={{ width: wp('20') }}>
            <Text style={[{ alignSelf: 'center' }, styles.dataTableTitle]}>
              รายละเอียด
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('10') }}>
            <Text style={[{ alignSelf: 'center' }, styles.dataTableTitle]}>
              เริ่ม
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('15') }}>
            <Text style={[{ alignSelf: 'center' }, styles.dataTableTitle]}>
              เสร็จสิ้น
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('8') }}>
            <Text style={[{ alignSelf: 'center' }, styles.dataTableTitle]}>
              นาที
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center' }}>
            <Text style={[{ alignSelf: 'center' }, styles.dataTableTitle]}>
              ประเภทกิจกรรม
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('12') }}>
            <Text style={[{ alignSelf: 'center' }, styles.dataTableTitle]}>
              พนักงาน
            </Text>
          </Col>
        </Row>
        {timeOperationWorker?.details?.map(
          (valItem: TimeOperationWorkerInterface, index: any) => {
            return (
              <Row style={[styles.cell, { marginTop: 2 }]}>
                <Col style={{ width: wp('20') }}>
                  <Text style={[styles.text1, { alignSelf: 'flex-start', marginLeft: 10 }]}>
                    {valItem.description}
                  </Text>
                </Col>
                <Col
                  style={{
                    justifyContent: 'center',
                    width: wp('10'),
                  }}>
                  <View>
                    {valItem.startTime != null ? (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (props.workOrderData.webStatus !== '4') {
                            Alert.alert(
                              'แจ้งเตือน',
                              'ต้องการแก้ไขเวลาเริ่มปฏิบัติงานใช่หรือไม่ ?',
                              [
                                {
                                  text: 'ยกเลิก',
                                  style: 'cancel',
                                },
                                {
                                  text: 'ตกลง',
                                  onPress: () => {
                                    buildStampDateTime('start', index);
                                  },
                                },
                              ],
                            );
                          }
                        }}>
                        <Text
                          style={[styles.text1, {
                            alignSelf: 'center',
                            alignItems: 'center',
                            color: COLOR.primary,
                            fontFamily: Fonts.Prompt_Medium,
                          }]}>
                          {valItem.startTime}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          buildStampDateTime('start', index);
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: screenInfo.width <= 500 ? 30 : 60,
                              height: 30,
                              backgroundColor: COLOR.primary,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              borderRadius: 4,
                            }}>
                            <View>
                              <Text
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginTop: 5,
                                  fontFamily: Fonts.Prompt_Medium,
                                  color: COLOR.white,
                                }}>
                                เริ่ม
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </Col>
                <Col style={[{ justifyContent: 'center', width: wp('15') }]}>
                  <View>
                    {valItem.endTime != null ? (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (props.workOrderData.webStatus !== '4') {
                            Alert.alert(
                              'แจ้งเตือน',
                              'ต้องการแก้ไขเวลาเสร็จสิ้นงานใช่หรือไม่ ?',
                              [
                                {
                                  text: 'ยกเลิก',
                                  style: 'cancel',
                                },
                                {
                                  text: 'ตกลง',
                                  onPress: () => {
                                    buildStampDateTime('end', index);
                                    setWorkTimeLeft('');
                                  },
                                },
                              ],
                            );
                          }
                        }}>
                        <Text
                          style={[styles.text1, {
                            alignSelf: 'center',
                            alignItems: 'center',
                            color: COLOR.primary,
                            fontFamily: Fonts.Prompt_Medium,
                          }]}>
                          {valItem.endTime}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          buildStampDateTime('end', index);
                          setWorkTimeLeft('');
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: screenInfo.width <= 500 ? 45 : 60,
                              height: 30,
                              backgroundColor: COLOR.error,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              borderRadius: 4,
                            }}>
                            <View>
                              <Text
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginTop: 5,
                                  fontFamily: Fonts.Prompt_Medium,
                                  color: COLOR.white,
                                }}>
                                เสร็จ
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </Col>
                <Col style={{ justifyContent: 'center', width: wp('8') }}>
                  <Text style={{ alignSelf: 'center' }}>
                    {convertTimeDiff(valItem.startTime, valItem.endTime) ??
                      '100'}
                  </Text>
                </Col>
                <Col style={{ justifyContent: 'center' }}>
                  <View style={{ alignItems: 'center' }}>
                    {BuildDropDownSelect(
                      index,
                      `${valItem.acttype}:${valItem.description}`,
                    )}
                  </View>
                </Col>
                <Col style={{ justifyContent: 'center', width: wp('10') }}>
                  <View>
                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      activeOpacity={0.9}
                      onPress={() => {
                        if (props.workOrderData.webStatus !== '4') {
                          setStateVisibleModal(true);
                          const operator = selectOperators;
                          const _operatorMaster = operatorMaster.map(oper => {
                            return {
                              ...oper,
                              checked: false,
                            };
                          });
                          if (operator[index].keyVal) {
                            const operatorVal = operator[index]
                              .keyVal as DropdownSelectMultipleItemProps[];
                            for (const [
                              operKey,
                              operValue,
                            ] of operatorVal.entries()) {
                              const getOperMasterIdx =
                                _operatorMaster.findIndex(
                                  oper => oper.value === operValue.value,
                                );
                              _operatorMaster[getOperMasterIdx] = {
                                ..._operatorMaster[getOperMasterIdx],
                                checked: true,
                              };
                            }
                            const _operatorMasterSort = _operatorMaster.sort(
                              (a: any, b: any) => b.checked - a.checked,
                            );
                            setEmployees(_operatorMasterSort);
                            setCurrentActiveEmployees(_operatorMasterSort);
                            setCurrentActiveMasterEmployees(
                              _operatorMasterSort,
                            );
                          }
                          setSelectsEmployeeIndex(index);
                        }
                      }}>
                      <View
                        style={{
                          height: 30,
                          backgroundColor: COLOR.primary,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          borderRadius: 4,
                        }}>
                        <View>
                          <Text
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: 5,
                              fontFamily: Fonts.Prompt_Medium,
                              color: COLOR.white,
                            }}>
                            ช่าง
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Col>
              </Row>
            );
          },
        )}
      </Grid>
    </View>
  );

  const renderItem = ({ item, index }: any) => {
    return item;
  };

  const BuildDropDownSelect = (index: any, labelText: any) => {
    let dataSelect = '';
    if (indexSelectType != undefined) {
      dataSelect = timeOperationWorker.details[indexSelectType].acttype;
    }

    let listItem: any = [];
    if (itemsOrderCode && itemsOrderCode?.length > 0) {
      itemsOrderCode?.forEach((val, index) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              timeOperationWorker.details[indexSelectType] = {
                ...timeOperationWorker.details[indexSelectType],
                ...{ acttype: val.value, description: val.label },
              };
              setTimeOperationWorker({ ...timeOperationWorker });
              hideModal();
            }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 4,
                height: 44,
                marginTop: 8,
                backgroundColor: '#F9F9F9',
                borderRadius: 10,
              }}
              key={index}>
              <View style={{ flex: 0.2 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: 18,
                      marginTop: 4,
                    },
                  ]}>
                  {val?.label}
                </Text>
              </View>
            </View>
          </TouchableOpacity>,
        );
      });
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            width: wp('30%'),
            height: 32,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 10,
          }}
          onPress={() => {
            if (props.workOrderData.webStatus !== '4') {
              setIndexSelectType(index);
              showModal();
            }
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: 14,
                      color: COLOR.white,
                      marginTop: -6,
                    },
                  ]}>
                  {labelText.substring(0, 24 - 3) + '...'}
                </Text>
              </View>
            </View>
            <View style={{ flex: 0.4 }}>
              <View style={{ paddingTop: 6 }}>
                <Icon
                  key={'down-icon'}
                  name={'down'}
                  size={12}
                  color={'#FFFFFF'}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: 690, height: 580, borderRadius: 15 }}
            visible={visibleSelect}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => hideModal()}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: 40, paddingRight: 40 }}>
                <RadioButton.Group
                  onValueChange={newValue => { }}
                  value={dataSelect}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItem}
                      keyExtractor={(item, index) =>
                        `dropdown-select-list-${index}`
                      }
                    />
                  </SafeAreaView>
                </RadioButton.Group>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  };

  const renderItemEmployees = ({ item, index }: any) => {
    return item;
  };

  const buildDataSelector = (val: DropdownSelectMultipleItemProps) => {
    let updateEmployees = [...currentActiveEmployees];
    const getIdx = updateEmployees.findIndex(emp => emp.value === val.value);
    updateEmployees[getIdx] = {
      ...updateEmployees[getIdx],
      checked: !val.checked,
    };
    setCurrentActiveEmployees(updateEmployees);

    let updateMasterEmployees = [...currentActiveMasterEmployees];
    const getMasterIdx = updateMasterEmployees.findIndex(
      emp => emp.value === val.value,
    );
    updateMasterEmployees[getMasterIdx] = {
      ...updateMasterEmployees[getMasterIdx],
      checked: !val.checked,
    };
    setCurrentActiveMasterEmployees(updateMasterEmployees);

    let updateEmployee = [...employees];
    updateEmployee[getMasterIdx] = {
      ...updateEmployee[getMasterIdx],
      checked: !val.checked,
    };
    setEmployees(updateEmployee);
    setUpdated(true);
  };

  const BuildModalDrawer = () => {
    let newEmployees = currentActiveEmployees.map(
      (val: DropdownSelectMultipleItemProps, index: any) => {
        return (
          <TouchableOpacity
            onPress={() => buildDataSelector(val)}
            key={`${val.value}-${index}`}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 8,
                padding: 10,
                backgroundColor: '#F9F9F9',
                borderRadius: 50,
              }}
              key={index}>
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.3 }}>
                <Checkbox
                  key={`checkbox-${index}`}
                  status={val.checked ? 'checked' : 'unchecked'}
                />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Light,
                    marginTop: 8,
                    fontSize: 16,
                  }}>
                  {val?.label}
                </Text>
              </View>
              <View>
                {val.checked && (
                  <Icon
                    name="check-circle"
                    size={30}
                    style={{
                      color: COLOR.primary,
                    }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      },
    );
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modalWidth]}
        visible={visibleModal}>
        <View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => setStateVisibleModal(false)}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 40,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.secondary_primary_color,
              }}>
              ช่างปฏิบัติงาน
            </Text>
          </View>
          <View>
            <TextInput
              style={[styleSheet.input, { height: 52, borderRadius: 10 }]}
              placeholderTextColor={'#FFFFFF'}
              placeholder="Search"
              onChangeText={textSearch => {
                if (textSearch.length > 0) {
                  const filtered = currentActiveMasterEmployees.filter(
                    emp =>
                      emp.label.includes(textSearch) ||
                      emp.value.includes(textSearch),
                  );
                  setCurrentActiveEmployees(filtered);
                } else {
                  setCurrentActiveEmployees(currentActiveMasterEmployees);
                }
              }}
            />
          </View>
          <View style={{ padding: screenInfo.width > 500 ? 20 : 5, maxHeight: screenInfo.width > 500 ? 750 : '70%' }}>
            <FlatList
              data={newEmployees}
              initialNumToRender={10}
              renderItem={renderItemEmployees}
              keyExtractor={(item, index) => `dropdown-select-list-${index}`}
            />
          </View>
          <View style={{ marginTop: -10 }}>
            {ButtonWidget(
              'ตกลง',
              () => {
                const getChecked = employees.filter(emp => emp.checked);
                const updateOperator = selectOperators;
                updateOperator[selectsEmployeeIndex] = {
                  ...updateOperator[selectsEmployeeIndex],
                  keyVal: getChecked,
                };
                setSelectOperators(updateOperator);
                setStateVisibleModal(false);
              },
              COLOR.primary,
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const WorkDetails = () => {
    return (
      <View
        style={[styles.workDetialsView]}>
        <View>
          <Text style={[styles.text1, { padding: 3, fontFamily: Fonts.Prompt_Medium }]}>
            รายละเอียดการทำงาน
          </Text>
        </View>
        <View>{TimeWindowsTable()}</View>
      </View>
    );
  };

  const ChargeTravelExpenses = () => {
    return (
      <View
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          marginTop: 20,
          borderColor: 'red',
        }}>
        <View>
          <Text style={[styles.h1, { fontFamily: Fonts.Prompt_Medium }]}>
            คิดค่าใช้จ่ายในการเดินทาง
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Checkbox
              status={checkedTravelExpenses ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheckedTravelExpenses(!checkedTravelExpenses);
              }}
            />
            <Text
              style={[styles.h1, {
                marginTop: 6,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
              }]}>
              คิดค่าเดินทาง
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const Contents = () => {
    return (
      <ScrollView style={{ height: '100%' }}>
        <View
          style={[styles.scrollViewMain]}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  alignItems: 'center',
                  width: '100%',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    width: 160,
                    borderBottomColor: COLOR.secondary_primary_color,
                    borderBottomWidth: 2,
                  }}>
                  <Text
                    style={{
                      fontSize: 48,
                      fontFamily: Fonts.Prompt_Medium,
                      color: COLOR.secondary_primary_color,
                    }}>
                    {timeOperationWorker?.startDate != null
                      ? moment(timeOperationWorker?.startDate)
                        .locale('th')
                        .add(543, 'year')
                        .format('HH:mm')
                      : times}
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 12,
                    fontSize: 26,
                    fontFamily: Fonts.Prompt_Medium,
                    color: COLOR.secondary_primary_color,
                  }}>
                  เวลาปฏิบัติงานในร้านค้า
                </Text>
              </View>
              <View>
                <Text
                  style={[styles.title]}>
                  {timeOperationWorker?.startDate != null
                    ? moment(timeOperationWorker?.startDate)
                      .locale('th')
                      .add(543, 'year')
                      .format('DD/MM/YYYY')
                    : lastDateActive.format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <TimeWorkingComponent
            orderId={orderId}
            standardTime={timeOperationWorker?.standardTime}
            startDate={timeOperationWorker?.startDate}
            endDate={
              timeOperationWorker?.details.find(
                (timeOper: any) => timeOper.endDate !== null,
              )
                ? timeOperationWorker?.endDate
                : null
            }
            startTime={timeOperationWorker?.startDate}
            endTime={
              timeOperationWorker?.details.reduce(
                (a: any, b: any) => {
                  return a.endDate && new Date(a.endDate) > new Date(b.endDate)
                    ? a
                    : b;
                },
                { endDate: null },
              ).endDate
            }
            workTimeLeft={workTimeLeft}
            onValueChange={(val: any) => { }}
          />
        </View>

        <View style={{ marginTop: 20 }}>{DrawHorizontalWidget()}</View>
        <View>{WorkDetails()}</View>
        {BuildModalDrawer()}
        <View style={{ marginTop: 60 }}>{DrawHorizontalWidget()}</View>
        {notShowChargeTravel(props.workOrderData.type) &&
          ChargeTravelExpenses()}
        {props.workOrderData.webStatus !== '4' && (
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <View style={{ width: 300, marginTop: screenInfo.width <= 500 ? 5 : 40 }}>
              {ButtonWidget(
                'บันทึก',
                () => _submitData(),
                COLOR.secondary_primary_color,
              )}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <View style={styleSheet.container_bg}>
        <Image style={styleSheet.backgroundImage} source={background} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%'
          }}>
          <View>
            {/* <AppBar
                title=""
                rightTitle={`Order: ${orderId}`}
                onBackReload={true}
              //replacePath={ROUTE.WORKORDERLIST}
              //pageValueChange={updated} ////2023
              ></AppBar> */}
            {screenInfo.width > 500 && <AppBar title="เวลาปฏิบัติงาน (ในร้านค้า)" rightTitle={`Order: ${orderId}`}></AppBar>}
            {screenInfo.width <= 500 && <AppBar title={`เวลาปฏิบัติงาน ${orderId}`}></AppBar>}
            <Animated.ScrollView>{Contents()}</Animated.ScrollView>
          </View>
        </View>
      </View>
      <Loading loading={isLoading} />
    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     width: wp('90%'),
//   },
//   cell: {
//     borderWidth: 1,
//     borderColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

export default WorkOrderDetailsWorkPage;
