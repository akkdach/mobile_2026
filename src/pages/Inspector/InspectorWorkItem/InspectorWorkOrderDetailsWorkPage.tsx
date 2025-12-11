import { Button, Icon, Modal } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Checkbox, DataTable, RadioButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import AppBar from '../../../components/AppBar';
import { DropdownSelectMultipleItemProps } from '../../../components/DropdownSelectMultiple';
import Loading from '../../../components/loading';
import styleSheet from '../../../components/StyleSheet';
import TimeWorkingComponent from '../../../components/TimeWorkingComponent';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { notShowChargeTravel } from '../../../constants/Menu';
import { LoginResponseInterface } from '../../../models/login';
import { MasterWorkOrderWorker } from '../../../models/master_worker';
import { TimeOperationWorkerInterface } from '../../../models/timeOperationWorker';
import { TimeOperationWorker } from '../../../models/time_operation_worker';
import {
  getMasterActivityTypeMas,
  getMasterWorkOrderWorker,
  getTimeOperationWorker,
  postTimeOperationWorker,
} from '../../../services/operating_time_shop_service';
import { getUser } from '../../../utils/helper';
import {styleLg,styleSm} from './InspectorWorkOrderDetailsWorkPageCss';
const background = require('../../../../assets/images/bg.png');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { getTimeOperationWorkerInspector, postTimeOperationWorkerInspector } from '../../../services/visitInspector';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  workCenter: string;
  orderTypeDescription: string;
  webStatus: string;
  workType: string;
};

type InterfaceStorageStartTime = {
  startTime?: any;
  standTime?: any;
  startDate?: any;
  endTime?: any;
  endDateTime?: any;
};
const InspectorWorkOrderDetailsWorkPage = (props) => {
  const params = props.route?.params as { workOrderData: InterfaceProps };
  const [isLoading, setIsLoading] = useState(false);
  const [workTimeLeft, setWorkTimeLeft] = useState<any>();
  const { orderId, workType } = props.route?.params?.workOrderData;
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [lastDateActive, setLastDateActive] = useState<moment.Moment>(
    moment().locale('th').add(543, 'year'),
  );
  const [times, setTime] = useState<any>('00:00');
  const [timeOperationWorker, setTimeOperationWorker] = useState<any>();
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([]);
  const [checkedTravelExpenses, setCheckedTravelExpenses] =
    React.useState(false);
  const [selectsEmployeeArr, setValueSelectsEmployeeArr] = useState<any>();
  const [selectsEmployeeArrClone, setValueSelectsEmployeeArrClone] =
    useState<any>();
  const [selectsEmployeeIndex, setSelectsEmployeeIndex] = useState<any>();
  const [visibleSelect, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [indexSelectType, setIndexSelectType] = useState<any>();
  const [startWork, setStartWork] = useState<any>();

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [localStyle, setStyles] = useState<any>({});
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, [screenInfo]);

  useEffect(() => {
    let interval: any;
    interval = setInterval(() => {
      const timesCurrent = moment()
        .locale('th')
        .add(543, 'year')
        .format('HH:mm');
      setTime(`${timesCurrent}`);
    }, 1000);
    _getMasterActivityTypeMas();
    _getTimeOperationWorker();

    return () => {
      clearInterval(interval), clearInterval(startWork);
    };
  }, []);

  const getUniqueListBy = (arr: any[], key: string) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  };

  const convertTimeDiff = (startTime: any, endTime: any) => {
    if (startTime != null && endTime != null) {
      return moment(endTime, 'HH:mm').diff(
        moment(startTime, 'HH:mm'),
        'minutes',
      );
    }
    return '0';
  };

  const convertDateTimeDeff = (startDate: any, endDate: any) => {
    if (startDate && endDate) {
      let startTime = moment(startDate);
      const endTime = moment(endDate);
      const timeDiff = endTime.diff(startTime, 'minutes');
      return timeDiff;
    }
    return 0;
  };

  const _getTimeOperationWorker = async () => {
    try {
      let response: TimeOperationWorker = await getTimeOperationWorkerInspector(orderId, workType);
      console.log('response =========>', JSON.stringify(response, null, 2))
      setCheckedTravelExpenses(response.travelCharge);
      let selectsEmployees: DropdownSelectMultipleItemProps[] =
        await _getMasterWorkOrderWorker();
      response.details.forEach(async val => {
        let employeeSelect: any = [];
        selectsEmployees.map(empItem => {
          let data = val.presonnel.filter(
            v => v.personnalNumber == empItem.value,
          )[0];
          if (data) {
            employeeSelect.unshift({
              label: data.personnalName,
              value: data.personnalNumber,
              checked: true,
            });
          } else {
            employeeSelect.push({
              label: empItem.label,
              value: empItem.value,
              checked: false,
            });
          }
        });
        let checked = employeeSelect.some((item: any) => item.checked === true);
        if (!checked) {
          let newEmployeeSelect: any[] = [];
          const user: LoginResponseInterface = await getUser();
          employeeSelect.map((item: any) => {
            if (item.value === user.employeeId) {
              newEmployeeSelect.unshift({ ...item, ...{ checked: true } });
            } else {
              newEmployeeSelect.push({ ...item, ...{ checked: false } });
            }
          });
          employeeSelect = newEmployeeSelect;
        }

        val.presonnel = getUniqueListBy(employeeSelect, 'value');
      });
      _onCheckStartEndWorkUpdate(response);
      // console.log('[=========++>>>]', JSON.stringify(response, null, 2))
      setTimeOperationWorker(response);
    } catch (error) {
      console.log('error===>', error);
    }
  };

  const _onCheckStartEndWorkUpdate = (data: any) => {
    if (Number(data.standardTime > 0)) {
      if (data.startDate != null && data.endDate === null) {
        let standTime = moment(data.startDate).add(
          data.standardTime,
          'minutes',
        );
        let interval = 1000;
        let myInterval = setInterval(() => {
          const startTime = moment();
          const timeDiff = standTime.diff(startTime);
          setWorkTimeLeft(moment.utc(timeDiff).format('HH:mm:ss'));
        }, interval);
        setStartWork(myInterval);
      }
    }
  };

  const _onCheckStartWork = async (data?: InterfaceStorageStartTime) => {
    if (Number(timeOperationWorker.standardTime > 0)) {
      let standTime = moment().add(timeOperationWorker.standardTime, 'minutes');
      let interval = 1000;
      let myInterval = setInterval(() => {
        const startTime = moment();
        const timeDiff = standTime.diff(startTime);
        setWorkTimeLeft(moment.utc(timeDiff).format('HH:mm:ss'));
      }, interval);
      setStartWork(myInterval);
    }
  };

  const onChangeSubmit = (cloneData: any) => {
    cloneData.travelCharge = checkedTravelExpenses;
    cloneData.details.map((val: any) => {
      let presonnel: any = [];
      val.presonnel.map((item: any) => {
        if (item.checked) {
          presonnel.push({
            personnalNumber: item.value,
            personnalName: item.label,
          });
        }
      });

      val.presonnel = getUniqueListBy(presonnel, 'personnalNumber');
    });
    _postTimeOperationWorkerChange({ ...cloneData, ...{ workOrder: orderId, workType } });
  };

  const _postTimeOperationWorkerChange = async (data: any) => {
    await postTimeOperationWorkerInspector(data)
    await _getTimeOperationWorker();
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
          if (
            timeOperationWorker.startDate != null &&
            timeOperationWorker.startDate != '' &&
            timeOperationWorker.endDate != null &&
            timeOperationWorker.endDate != ''
          ) {
            timeOperationWorker.travelCharge = checkedTravelExpenses;
            delete timeOperationWorker['standardTime'];

            timeOperationWorker.details.map((val: any) => {
              let presonnel: any = [];
              val.presonnel.map((item: any) => {
                if (item.checked) {
                  presonnel.push({
                    personnalNumber: item.value,
                    personnalName: item.label,
                  });
                }
              });
              val.presonnel = getUniqueListBy(presonnel, 'personnalNumber');
            });
            _postTimeOperationWorker({
              ...timeOperationWorker,
              ...{ workOrder: orderId },
            });
          } else {
            Alert.alert(
              'แจ้งเตือน',
              'กรุณากดเริ่ม และ เสร็จสิ้นการปฏิบัติงานก่อนบันทึก',
              [
                {
                  text: 'ตกลง',
                },
              ],
            );
          }
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

  const _getMasterWorkOrderWorker = async () => {
    let response = await getMasterWorkOrderWorker(orderId);
    let employees: any = [];
    if (response) {
      response.map((val: MasterWorkOrderWorker, index: any) => {
        employees.push({ label: val.personnelName, value: val.personnelNumber });
      });
      return employees;
    }
  };

  const _postTimeOperationWorker = async (data: any) => {
    try {
      setIsLoading(true);
      let checkPresonnel = true;
      for (let index = 0; index < data.details.length; index++) {
        if (data.details[index].presonnel.length === 0) {
          Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลช่างผู้ปฎิบัติงานให้ครบถ้วน', [
            { text: 'ปิด' },
          ]);
          checkPresonnel = false
          break;
        }
      }
      if (checkPresonnel) {
        let response = await postTimeOperationWorkerInspector(data, true);
        if (response.isSuccess) {
          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
            { text: 'ปิด', onPress: () => {
              // Actions.pop();
              navigation.dispatch(StackActions.pop());
            } },
          ]);
        } else {
          Alert.alert('แจ้งเตือน', response.message, [
            { text: 'ปิด', onPress: () => {
              // Actions.pop();
              navigation.dispatch(StackActions.pop());
            } },
          ]);
        }
      }
    } catch (error) {
      Alert.alert('แจ้งเตือน', `${error}`, [
        { text: 'ปิด' },
      ]);
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

  const TimeWindowsTable = () => (
    <View style={styles.container}>
      <Grid>
        <Row
          style={[
            styles.cell,
            { backgroundColor: COLOR.primary, height: wp('4') },
          ]}>
          <Col style={{ width: wp('20') }}>
            <Text style={[{ alignSelf: 'center' }, localStyle.dataTableTitle]}>
              รายละเอียด
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('10') }}>
            <Text style={[{ alignSelf: 'center' }, localStyle.dataTableTitle]}>
              เริ่ม
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('10') }}>
            <Text style={[{ alignSelf: 'center' }, localStyle.dataTableTitle]}>
              เสร็จสิ้น
            </Text>
          </Col>
          <Col style={{ justifyContent: 'center', width: wp('8') }}>
            <Text style={[{ alignSelf: 'center' }, localStyle.dataTableTitle]}>
              นาที
            </Text>
          </Col>
          {/* <Col style={{ justifyContent: 'center' }}>
            <Text style={[{ alignSelf: 'center' }, localStyle.dataTableTitle]}>
              ประเภทกิจกรรม
            </Text>
          </Col> */}
          <Col style={{ justifyContent: 'center'}}>
            <Text style={[{ alignSelf: 'center' }, localStyle.dataTableTitle]}>
              พนักงาน
            </Text>
          </Col>
        </Row>
        {timeOperationWorker?.details?.map(
          (valItem: TimeOperationWorkerInterface, index: any) => {
            return (
              <Row style={[styles.cell, { marginTop: 2 }]}>
                <Col style={{ width: wp('20') }}>
                  <Text style={{ alignSelf: 'flex-start', marginLeft: 10 , fontSize : screenInfo.width > 500 ? 16 : 10}}>
                    {valItem.description}
                  </Text>
                </Col>
                <Col
                  style={{
                    justifyContent: 'center',
                    width: wp('10%'),
                  }}>
                  <View>
                    {valItem.startTime != null ? (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (params.workOrderData.webStatus !== '4') {
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
                                    const cloneData = { ...timeOperationWorker };
                                    const dataObj = {
                                      ...cloneData?.details[index],
                                      ...{
                                        startTime: moment()
                                          .locale('th')
                                          .add(543, 'year')
                                          .format('HH:mm'),
                                        startDate: moment(),
                                      },
                                    };
                                    cloneData.details.splice(index, 1, dataObj);
                                    if (
                                      timeOperationWorker.startDate === null ||
                                      timeOperationWorker.startDate === ''
                                    ) {
                                      Object.assign(cloneData, {
                                        startDate: moment(),
                                      });
                                    }
                                    onChangeSubmit(cloneData);
                                    setTimeOperationWorker({
                                      ...{ ...timeOperationWorker, ...cloneData },
                                    });
                                    _onCheckStartWork();
                                  },
                                },
                              ],
                            );
                          }
                        }}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            alignItems: 'center',
                            color: COLOR.primary,
                            fontFamily: Fonts.Prompt_Medium,
                          }}>
                          {valItem.startTime}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          const cloneData = { ...timeOperationWorker };
                          const dataObj = {
                            ...cloneData?.details[index],
                            ...{
                              startTime: moment()
                                .locale('th')
                                .add(543, 'year')
                                .format('HH:mm'),
                              startDate: moment(),
                            },
                          };
                          cloneData?.details.splice(index, 1, dataObj);
                          if (
                            timeOperationWorker.startDate === null ||
                            timeOperationWorker.startDate === ''
                          ) {
                            Object.assign(cloneData, { startDate: moment() });
                          }
                          onChangeSubmit(cloneData);
                          setTimeOperationWorker({
                            ...{ ...timeOperationWorker, ...cloneData },
                          });
                          _onCheckStartWork();
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: screenInfo.width > 500 ? 60 : 30 ,
                              height: screenInfo.width > 500 ? 30 : 25 ,
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
                                  fontSize : screenInfo.width > 500 ? 16 : 10,
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
                <Col style={{ justifyContent: 'center', width: wp('10%') }}>
                  <View>
                    {valItem.endTime != null ? (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (params.workOrderData.webStatus !== '4') {
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
                                    const cloneData = { ...timeOperationWorker };
                                    const dataObj = {
                                      ...cloneData?.details[index],
                                      ...{
                                        endTime: moment()
                                          .locale('th')
                                          .add(543, 'year')
                                          .format('HH:mm'),
                                        endDate: moment(),
                                        totalTime: String(
                                          convertDateTimeDeff(
                                            cloneData?.details[index].startDate,
                                            moment(),
                                          ),
                                        ),
                                      },
                                    };
                                    cloneData?.details.splice(
                                      index,
                                      1,
                                      dataObj,
                                    );
                                    Object.assign(cloneData, {
                                      endDate: moment(),
                                    });
                                    onChangeSubmit(cloneData);
                                    setWorkTimeLeft('');
                                    setTimeOperationWorker({ ...cloneData });
                                  },
                                },
                              ],
                            );
                          }
                        }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                            color: COLOR.primary,
                            fontFamily: Fonts.Prompt_Medium,
                          }}>
                          {valItem.endTime}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => {
                          const cloneData = { ...timeOperationWorker };
                          const dataObj = {
                            ...cloneData?.details[index],
                            ...{
                              endTime: moment()
                                .locale('th')
                                .add(543, 'year')
                                .format('HH:mm'),
                              endDate: moment(),
                              totalTime: String(
                                convertDateTimeDeff(
                                  cloneData?.details[index].startDate,
                                  moment(),
                                ),
                              ),
                            },
                          };
                          cloneData?.details.splice(index, 1, dataObj);
                          Object.assign(cloneData, { endDate: moment() });
                          if (
                            cloneData.details.some(
                              (val: any) => val.endDate != null,
                            )
                          ) {
                            clearInterval(startWork);
                          }

                          onChangeSubmit(cloneData);
                          setWorkTimeLeft('');
                          setTimeOperationWorker({ ...cloneData });
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              width: screenInfo.width > 500 ? 60 : 30 ,
                              height: screenInfo.width > 500 ? 30 : 25 ,
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
                                  fontFamily:  Fonts.Prompt_Medium,
                                  fontSize : screenInfo.width > 500 ? 16 : 10,
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
                  <Text style={{ alignSelf: 'center' ,fontSize: screenInfo.width > 500 ? 16 : 10 }}>
                    {convertTimeDiff(valItem.startTime, valItem.endTime) ??
                      '100'}
                  </Text>
                </Col>
                {/* <Col style={{ justifyContent: 'center' }}>
                  <View style={{ alignItems: 'center' }}>
                    {BuildDropDownSelect(
                      index,
                      `${valItem.acttype}:${valItem.description}`,
                    )}
                  </View>
                </Col> */}
                <Col style={{ justifyContent: 'center' }}>
                  <View>
                    <TouchableOpacity
                      style={{ justifyContent: 'center' }}
                      activeOpacity={0.9}
                      onPress={() => {
                        if (params.workOrderData.webStatus !== '4') {
                          setStateVisibleModal(true);
                          setValueSelectsEmployeeArr(valItem.presonnel);
                          setValueSelectsEmployeeArrClone(valItem.presonnel);
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
                              marginTop: screenInfo.width > 500 ? 5 : 8,
                              fontFamily: Fonts.Prompt_Medium,
                              fontSize : screenInfo.width > 500 ? 16 : 10,
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
            width: screenInfo.width > 500 ? wp('30%') : '98%',
            height: 32,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 10,
          }}
          onPress={() => {
            if (params.workOrderData.webStatus !== '4') {
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
            style={{ borderRadius: 15, width: dimensions.width - 50 }}
            visible={visibleSelect}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => hideModal()}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ maxHeight: dimensions.height / 1.5 }}>
                <RadioButton.Group
                  onValueChange={newValue => { }}
                  value={dataSelect}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItem}
                      keyExtractor={(item, index) =>
                        `dropdown-select-list-${index}`
                      }
                    />
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

  const BuildModalDrawer = () => {
    if (selectsEmployeeArr) {
      const onSubmitSearch = () => {
        setStateVisibleModal(false);
      };

      const onValueChange = (
        data: DropdownSelectMultipleItemProps,
        index: any,
      ) => {
        selectsEmployeeArr[index] = data;
        let dateClone = selectsEmployeeArrClone.filter(
          (v: any) => v.value != data.value,
        );
        let dataSelect = [...selectsEmployeeArr, ...dateClone];
        timeOperationWorker.details[selectsEmployeeIndex].presonnel =
          dataSelect;
        setTimeOperationWorker({ ...timeOperationWorker });
      };
      let listMasterEmployees: any = [];
      if (selectsEmployeeArr != undefined) {
        selectsEmployeeArr.map(
          (val: DropdownSelectMultipleItemProps, index: any) => {
            listMasterEmployees.push(
              <TouchableOpacity
                onPress={() => {
                  onValueChange({ ...val, ...{ checked: !val.checked } }, index);
                }}
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
                  <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                    <Checkbox
                      key={`checkbox-${index}`}
                      status={
                        selectsEmployeeArr[index].checked
                          ? 'checked'
                          : 'unchecked'
                      }
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: screenInfo.width > 500 ? 8 : 10,
                        fontSize: screenInfo.width > 500 ?  16 : 12,
                      }}>
                      {val?.label}
                    </Text>
                  </View>
                  <View>
                    {selectsEmployeeArr[index].checked && (
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
              </TouchableOpacity>,
            );
          },
        );
      }

      return (
        <Modal
          transparent
          maskClosable
          style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, maxHeight: screenInfo.width > 500 ? 980 : '100%', borderRadius: 15 }}
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
                paddingLeft: screenInfo.width > 500 ?  40 : 0, 
                paddingRight: screenInfo.width > 500 ? 40 : 0,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: screenInfo.width > 500 ? 20 : 16,
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
                  const selectsEmployeeClone = [...selectsEmployeeArrClone];
                  let data = selectsEmployeeClone.filter((item: any) =>
                    item?.label?.includes(textSearch),
                  );
                  if (data) {
                    setValueSelectsEmployeeArr(data);
                  } else {
                    setValueSelectsEmployeeArr({ ...selectsEmployeeArrClone });
                  }
                }}
              />
            </View>
            <View style={{ padding: screenInfo.width ? 20 :0, maxHeight: screenInfo.width > 500 ? 750 : 500 }}>
              
              <FlatList
                data={listMasterEmployees}
                initialNumToRender={10}
                renderItem={renderItemEmployees}
                keyExtractor={(item, index) => `dropdown-select-list-${index}`}
              />

            </View>
            <View>
            {ButtonWidget(
                'ตกลง',
                () => {
                  onSubmitSearch();
                },
                COLOR.primary,
              )}
            </View>
            {/* <View style={{ height: 50}}>
            </View> */}
          </View>
        </Modal>
      );
    }
  };

  const WorkDetails = () => {
    return (
      <View
        style={{
          paddingLeft: screenInfo.width > 500 ? 40 : 5 ,
          paddingRight: screenInfo.width > 500 ? 40 : 5 ,
          marginTop: 20,
          borderColor: 'red'
        }}>
        <View>
          <Text style={{ fontSize: screenInfo.width > 500 ? 26 : 16 , fontFamily: Fonts.Prompt_Medium }}>
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
          <Text style={{ fontSize: 26, fontFamily: Fonts.Prompt_Medium }}>
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
              style={{
                marginTop: 6,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 16,
              }}>
              คิดค่าเดินทาง
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const Contents = () => {
    return (
      <ScrollView style={{ height: 1140 }}>
        <View
          style={[
            {
              paddingLeft: 10,
              paddingRight: 10,
              marginTop: '10%',
              width: '100%',
            },
          ]}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  alignItems: 'center',
                  width: 'auto',
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
                      fontSize: screenInfo.width > 500 ? 48 : 28 ,
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
                    fontSize: screenInfo.width > 500 ? 26 : 16 ,
                    fontFamily: Fonts.Prompt_Medium,
                    color: COLOR.secondary_primary_color,
                  }}>
                  เวลาปฏิบัติงานในร้านค้า
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: screenInfo.width > 500 ? 26 : 16 ,
                    fontFamily: Fonts.Prompt_Light,
                    color: COLOR.gray,
                  }}>
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
              timeOperationWorker?.details.some(
                (val: any) => val.endDate != null,
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
              // timeOperationWorker?.details.length > 0 ? timeOperationWorker?.details[timeOperationWorker?.details?.length - 1].endDate : null
            }
            workTimeLeft={workTimeLeft}
            onValueChange={(val: any) => { }}
            hideStandTime={true}
          />
        </View>

        <View style={{ marginTop: 20 }}>{DrawHorizontalWidget()}</View>
        <View>{WorkDetails()}</View>
        {BuildModalDrawer()}
        <View style={{ marginTop: 60 }}>{DrawHorizontalWidget()}</View>
        {/* {notShowChargeTravel(params.workOrderData.type) && ChargeTravelExpenses()} */}
        {params.workOrderData.webStatus !== '4' && (
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <View style={{ width: 300, marginTop: 60 }}>
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
          }}>
          <View>
            <AppBar
              title="เวลาปฏิบัติงาน (ในร้านค้า)"
              rightTitle={`Order: ${orderId}`}
              onBackReload={true}></AppBar>
            <Animated.ScrollView>{Contents()}</Animated.ScrollView>
          </View>
        </View>
      </View>
      <Loading loading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('90%'),
  },
  cell: {
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InspectorWorkOrderDetailsWorkPage;
