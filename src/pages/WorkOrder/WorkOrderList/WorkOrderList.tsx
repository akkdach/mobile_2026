import { Button, Icon, Modal } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from '@bam.tech/react-native-image-resizer';
import Lightbox from 'react-native-lightbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { DataTable, Divider, List, RadioButton } from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { StackActions, useNavigation } from '@react-navigation/native';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DropdownSelect from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import TextInputComponent from '../../../components/TextInput';
import { closeWorkMaster } from '../../../constants/CloseWorkMaster';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import {
  getMenuByWorkType,
  isNotCheckActionCheckIn,
  isNotCheckActionMileage,
  isNotCheckActionPriceCheck,
  isNotValidateCapture,
  isShowChangeEquipment,
  isShowChangeEquipmentMovement,
} from '../../../constants/Menu';
import { ROUTE } from '../../../constants/RoutePath';
import { CardWorkListInterface } from '../../../models';
import { IWorkOrderCheckOutCloseType } from '../../../models/workOrderCheckOutCloseType';
import { IWorkOrderCustomer } from '../../../models/WorkOrderCustomer';
import { ISalePriceDetail } from '../../../models/WorkOrderDetail';
import { uploadImage } from '../../../services/upload';
import {
  fetchWorkOrderImageGet,
  fetchWorkOrderImageUpdate,
} from '../../../services/workOrderCamera';
import {
  fetchCauseCheckOutOptionCloseType,
  fetchCheckOutChangeDeviceGet,
  fetchCheckOutChangeDeviceSet,
  fetchCheckOutCloseTypeGet,
  fetchCheckOutCloseTypeSet,
  fetchCheckOutEquipmentMovementGet,
  fetchCheckOutEquipmentMovementSet,
  fetchCheckOutEquipmentNotMatchGet,
  fetchCheckOutEquipmentNotMatchSet,
  fetchCheckOutWorkingTime,
} from '../../../services/workOrderCheckout';
import {
  fetchBillNumber,
  fetchSalePrice,
  fetchtWorkOrderCustomer,
} from '../../../services/workOrderCustomer';
import { checkWorkInWorkOut } from '../../../services/work_in_work_out';
import {
  checkInShop,
  getCheckInShop,
} from '../../../services/work_order_list_service';
import { generateKey } from '../../../utils/Random';
import SparePartOutstandingPage from '../../SparePartOutstanding/SparePartOutstandingPage';
// import styles from './WorkOrderListCss';
import { _getData, _storeData } from '../../../utils/AsyncStorage';
import { styleSM, stylesLG } from './WorkOrderListCss';
import { color } from 'react-native-reanimated';
import { cancelWorkOrder } from '../../../services/workOrder';
import { CloseReason } from '../../../constants/CloseReason';
import WorkDuration from './WorkDuration';
const defaultImage = require('../../../../assets/images/default.jpeg');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  objType: string;
  workCenter: string;
  orderTypeDescription: string;
  billNo: string;
  webStatus: string;
  IsConnectivity: string;
  errorMessage: string;
};
type Inputs = {
  mileInStore: string;
  billNo: string;
};
type InputChangeEquipment = {
  customerCode: string;
  customerName: string;
  customerType: string;
  identityCode: string;
  identityExpier: string;
  telNumber: string;
  contactName: string;
  contactTelNumber: string;
};
type InputChangeEquipmentNotFound = {
  equipment: string;
  comment: string;
};
type InputMovementEquipment = {
  customerCode: string;
  customerName: string;
  customerType: string;
  identityCode: string;
  identityExpier: string;
  telNumber: string;
  equipment: string;
  equipmentType: string;
  comment: string;
  contactName: string;
  contactTelNumber: string;
};

const WorkOrderListPage: FC<InterfaceProps> = (props) => {
  const navigation = useNavigation();
  console.log('props ====>', props);
  const params = props.route?.params as InterfaceProps
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [checkInModal, setStateCheckInModal] = useState(false);
  const [checkOutModal, setStateCheckOutModal] = useState(false);
  const [closeTypeModal, setCloseTypeModal] = useState(false);
  const [closeReason, setCloseReason] = useState(false);
  const [checkSalePriceModal, setStateSalePriceModal] = useState(false);
  const [salePriceSimulateModal, setStateSaleSimulateModal] = useState(false);
  const [closeTypeCheckOutModal, setCloseTypeCheckOutModal] = useState(false);
  const [causeCloseTypeModal, setCauseCloseTypeModal] = useState(false);
  const [equipmentType, setEquipmentType] = useState<any>(null);
  const [
    checkOutSparePartOutStandingModal,
    setCheckOutSparePartOutStandingModal,
  ] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [checkOutEquipmentNotMatch, setCheckOutEquipmentNotMatch] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, getValues, setValue, reset } = useForm<Inputs>();
  const InputChangeEquipment = useForm<InputChangeEquipment>();
  const InputChangeEquipmentNotFound = useForm<InputChangeEquipmentNotFound>();
  const InputMovementEquipment = useForm<InputMovementEquipment>();

  const [mileInStoreTextError, setMileInStoreTextError] = useState('');
  const [disableMile, setDisableMile] = useState(false);
  const [salePriceDetail, setSalePriceDetail] = useState<ISalePriceDetail>();
  const [currentBillNo, setCurrentBillNo] = useState('');
  const [errorMessage, setErrorMessage] = useState<any>(undefined);
  const [workIn, setWorkIn] = useState(false);
  const [customerData, setCustomerData] = useState<IWorkOrderCustomer | null>();
  const [open, setOpen] = useState(false);
  const [valueSelect, setValueSelect] = useState<any>(null);
  const [valueReasonSelect, setValueReasonSelect] = useState<any>(null);
  const [items, setItems] = useState(closeWorkMaster(params.type));
  const [itemsReason, setItemReason] = useState(CloseReason(params.type));
  const [closeClockWorkTIme, setCloseClockWorkTIme] = useState<any>();
  const [causeCloseType, setCauseCloseType] = useState<any>();
  const [valueCauseCloseType, setValueCauseCloseType] = useState<any>(null);
  const [valueEquipmentType, setValueEquipmentType] = useState<any>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelect, setDateSelect] = useState(
    `${moment(new Date())
      .tz('Asia/Bangkok')
      .add(543, 'year')
      .format('DD/MM/YYYY')}`,
  );

  const [scan, setScan] = useState(false);
  // const [dateSelect, setDateSelect] = useState(
  //   `${moment(new Date()).locale('th').add(543, 'year').format('DD/MM/YYYY')}`,
  // );
  const [typeIdentify, setTypeIdentify] = useState('');
  // ImagePicker SalePriceSimulate
  const [fileSalePriceSimulateData, setFileSalePriceSimulateData] = useState(
    [] as any,
  );

  const [cameraValue, setCameraValue] = useState('');
  const [isVisibleModalPreviewImage, setIsVisibleModalPreviewImage] =
    useState(false);

  const [fileData, setFileData] = useState([] as any);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    // console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSM);
    } else {
      setStyles(stylesLG);
    }

  }, [screenInfo]);
  useEffect(() => {
    setValueSelect(null);
  }, [])


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: any) => {
    const dateTime = moment(date)
      .tz('Asia/Bangkok')
      .add(543, 'year')
      .format('DD/MM/YYYY');
    setDateSelect(`${dateTime}`);
    hideDatePicker();
  };

  const getWorkOrderCustomer = async () => {
    try {
      const result = await fetchtWorkOrderCustomer(params.orderId);
      setCustomerData(result);
    } catch (error) {
      setCustomerData(null);
    }
  };

  const getSalePriceDetail = async (billNo: string) => {
    try {
      const result = await fetchSalePrice(params.orderId, billNo);
      console.log('result::', result)
      if (result.isSuccess) {
        setSalePriceDetail(result.dataResult);
        setStateSalePriceModal(!checkSalePriceModal);
        setStateSaleSimulateModal(!salePriceSimulateModal);
      } else {
        setSalePriceDetail(undefined);
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setSalePriceDetail(undefined);
      setErrorMessage(error.message);
    }
  };

  const getBillNo = async () => {
    try {
      const result = await fetchBillNumber(params.workCenter, params.orderId);
      const { isSuccess, billNo, message } = result;
      if (isSuccess) {
        setCurrentBillNo(`${billNo}`);
      } else {
        setErrorMessage(message);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    checkCheckIn();
    getWorkOrderCustomer();
    getBillNo();
  }, []);

  useEffect(() => {
    const typeStr = params.type.substr(0, 2);
    if (typeStr === 'ZC') {
      setEquipmentType([
        { label: 'TBIB', value: 'TBIB' },
        { label: 'TCO', value: 'TCO' },
        { label: 'TFCB', value: 'TFCB' },
        { label: 'TICM', value: 'TICM' },
        { label: 'TIDP', value: 'TIDP' },
        { label: 'TPX', value: 'TPX' },
        { label: 'TVCA', value: 'TVCA' },
        { label: 'TVEN', value: 'TVEN' },
        { label: 'TVTE', value: 'TVTE' },
      ]);
    }

    if (typeStr === 'BN') {
      setEquipmentType([
        { label: 'NPX', value: 'NPX' },
        { label: 'NFCB', value: 'NFCB' },
        { label: 'NBIB', value: 'NBIB' },
        { label: 'NHOT', value: 'NHOT' },
        { label: 'NCOLD', value: 'NCOLD' },
        { label: 'NPSO', value: 'NPSO' },
      ]);
    }
  }, []);

  useEffect(() => {
    console.log('NextPage');
    return () => setNextPage(false);
  }, [nextPage]);

  useEffect(() => {
    (async () => {
      const result: any = await fetchWorkOrderImageGet(params.orderId);
      if (result) {
        let imageSet = {};
        Object.keys(result.dataResult).forEach(
          (item: string, index: number) => {
            if (item !== 'orderId' && result.dataResult[item]) {
              imageSet = {
                ...imageSet,
                [item]: {
                  uri: result.dataResult[item],
                  key: item,
                  formatType: 'url',
                },
              };
            }
          },
        );
        setFileData([imageSet]);
      }
    })();
  }, []);





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

  const loadCheckOutWorkingTime = async () => {
    try {
      const result: any = (await fetchCheckOutWorkingTime(params.orderId))
        .dataResult;
      console.log('result ====>', result);

      if (result) {
        setCloseClockWorkTIme(result);
      }
    } catch (error) {
      console.log('error ====>', error);
    }
  };

  // useEffect(() => {
  //   loadCheckOutWorkingTime();
  // }, []);

  useEffect(() => {
    (async () => {
      const result: any = (await fetchCheckOutChangeDeviceGet(params.orderId))
        .dataResult;
      InputChangeEquipment.setValue('customerCode', result.customerCode);
      InputChangeEquipment.setValue('customerName', result.customerName);
      InputChangeEquipment.setValue('customerType', result.customerType);
      InputChangeEquipment.setValue('identityCode', result.identityCode);
      InputChangeEquipment.setValue('telNumber', result.telNumber);
      InputChangeEquipment.setValue('contactName', result.contactName);
      InputChangeEquipment.setValue(
        'contactTelNumber',
        result.contactTelNumber,
      );

      // setTypeIdentify(result.customerType);
      // handleDateConfirm(result.identityExpier)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result: any = (
        await fetchCheckOutEquipmentMovementGet(params.orderId)
      ).dataResult;

      InputMovementEquipment.setValue('customerCode', result.customerCode);
      InputMovementEquipment.setValue('customerName', result.customerName);
      InputMovementEquipment.setValue('customerType', result.customerType);
      InputMovementEquipment.setValue('identityCode', result.identityCode);
      InputMovementEquipment.setValue('telNumber', result.telNumber);
      InputMovementEquipment.setValue('equipment', result.equipment);
      InputMovementEquipment.setValue('equipmentType', result.equipmentType);
      InputMovementEquipment.setValue('comment', result.comment);
      InputMovementEquipment.setValue('contactName', result.contactName);
      InputMovementEquipment.setValue(
        'contactTelNumber',
        result.contactTelNumber,
      );

      // setTypeIdentify(result.customerType);
      // setValueEquipmentType(result.equipmentType);
      // handleDateConfirm(result.identityExpier)
    })();
  }, []);

  const resizeImage = async (
    imageUri: string,
    newWidth: number,
    newHeight: number,
    compressFormat: ResizeFormat,
    quality: number,
  ) => {
    try {
      const resizedImageUri = await ImageResizer.createResizedImage(
        imageUri,
        newWidth,
        newHeight,
        compressFormat,
        quality,
      );
      // resizeImageUri is the URI of the new image that can now be displayed, uploaded...
      return resizedImageUri;
    } catch (error: any) {
      // Oops, something went wrong. Check that the filename is correct and
      // inspect err to get more details.
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const _onClickModalCustomerInformation = () => {
    setStateVisibleModal(!visibleModal);
  };

  const _onClickModalCheckIn = () => {
    setStateCheckInModal(!checkInModal);
  };

  const _onGetCheckIn = async () => {
    let data = {
      OrderId: `${params.orderId}`,
      WorkCenter: `${params.workCenter}`,
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
          setDisableMile(false);
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
    Alert.alert('แจ้งเตือน', 'ต้องการยืนยันเลขไมล์ถึงร้าน ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          try {
            let data = {
              mileAge: Number(getValues('mileInStore')),
              orderId: `${params.orderId}`,
              workCenter: `${params.workCenter}`,
            };
            let response = await checkInShop(data);
            if (response.isSuccess) {
              setStateCheckInModal(!checkInModal);
              setValue('mileInStore', '');
            }
          } catch (error) {
            AlertDataNotSuccess();
          }
        },
      },
    ]);
  };

  const _onClickMapCustomer = () => {
    setStateVisibleModal(!visibleModal);
    navigation.dispatch(StackActions.push(ROUTE.WORK_ORDER_MAP, { workOrderData: params }));
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

  const _onClickModalCheckOut = async () => {
    const result: any = (await fetchCheckOutCloseTypeGet(params.orderId))
      .dataResult;
    // Alert.alert(params.webStatus)
    setCloseTypeModal(false);
    if (params.webStatus === '4') {
      setIsEditable(false);
      setValueSelect(result.closeType.toString());
      setCloseTypeCheckOutModal(true);
    } else {
      setIsEditable(true);
      setStateCheckOutModal(!checkOutModal);
    }
  };

  const _onClickCheckOut = () => {
    // Implement check out
    setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
    setStateCheckOutModal(!checkOutModal);

  };

  const _onClickCheckOut3 = () => {
    // Alert.alert('close type '+valueSelect)
    setCloseReason(false);
    setCloseTypeCheckOutModal(true);
    setStateCheckOutModal(false);
  }

  const _onClickCheckOut2 = () => {
    // Implement check out
    setValueSelect('1')
    setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
    setStateCheckOutModal(!checkOutModal);
  };

  const _onClickModalSalePrice = () => {
    reset({ billNo: '' });
    setStateSalePriceModal(!checkSalePriceModal);
  };

  const _onClickSalePrice = () => {
    Alert.alert('แจ้งเตือน', 'ต้องการเช็คราคาขายใช่หรือไม่', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          const getRawValue = getValues('billNo');
          setCurrentBillNo(getRawValue);
          getSalePriceDetail(getRawValue);
        },
      },
    ]);
  };

  const _onClickModalCheckSalePriceSimulate = async (action: string) => {
    // Implement sale price simulate
    switch (action) {
      case 'close':
        setFileSalePriceSimulateData([]);
        setStateSaleSimulateModal(!salePriceSimulateModal);
        break;
      case 'confirm':
        const response = await onStoreImage();
        if (response.isSuccess) {
          Alert.alert('บันทึกสำเร็จ', response.message);
          setStateSaleSimulateModal(!salePriceSimulateModal);
        } else {
          Alert.alert('บันทึกไม่สำเร็จ', response.message);
        }
        break;
      default:
        break;
    }
  };

  const onCandelOrder = async (orderid: string) => {
    cancelWorkOrder(orderid).then((result: any) => {
      if (!result?.isSuccess) {
        navigation.dispatch(StackActions.replace(ROUTE.WORKORDERLIST));
      } else {
        Alert.alert(result?.message ?? 'เกิดข้อผิดพลาดที่ไม่รู้จัก')
        navigation.dispatch(StackActions.replace(ROUTE.WORKORDER));
      }
    })

  }

  const CardWorkOrder = (key: any, args?: CardWorkListInterface) => {
    return (
      <View
        style={[{ marginTop: 10, marginLeft: 20, marginRight: 20 }]}
        key={`${generateKey('card-work-' + key)}`}>
        <TouchableHighlight
          underlayColor="#fff"
          key={`${generateKey('touchable-highlight')}`}
          onPress={async () => {
            if (args?.isCheckIn && !workIn) {
              // notCheckInAlert();
              Alert.alert(
                'แจ้งเตือน',
                'กรุณาเช็คอินออกไปปฏิบัตงาน ก่อนเริ่มปฏิบัติงาน ?',
                [
                  {
                    text: 'ตกลง',
                    onPress: async () =>
                      navigation.dispatch(StackActions.replace(ROUTE.START_WORK)),
                  },
                ],
              );
              return;
            } else if (args?.modal) {
              fetchCheckOutWorkingTime(params.orderId)
                .then(response => {
                  const result = response.dataResult;
                  if (
                    result &&
                    result?.startDate !== null &&
                    result?.endDate !== null
                  ) {
                    loadCheckOutWorkingTime();
                    _onClickModalCheckOut();
                  } else {
                    Alert.alert(
                      'แจ้งเตือน',
                      'กรุณาตรวจสอบเวลาเริ่ม-เวลาสิ้นสุดในการปฏิบัติงาน',
                      [
                        {
                          text: 'ยกเลิก',
                          style: 'cancel',
                        },
                        {
                          text: 'ตกลง',
                          onPress: async () => {
                            navigation.dispatch(StackActions.push(ROUTE.WORK_ORDER_DETAILS_WORK, {
                              workOrderData: params,
                            }));
                          },
                        },
                      ],
                    );
                  }
                })
                .catch(error => {
                  Alert.alert(
                    'แจ้งเตือน',
                    'กรุณาตรวจสอบเวลาเริ่ม-เวลาสิ้นสุดในการปฏิบัติงาน',
                    [
                      {
                        text: 'ยกเลิก',
                        style: 'cancel',
                      },
                      {
                        text: 'ตกลง',
                        onPress: async () => {
                          navigation.dispatch(StackActions.push(ROUTE.WORK_ORDER_DETAILS_WORK, {
                            workOrderData: params,
                          }));
                        },
                      },
                    ],
                  );
                });
            } else if (args?.isCancel) {
              Alert.alert(
                'แจ้งเตือน',
                'คุณต้องการยกเลิกงานนี้ใช่ใหม ?',
                [
                  {
                    text: 'ยกเลิก',
                    style: 'cancel',
                  },
                  {
                    text: 'ตกลง',
                    onPress: async () =>
                      onCandelOrder(params.orderId)
                  },
                ],
              );
              return;
            } else {
              if (args?.route === '') {
                _onClickModalCustomerInformation();
              } else {
                if (!nextPage) {
                  setNextPage(true);
                  navigation.dispatch(StackActions.push(args?.route, { workOrderData: params }));
                }
              }
            }
          }}>
          <List.Item
            key={`${generateKey('list-item')}`}
            style={{
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 8,
              borderRadius: 10,
              padding: screenInfo.width <= 500 ? 3 : 8
            }}
            title={
              <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: screenInfo.width <= 500 ? 14 : 22 }}>
                {args?.title}
              </Text>
            }
            left={props => <Icon name={args?.icon} size={screenInfo.width <= 500 ? 25 : 40} style={{ left: 5, top: 3 }} />}
          />
        </TouchableHighlight>
      </View>
    );
  };

  const DataTableTitleWidget = (title: string) => {
    return (
      <DataTable.Title style={{ flex: 2 }} key={`data-table-${title}`}>
        <Text style={styles.dataTableTitle}>{title}</Text>
      </DataTable.Title>
    );
  };

  const TimeWindowsTable = (data: IWorkOrderCustomer) => {
    return (
      <View key={`${generateKey('time-window')}`}>
        <View>
          <DataTable >
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              {DataTableTitleWidget('วัน')}
              {DataTableTitleWidget('ช่วงเวลา1')}
              {DataTableTitleWidget('ช่วงเวลา2')}
            </DataTable.Header>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 1 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>จันทร์</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.monMorFrom.substr(0, 2)}:
                  {data?.monMorFrom.substr(2, 2)}-{data?.monMorTo.substr(0, 2)}:
                  {data?.monMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.monEventFrom.substr(0, 2)}:
                  {data?.monEventFrom.substr(2, 2)}-
                  {data?.monEventTo.substr(0, 2)}:
                  {data?.monEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 2 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>อังคาร</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.tueMorFrom.substr(0, 2)}:
                  {data?.tueMorFrom.substr(2, 2)}-{data?.tueMorTo.substr(0, 2)}:
                  {data?.tueMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.tueEventFrom.substr(0, 2)}:
                  {data?.tueEventFrom.substr(2, 2)}-
                  {data?.tueEventTo.substr(0, 2)}:
                  {data?.tueEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 3 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>พุธ</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.wedMorFrom.substr(0, 2)}:
                  {data?.wedMorFrom.substr(2, 2)}-{data?.wedMorTo.substr(0, 2)}:
                  {data?.wedMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.wedEventFrom.substr(0, 2)}:
                  {data?.wedEventFrom.substr(2, 2)}-
                  {data?.wedEventTo.substr(0, 2)}:
                  {data?.wedEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 4 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>พฤหัสบดี</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.thuMorFrom.substr(0, 2)}:
                  {data?.thuMorFrom.substr(2, 2)}-{data?.thuMorTo.substr(0, 2)}:
                  {data?.thuMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.thuEventFrom.substr(0, 2)}:
                  {data?.thuEventFrom.substr(2, 2)}-
                  {data?.thuEventTo.substr(0, 2)}:
                  {data?.thuEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 5 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>ศุกร์</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.friMorFrom.substr(0, 2)}:
                  {data?.friMorFrom.substr(2, 2)}-{data?.friMorTo.substr(0, 2)}:
                  {data?.friMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.friEventFrom.substr(0, 2)}:
                  {data?.friEventFrom.substr(2, 2)}-
                  {data?.friEventTo.substr(0, 2)}:
                  {data?.friEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 6 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>เสาร์</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.satMorFrom.substr(0, 2)}:
                  {data?.satMorFrom.substr(2, 2)}-{data?.satMorTo.substr(0, 2)}:
                  {data?.satMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.satEventFrom.substr(0, 2)}:
                  {data?.satEventFrom.substr(2, 2)}-
                  {data?.satEventTo.substr(0, 2)}:
                  {data?.satEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row
              style={{ backgroundColor: moment().day() == 0 ? '#FAE5D3' : '' }}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>อาทิตย์</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.sunMorFrom.substr(0, 2)}:
                  {data?.sunMorFrom.substr(2, 2)}-{data?.sunMorTo.substr(0, 2)}:
                  {data?.sunMorTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>
                  {data?.sunEventFrom.substr(0, 2)}:
                  {data?.sunEventFrom.substr(2, 2)}-
                  {data?.sunEventTo.substr(0, 2)}:
                  {data?.sunEventTo.substr(2, 2)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      </View>
    );
  };

  const ModalCustomerInformation = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.customerModal]}
        visible={visibleModal}>
        <View>
          <View>
            <Text style={styles.titleCheck}>ข้อมูลลูกค้า</Text>
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
              style={[{
                flex: 1,
                borderRadius: 100,
                width: 80,
                height: 110,
                backgroundColor: COLOR.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }, styles.customerIcon]}>
              <Icon name="shop" size={50} color={COLOR.white} />
            </View>
            <View
              style={[styles.customerContent]}>
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

              <Text style={styles.titleDetails}>
                ประเภทการชำระเงิน:{' '}
                {customerData?.paymentType === 'credit' ? 'เครดิต' : 'เงินสด'}
              </Text>
              <View style={{ paddingTop: 20 }}>
                {customerData && TimeWindowsTable(customerData)}
              </View>
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
              () => _onClickModalCustomerInformation(),
              '#818181',
            )}
          </View>
          <View style={{ flex: 2 }}>
            {BottomWidget('แผนที่ลูกค้า', () => _onClickMapCustomer())}
          </View>
        </View>
      </Modal>
    );
  };

  const ModalCheckIn = () => {
    _onGetCheckIn();
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modalWidth, { height: 500 }]}
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
              <Text style={styles.titleDetails}>
                โทรศัพท์: {customerData?.phone}
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'ใส่เลขไมล์ 6 หลัก',
                        (text: any) => onChange(text),
                        value,
                        { maxLength: 6, editable: true },
                      )}
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
            {BottomWidget('ยกเลิก', () => _onClickModalCheckIn(), '#818181')}
          </View>
          <View style={{ flex: 2 }}>
            {BottomWidget('ยืนยันการเข้างาน', () => _onClickCheckIn())}
          </View>
        </View>
      </Modal>
    );
  };

  const ModalcheckOut = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modalWidth]}
        visible={checkOutModal}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleCheck}>เช็คเอ้าท์</Text>
            <View style={{ marginRight: 20, marginBottom: 10 }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => {
                  _onClickModalCheckOut();
                }}>
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>
          </View>
          {DrawHorizontalWidget()}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          {/* <View style={{ padding: screenInfo.width > 500 ? 60 : 5 }}>
            <DropdownSelect
              selects={valueSelect}
              dataItem={items}
              placeholder={`ประเภทการปิดงาน`}
              textStyle={{
                color: COLOR.white,
                fontSize: 16,
                marginTop: -4,
              }}
              containerStyle={{
                backgroundColor: 'rgba(0, 172, 200, 0.6)',
                width: '100%',
                height: 42,
                borderRadius: 25,
                paddingTop: 4,
                marginTop: 10,
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}
              iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
              contentContainerStyle={{ borderRadius: 10 }}
              onValueChange={val => {
                // Alert.alert(val)
                setValueSelect(val);
              }}
              isShowLabel={true}
            />
            {/* <DropDownPicker
              style={{
                borderColor: COLOR.secondary_primary_color,
                borderWidth: 2,
                height: 80,
              }}
              open={open}
              value={valueSelect}
              items={items}
              searchable={true}
              searchPlaceholder="Search..."
              placeholderStyle={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 16,
                color: COLOR.secondary_primary_color,
              }}
              textStyle={{
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 20,
              }}
              labelStyle={{fontFamily: Fonts.Prompt_Medium, color: COLOR.gray}}
              setOpen={setOpen}
              setValue={setValueSelect}
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
              onChangeValue={() => console.log('=========>')}
            /> }
          </View> */}
          {DrawHorizontalWidget()}
          <View>
            {/* <View style={{flex: 2}}>
              {BottomWidget('ยกเลิก', () => _onClickModalCheckOut(), '#818181')}
            </View> */}
            <View >
              <Text style={{ marginTop: 20 }}>ช่างเข้าปิดงาน</Text>
              {BottomWidget('ปิดงานปกติ', () => {
                Alert.alert('เตือน', 'ยืนยันการปิดงานปกติ', [
                  { text: 'ยกเลิก', onPress: async () => _onClickModalCheckOut() },
                  { text: 'ตกลง', onPress: async () => _onClickCheckOut2() },

                ]);
              })}
            </View>
            <View >
              {BottomWidget('เลือกประเภทการปิดงานกรณีงานไม่สำเร็จ', () => setCloseTypeModal(true), COLOR.orange)}
            </View>
            {params.type == 'ZC02' && <>
              <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginTop: 20 }}></View>
              <View >
                <Text style={{ marginTop: 20 }}>ปิดงานแบบ Phone Fix</Text>
                {BottomWidget('ปิดงานแบบ Phone Fix', () => {
                  Alert.alert('เตือน', 'ปิดงานแบบ Phone Fix', [
                    { text: 'ยกเลิก', onPress: async () => _onClickModalCheckOut() },
                    {
                      text: 'ตกลง', onPress: async () => {
                        setValueSelect('17');
                        _onClickCheckOut3();
                      }
                    },
                  ]);
                }, COLOR.primary)}
              </View>
              <View >
                {BottomWidget('ปิดงานแบบ Phone Fix ไม่สำเร็จ', () => {
                  Alert.alert('เตือน', 'ปิดงานแบบ Phone Fix ไม่สำเร็จ', [
                    { text: 'ยกเลิก', onPress: async () => _onClickModalCheckOut() },
                    {
                      text: 'ตกลง', onPress: async () => {
                        setValueSelect('18');
                        setStateCheckOutModal(false); //ปิดหน้าต่าง เช็คเอ้า
                        setCloseReason(true); // เปิดหน้าต่างเลือกเหตุผล                       
                        setCloseTypeCheckOutModal(true);
                        setCloseTypeModal(true)
                      }
                    },
                  ]);
                }, COLOR.error)}
              </View></>}
          </View>
        </View>
      </Modal>
    );
  };

  const ModalCloseType = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modalWidth]}
        visible={closeTypeModal}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleCheck}>เช็คเอ้าท์</Text>
            <View style={{ marginRight: 20, marginBottom: 10 }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => {
                  _onClickModalCheckOut();
                }}>
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>
          </View>
          {DrawHorizontalWidget()}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <View style={{ padding: screenInfo.width > 500 ? 60 : 5 }}>
            <DropdownSelect
              selects={valueSelect}
              dataItem={items}
              placeholder={`ประเภทการปิดงาน`}
              textStyle={{
                color: COLOR.white,
                fontSize: 16,
                marginTop: -4,
              }}
              containerStyle={{
                backgroundColor: 'rgba(0, 172, 200, 0.6)',
                width: '100%',
                height: 42,
                borderRadius: 25,
                paddingTop: 4,
                marginTop: 10,
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}
              iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
              contentContainerStyle={{ borderRadius: 10 }}
              onValueChange={val => {
                // Alert.alert(val)
                setValueSelect(val);
              }}
              isShowLabel={true}
            />
          </View>
          {DrawHorizontalWidget()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: screenInfo.width > 500 ? 30 : 5,
            }}>
            {/* <View style={{flex: 2}}>
              {BottomWidget('ยกเลิก', () => _onClickModalCheckOut(), '#818181')}
            </View> */}
            <View style={{ flex: 2 }}>
              {BottomWidget('ตกลง', () => { _onClickCheckOut(); setCloseTypeModal(false) })}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ModalCloseReason = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modalWidth]}
        visible={closeReason}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleCheck}>เหตุผลที่ปิดงาน Phone Fix ไม่สำเร็จ</Text>
            <View style={{ marginRight: 20, marginBottom: 10 }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => {
                  setCloseReason(false);
                }}>
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>
          </View>
          {DrawHorizontalWidget()}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <View style={{ padding: screenInfo.width > 500 ? 60 : 5 }}>
            <DropdownSelect
              selects={valueReasonSelect}
              dataItem={itemsReason}
              placeholder={`โปรดระบุเหตุผล`}
              textStyle={{
                color: COLOR.white,
                fontSize: 16,
                marginTop: -4,
              }}
              containerStyle={{
                backgroundColor: 'rgba(0, 172, 200, 0.6)',
                width: '100%',
                height: 42,
                borderRadius: 25,
                paddingTop: 4,
                marginTop: 10,
                alignItems: 'flex-start',
                paddingLeft: 20,
              }}
              iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
              contentContainerStyle={{ borderRadius: 10 }}
              onValueChange={val => {
                // Alert.alert(val)
                setValueReasonSelect(val);
              }}
              isShowLabel={true}
            />
          </View>
          {DrawHorizontalWidget()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: screenInfo.width > 500 ? 30 : 5,
            }}>
            {/* <View style={{flex: 2}}>
              {BottomWidget('ยกเลิก', () => _onClickModalCheckOut(), '#818181')}
            </View> */}
            <View style={{ flex: 2 }}>
              {valueReasonSelect && BottomWidget('ตกลง', () => { _onClickCheckOut3(); setCloseTypeModal(false) })}
            </View>
          </View>
        </View>
      </Modal>
    );
  };



  const ModalCheckSalePrice = () => {
    const screenHeight = Dimensions.get('window').height;
    setValue('billNo', currentBillNo);

    return (
      <Modal style={{ width: screenWidth }} transparent visible={checkSalePriceModal} animationType="fade">
        <View style={stylePrice.modalContainer}>
          <View style={stylePrice.contentWrapper}>
            <ScrollView contentContainerStyle={stylePrice.scrollContent}>

              {/* Header */}
              <View style={stylePrice.header}>
                <Text style={styles.titleCheck}>Simulate Price</Text>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={_onClickModalSalePrice}
                  style={stylePrice.closeButton}
                >
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>

              {DrawHorizontalWidget()}

              {/* Customer Info */}
              <View style={stylePrice.customerSection}>
                <View style={stylePrice.iconContainer}>
                  <Icon name="shop" size={50} color={COLOR.white} />
                </View>
                <View style={stylePrice.customerDetails}>
                  <Text style={styles.titleDetails}>
                    {customerData?.customerName}
                  </Text>
                  <Text style={styles.titleDetails}>
                    รหัสลูกค้า {customerData?.customer}
                  </Text>
                  <Text style={styles.textDetails}>
                    {customerData?.address}
                  </Text>
                  <Text style={styles.titleDetails}>
                    โทรศัพท์ - {customerData?.phone}
                  </Text>
                </View>
                <View style={stylePrice.customerDetails}>
                  <Controller
                    control={control}
                    name="billNo"
                    defaultValue={currentBillNo}
                    render={({ field: { onChange, value } }) =>
                      InputWidget('เลขที่บิล', onChange, value)
                    }
                  />
                </View>
              </View>

              {/* {DrawHorizontalWidget()} */}
            </ScrollView>

            {/* ปุ่มด้านล่าง */}
            <View style={stylePrice.footer}>
              <View style={stylePrice.footerButton}>
                {BottomWidget('ยกเลิก', _onClickModalSalePrice, '#818181')}
              </View>
              <View style={stylePrice.footerButton}>
                {BottomWidget('Simulate ราคา', _onClickSalePrice)}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ModalCheckSalePriceSimulateTable = (data: any[]) => {

    return (
<View style={stylePrice.flashListContainer}>
  {salePriceDetail?.items?.map((val, idx) => (
    <View key={`${val.material}-${idx}`} style={stylePrice.flashItem}>
      <View style={stylePrice.row}>
        <Text style={stylePrice.label}>📄 Item</Text>
        <Text style={stylePrice.value}>{val.item}</Text>
      </View>
      <View style={stylePrice.row}>
        <Text style={stylePrice.label}>🏷️ Material</Text>
        <Text style={stylePrice.value}>{val.material}</Text>
      </View>
      <View style={stylePrice.row}>
        <Text style={stylePrice.label}>🧾 Order</Text>
        <Text style={stylePrice.value}>{val.order}</Text>
      </View>
      <View style={stylePrice.row}>
        <Text style={stylePrice.label}>📦 Unit</Text>
        <Text style={stylePrice.value}>{val.unit}</Text>
      </View>
      <View style={stylePrice.row}>
        <Text style={stylePrice.label}>💰 Net Price</Text>
        <Text style={stylePrice.value}>{val.netPrice} {val.currency}</Text>
      </View>
      <View style={stylePrice.row}>
        <Text style={stylePrice.label}>💸 Vat</Text>
        <Text style={stylePrice.value}>{val.vat}%</Text>
      </View>
    </View>
  ))}
</View>
);

  };

  const ModalCheckSalePriceSimulateTable2 = (data: any[]) => {
    return (
      <View style={{ padding: 10 }} key={`${generateKey('check-sale')}`}>
        <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
          {DataTableTitleWidget('Item')}
          {DataTableTitleWidget('Material')}
          {DataTableTitleWidget('Order')}
          {DataTableTitleWidget('Unit')}
          {DataTableTitleWidget('Description')}
          {DataTableTitleWidget('Vat')}
          {DataTableTitleWidget('Net Price')}
          {DataTableTitleWidget('Crcy')}
        </DataTable.Header>
        {salePriceDetail &&
          salePriceDetail.items.length > 0 &&
          salePriceDetail.items.map((val, idx: number) => (
            <DataTable.Row key={`${val.material}-${idx}`}>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.item}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.material}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.order}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.unit}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.description}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.vat}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.netPrice}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.dataTableCell}>{val.currency}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
      </View>
    );
  };

  const _launchImageLibrary = (keyName: any) => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      (async () => {
        if (!response.didCancel) {
          let imageFile = [] as any;
          if (fileData.length > 0) {
            fileData.filter((v: any) => {
              if (Object.keys(v)[0] !== keyName) {
                imageFile.push(v);
              }
            });
          }

          if (imageFile.length > 0) {
            setFileData(imageFile);
          } else {
            setFileData([]);
          }

          const resizeImageSet = (await resizeImage(
            response.uri as string,
            response.width as number,
            response.height as number,
            'JPEG',
            80,
          )) as {
            name: string;
            size: number;
            height: number;
            width: number;
            uri: string;
          };

          // Resizing image set
          let imageSet = {
            [keyName]: {
              fileName: resizeImageSet.name,
              fileSize: resizeImageSet.size,
              height: resizeImageSet.height,
              type: 'image/jpeg',
              uri: resizeImageSet.uri,
              width: resizeImageSet.width,
              base64: response.base64,
              key: keyName,
              formatType: 'file',
            },
          };

          if (fileData.length > 0) {
            const newArray = [...fileData];
            newArray[0][keyName] = imageSet[keyName];
            setFileData(newArray);
          } else {
            setFileData((result: any) => [...result, imageSet]);
          }
        }
      })();
    });
  };

  const _launchCamera = (keyName: any) => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      (async () => {
        if (!response.didCancel) {
          let imageFile = [] as any;
          if (fileData.length > 0) {
            fileData.filter((v: any) => {
              if (Object.keys(v)[0] !== keyName) {
                imageFile.push(v);
              }
            });
          }

          if (imageFile.length > 0) {
            setFileData(imageFile);
          } else {
            setFileData([]);
          }

          const resizeImageSet = (await resizeImage(
            response.uri as string,
            response.width as number,
            response.height as number,
            'JPEG',
            80,
          )) as {
            name: string;
            size: number;
            height: number;
            width: number;
            uri: string;
          };

          // Resizing image set
          let imageSet = {
            [keyName]: {
              fileName: resizeImageSet.name,
              fileSize: resizeImageSet.size,
              height: resizeImageSet.height,
              type: 'image/jpeg',
              uri: resizeImageSet.uri,
              width: resizeImageSet.width,
              base64: response.base64,
              key: keyName,
              formatType: 'file',
            },
          };

          if (fileData.length > 0) {
            const newArray = [...fileData];
            newArray[0][keyName] = imageSet[keyName];
            setFileData(newArray);
          } else {
            setFileData((result: any) => [...result, imageSet]);
          }
        }
      })();
    });
  };

  const renderFileUriImage = (keyName: any) => {
    let dataFile: any;
    if (fileData.length > 0) {
      let file = fileData.filter((v: any) => {
        if (v[keyName] && v[keyName]['key'] === keyName) {
          return v[keyName];
        }
      });
      if (file && file.length > 0) {
        if (file[0][keyName]) {
          dataFile = file[0];
        }
      }
    }

    return dataFile ? (
      <TouchableOpacity
        onPress={() => {
          setCameraValue(dataFile[keyName]['uri']);
          setIsVisibleModalPreviewImage(true);
        }}>
        <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
          <Image
            style={{ height: 300 }}
            source={{
              uri: dataFile[keyName]['uri'],
            }}
          />
        </Lightbox>
      </TouchableOpacity>
    ) : (
      <Image style={styles.image} source={defaultImage} />
    );
  };

  const previewImage = () => {
    return cameraValue ? (
      <Modal
        transparent
        style={{ width: 800 }}
        visible={isVisibleModalPreviewImage}>
        <View>
          <View style={{ alignItems: 'flex-end', paddingBottom: 5 }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => setIsVisibleModalPreviewImage(false)}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
            <Image
              style={{ height: 300 }}
              source={{
                uri: cameraValue as string,
              }}
            />
          </Lightbox>
        </View>
      </Modal>
    ) : (
      <View></View>
    );
  };

  const ImageCardWidget = (title?: string, type?: string) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View>
          <Text style={styles.titleLabel}>{title}</Text>
        </View>
        <View
          style={{
            paddingTop: 10,
          }}>
          {renderFileUriImage(type)}
        </View>
        {isEditable && (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Button style={styles.btn} onPress={() => _launchCamera(type)}>
                <Icon name="camera" size={40} color={COLOR.white} />
              </Button>
            </View>
            <View style={{ flex: 2 }}>
              <Button
                style={[styles.btn, { backgroundColor: COLOR.orange }]}
                onPress={() => _launchImageLibrary(type)}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  เลือกรูป
                </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  };



  const ModalCheckSalePriceSimulate = () => {
    return (
      <Modal style={{ width: screenWidth, height: screenHeight }} transparent visible={salePriceSimulateModal} animationType="fade">
        <View style={stylePrice.modalBox}>
          <ScrollView contentContainerStyle={stylePrice.scrollContent}>
            {/* Header */}
            <View style={stylePrice.header}>
              <Text style={styles.titleCheck}>Simulate Price Detail</Text>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => _onClickModalCheckSalePriceSimulate('close')}
                style={stylePrice.closeButton}
              >
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>

            {DrawHorizontalWidget()}

            {/* Customer Info */}
            <View style={stylePrice.salePriceBox}>
              <Text style={stylePrice.titleDetails}>
                ลูกค้า : {customerData?.customerName}
              </Text>
              <Text style={stylePrice.textDetails}>
                รหัสลูกค้า {customerData?.customer}
              </Text>
              <Text style={stylePrice.textDetails}>
                ที่อยู่: {customerData?.address}
              </Text>
            </View>

            {DrawHorizontalWidget()}

            {/* Bill Info */}
            <View style={stylePrice.billInfo}>
              <Text style={stylePrice.billNumber}>หมายเลขบิล: {currentBillNo}</Text>

              <View style={stylePrice.rowRight}>
                <Text style={stylePrice.titleDetails}>Net:</Text>
                <Text style={stylePrice.titleDetails}>{salePriceDetail?.total ?? 0}</Text>
                <Text style={stylePrice.titleDetails}>THB</Text>
              </View>

              <View style={stylePrice.rowRight}>
                <Text style={stylePrice.titleDetails}>TAX:</Text>
                <Text style={stylePrice.titleDetails}>{salePriceDetail?.vat ?? 0}</Text>
                <Text style={stylePrice.titleDetails}>THB</Text>
              </View>

              <View style={stylePrice.rowRight}>
                <Text style={stylePrice.titleDetails}>Order: {params.orderId}</Text>
                <Text style={stylePrice.titleDetails}>Total:</Text>
                <Text style={stylePrice.titleDetails}>{salePriceDetail?.totalAmount ?? 0}</Text>
                <Text style={stylePrice.titleDetails}>THB</Text>
              </View>
            </View>

            {ModalCheckSalePriceSimulateTable([])}

            <View style={stylePrice.imageSection}>
              {ImageCardWidget('รูปถ่ายบิล', 'urlImage_010')}
            </View>

            {DrawHorizontalWidget()}
            {BottomWidget('ยืนยัน', () =>
              _onClickModalCheckSalePriceSimulate('confirm'),
            )}
          </ScrollView>

          {/* ปุ่มล่าง */}
          {/* <View style={[stylePrice.footer,{width: screenWidth}]}>
            
          </View> */}
        </View>
      </Modal>
    );
  };

  const ChangeEquipment = () => {
    return (
      <View>
        <View>
          {ImageCardWidget('เอกสารใบแจ้งขอเปลี่ยนอุปกรณ์ฯ', 'urlCloseImage_5')}
        </View>
        <View>
          {ImageCardWidget('รูปถ่ายที่ติดตั้งอุปกรณ์ฯ', 'urlCloseImage_6')}
        </View>
        <View>
          {ImageCardWidget(
            'รูปถ่ายเอกสารใบรายงาน/เช็คลิสต์',
            'urlCloseImage_7',
          )}
        </View>

        {isShowChangeEquipment(params.type) && (
          <>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#ccc',
                paddingTop: 20,
                marginTop: 20,
                paddingLeft: 30,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  color: COLOR.gray,
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>
                รายละเอียดการแจ้งเปลี่ยนอุปกรณ์
              </Text>
            </View>

            <View>
              <Controller
                control={InputChangeEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'รหัสลูกค้า',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="customerCode"
                defaultValue=""
              />
            </View>

            <View>
              <Controller
                control={InputChangeEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'ชื่อลูกค้า',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="customerName"
                defaultValue=""
              />
            </View>

            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              <RadioButton.Group
                onValueChange={value => setTypeIdentify(value)}
                value={typeIdentify}>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <RadioButton value="1" />
                      </View>
                      <View>
                        <Text style={styles.textLabel}>บุคคลธรรมดา</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <RadioButton value="2" />
                      </View>
                      <View>
                        <Text style={styles.textLabel}>นิติบุคคล</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <View>
              <Controller
                control={InputChangeEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'เลขที่บัตรประชาชน/หมายเลขผู้เสียภาษี',
                        (text: any) => onChange(text),
                        value,
                        { maxLength: 13, editable: true },
                      )}
                    </View>
                  </View>
                )}
                name="identityCode"
                defaultValue=""
              />
            </View>

            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                marginLeft: 20,
                marginRight: 40,
              }}>
              <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 20 }}>
                <Text style={styles.textLabel}>วันที่หมดอายุ</Text>
              </View>
              <TouchableOpacity onPress={showDatePicker} activeOpacity={0.9}>
                <View style={[styles.btn_date, { width: 560 }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View>
                      <Text style={styles.text_btn_date}>{dateSelect}</Text>
                    </View>
                    <View style={{ left: -6, marginTop: 8 }}>
                      <Icon
                        name={'calendar'}
                        size={30}
                        color={COLOR.secondary_primary_color}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 40 }}>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>

            <View>
              <Controller
                control={InputChangeEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'เบอร์โทรศัพท์',
                        (text: any) => onChange(text),
                        value,
                        { maxLength: 10, editable: true },
                      )}
                    </View>
                  </View>
                )}
                name="telNumber"
                defaultValue=""
              />
            </View>

            <View>
              <Controller
                control={InputChangeEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'ชื่อพนักงานที่ติดต่อ',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="contactName"
                defaultValue=""
              />
            </View>

            <View>
              <Controller
                control={InputChangeEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'เบอร์โทรศัพท์พนักงานที่ติดต่อ',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="contactTelNumber"
                defaultValue=""
              />
            </View>
          </>
        )}
      </View>
    );
  };

  const MovementEquipment = () => {
    return (
      <View>
        <View>
          {ImageCardWidget('เอกสารใบแจ้งขอเปลี่ยนอุปกรณ์ฯ', 'urlCloseImage_5')}
        </View>
        <View>
          {ImageCardWidget('รูปถ่ายที่ติดตั้งอุปกรณ์ฯ', 'urlCloseImage_6')}
        </View>
        <View>
          {ImageCardWidget(
            'รูปถ่ายเอกสารใบรายงาน/เช็คลิสต์',
            'urlCloseImage_7',
          )}
        </View>

        {isShowChangeEquipmentMovement(params.type) && (
          <>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#ccc',
                paddingTop: 20,
                marginTop: 20,
                paddingLeft: 30,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  color: COLOR.gray,
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>
                รายละเอียดการแจ้งเปลี่ยนอุปกรณ์
              </Text>
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'รหัสลูกค้า',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="customerCode"
                defaultValue=""
              />
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'ชื่อลูกค้า',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="customerName"
                defaultValue=""
              />
            </View>

            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              <RadioButton.Group
                onValueChange={value => setTypeIdentify(value)}
                value={typeIdentify}>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <RadioButton value="1" />
                      </View>
                      <View>
                        <Text style={styles.textLabel}>บุคคลธรรมดา</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <RadioButton value="2" />
                      </View>
                      <View>
                        <Text style={styles.textLabel}>นิติบุคคล</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'เลขที่บัตรประชาชน/หมายเลขผู้เสียภาษี',
                        (text: any) => onChange(text),
                        value,
                        { maxLength: 13, editable: true },
                      )}
                    </View>
                  </View>
                )}
                name="identityCode"
                defaultValue=""
              />
            </View>

            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                marginLeft: 20,
                marginRight: 40,
              }}>
              <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 20 }}>
                <Text style={styles.textLabel}>วันที่หมดอายุ</Text>
              </View>
              <TouchableOpacity onPress={showDatePicker} activeOpacity={0.9}>
                <View style={[styles.btn_date, { width: 560 }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View>
                      <Text style={styles.text_btn_date}>{dateSelect}</Text>
                    </View>
                    <View style={{ left: -6, marginTop: 8 }}>
                      <Icon
                        name={'calendar'}
                        size={30}
                        color={COLOR.secondary_primary_color}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 40 }}>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'เบอร์โทรศัพท์',
                        (text: any) => onChange(text),
                        value,
                        { maxLength: 10, editable: true },
                      )}
                    </View>
                  </View>
                )}
                name="telNumber"
                defaultValue=""
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignContent: 'center',
                paddingTop: 20,
              }}>
              <View style={{ flex: 8 }}>
                <Controller
                  control={InputMovementEquipment.control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <View style={{ paddingTop: 20 }}>
                        {InputWidget(
                          'เลขเครื่องที่พบ',
                          (text: any) => onChange(text),
                          value,
                          { editable: true },
                          'text-pad',
                        )}
                      </View>
                    </View>
                  )}
                  name="equipment"
                  defaultValue=""
                />
              </View>

              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Icon
                  name="qrcode"
                  size={40}
                  style={{ paddingTop: 6, paddingLeft: 8 }}
                  color="#000000"
                  onPress={() => setScan(true)}
                />
              </View>
            </View>

            <View style={{ paddingTop: 20, paddingLeft: 30, paddingRight: 30 }}>
              <DropdownSelect
                selects={valueEquipmentType}
                dataItem={equipmentType}
                placeholder={'ประเภทเครื่อง'}
                textStyle={{
                  color: COLOR.white,
                  fontSize: 18,
                  marginTop: -4,
                }}
                containerStyle={{
                  backgroundColor: 'rgba(0, 172, 200, 0.6)',
                  width: '100%',
                  height: 52,
                  borderRadius: 25,
                  paddingTop: 8,
                  marginTop: 10,
                  alignItems: 'flex-start',
                  paddingLeft: 40,
                }}
                iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
                isIcon={true}
                iconSize={20}
                contentContainerStyle={{ borderRadius: 10 }}
                onValueChange={val => {
                  setValueEquipmentType(val);
                }}
                isShowLabel={true}
              />
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'หมายเหตุ',
                        (text: any) => onChange(text),
                        value,
                        { editable: true },
                        'text-pad',
                      )}
                    </View>
                  </View>
                )}
                name="comment"
                defaultValue=""
              />
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'ชื่อพนักงานที่ติดต่อ',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="contactName"
                defaultValue=""
              />
            </View>

            <View>
              <Controller
                control={InputMovementEquipment.control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={{ paddingTop: 20 }}>
                      {InputWidget(
                        'เบอร์โทรศัพท์พนักงานที่ติดต่อ',
                        (text: any) => onChange(text),
                        value,
                        { editable: false },
                      )}
                    </View>
                  </View>
                )}
                name="contactTelNumber"
                defaultValue=""
              />
            </View>

            {scan && (
              <View
                style={{
                  height: 200,
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Text onPress={() => setScan(false)} style={{zIndex: 99, textAlign: 'right', marginRight: 25, fontSize: 42, color: '#ffffff'}}>X</Text> */}
                <QRCodeScanner
                  topViewStyle={{ marginTop: 20 }}
                  topContent={
                    <Button
                      style={[
                        styles.btn,
                        {
                          padding: 6,
                          width: 60,
                          zIndex: 99,
                          alignSelf: 'center',
                        },
                      ]}
                      onPress={() => setScan(false)}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          fontFamily: Fonts.Prompt_Medium,
                        }}>
                        X
                      </Text>
                    </Button>
                  }
                  containerStyle={{ height: 200 }}
                  onRead={(e: BarCodeReadEvent) => {
                    InputMovementEquipment.setValue('equipment', e.data);
                  }}
                />
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const calulateDate = (endDate: any, startDate: any) => {
    if (endDate && startDate) {
      const timeCal = moment(endDate).diff(moment(startDate), 'minutes');
      return timeCal;
    } else {
      return 0;
    }
  };

  const ModalCheckOutSparepartOutstanding = () => {
    const itemsValue = items.find((v: any) => v.value === '4');

    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modalWidth]}
        visible={checkOutSparePartOutStandingModal}>
        <ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.titleCheck}>{itemsValue?.label}</Text>
            <View style={{ marginRight: 20, marginBottom: 10 }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => {
                  setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
                }}>
                <Icon name="close" size={30} />
              </TouchableHighlight>
            </View>
          </View>
          {DrawHorizontalWidget()}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 30,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 24,
                paddingBottom: 20,
              }}>
              เช็คเอ้าท์
            </Text>
            <Icon name="clock-circle" style={{ fontSize: 80, color: 'green' }} />
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 24,
                paddingTop: 30,
              }}>
              เวลาที่ใช้ในการทำงาน{' '}
              {calulateDate(
                closeClockWorkTIme?.endDate,
                closeClockWorkTIme?.startDate,
              )}{' '}
              นาที
            </Text>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            {renderUploadImageCloseType()}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
            }}>
            <View style={{ flex: 2 }}>
              {BottomWidget(
                'ยกเลิก',
                () => {
                  setCloseTypeCheckOutModal(false);
                  setCheckOutSparePartOutStandingModal(false);
                },
                '#818181',
              )}
            </View>
            <View style={{ flex: 2 }}>
              {BottomWidget('ยืนยันการปิดงาน', async () =>
                confirmCloseTypeCheckOut(),
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  const confirmModalSparePart = (value: boolean) => {
    if (value) {
      setCheckOutSparePartOutStandingModal(true);
      setCloseTypeCheckOutModal(!closeTypeCheckOutModal);


    }
  };

  const cancelModalSparePart = () => {
    setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
  };

  const renderUploadImageCloseType = () => {
    switch (valueSelect) {
      case '1':
      case '2':
      case '3':
      case '7':
      case '8':
      case '9':
      case '10':
      case '11':
      case '13':
      case '16':
        // ปิดงานแบบปกติ
        // ปิดงานกรณีตู้ ccp
        // ไม่ปิดงานติดปัญหาด้านเทคนิค
        // ปิดงานแบบติดตั้งไม่สำเร็จ
        // ปิดงานแบบถอดถอนไม่สำเร็จ
        // ปิดงานแบบพื้นที่พร้องติดตั้งบางเครื่อง
        // ปิดงานแบบพื้นที่ไม่พร้อมติดตั้ง
        // ปิดงานแบบสำรวจไม่สำเร็จ
        // ปิดงานแบบลูกค้าแจ้งคืนตู้
        // ปิดงานแบบปกติแบบระบุ Code
        if (isNotValidateCapture(params.type)) {
          const checkTitle =
            ['BN04', 'ZC04', 'BN09', 'ZC09'].indexOf(params.type) > 0;
          return (
            <View>
              <View>
                {ImageCardWidget(
                  params.type != 'ZC04' ? 'รูปถ่ายที่ติดตั้งอุปกรณ์ฯ' : 'รูปถ่ายหลังปฏิบัติงานส่งมอบตู้ให้ลูกค้า',
                  'urlCloseImage_6',
                )}
              </View>
              <View>
                {ImageCardWidget(
                  valueSelect === '1' && checkTitle
                    ? 'รูปถ่ายเอกสารใบขอติดตั้ง/ถอดถอนอุปกรณ์'
                    : 'รูปถ่ายเอกสารใบรายงาน/เช็คลิสต์',
                  valueSelect === '1' && checkTitle
                    ? 'urlCloseImage_5'
                    : 'urlCloseImage_7',
                )}
              </View>
            </View>
          );
        }
        return <View></View>;
      case '4':
        // ไม่ปิดงานเพราะค้างอะไหล่
        // เลื่อกรายการค้างอะไหล่ เปิด modal
        if (isNotValidateCapture(params.type)) {
          return (
            <View>
              <View>
                {ImageCardWidget(
                  'รูปถ่ายอะไหล่ที่ค้างรูปที่ 1',
                  'urlImage_011',
                )}
              </View>
              <View>
                {ImageCardWidget(
                  'รูปถ่ายอะไหล่ที่ค้างรูปที่ 2',
                  'urlImage_012',
                )}
              </View>
              <View>
                {ImageCardWidget(
                  'รูปถ่ายเอกสารใบรายงาน/เช็คลิสต์',
                  'urlCloseImage_7',
                )}
              </View>
            </View>
          );
        }
        return <View></View>;
      case '5':
        // ปิดงานพร้อมแจ้งเปลี่ยนอุปกรณ์
        if (isNotValidateCapture(params.type)) {
          return <View>{ChangeEquipment()}</View>;
        }
        return <View></View>;
      case '6':
        // ปิดงานแบบหมายเลจอุปกรณ์ไม่ตรง
        if (isNotValidateCapture(params.type)) {
          return (
            <View>
              <View>
                {ImageCardWidget('รูปถ่านก่อนปฏิบัติงาน', 'urlCloseImage_2')}
              </View>
              <View>
                {ImageCardWidget(
                  'รูปถ่ายที่ติดตั้งอุปกรณ์ฯ',
                  'urlCloseImage_6',
                )}
              </View>
              <View>
                {ImageCardWidget(
                  'รูปถ่ายเอกสารใบรายงาน/เช็คลิสต์',
                  'urlCloseImage_7',
                )}
              </View>
            </View>
          );
        }
        return <View></View>;
      case '12':
        // ปิดงานแบบเปลี่ยนตู้โยกย้าย
        if (isNotValidateCapture(params.type)) {
          return <View>{MovementEquipment()}</View>;
        }
        return <View></View>;
      default:
        // ปิดงานแบบ verify สำเร็จ
        // ปิดงานแบบ set up ไม่สำเร็จ
        return <View></View>;
    }
  };

  const validateImage = () => {
    let arrayValidate: string[] = [];
    switch (valueSelect) {
      case '1':
      case '2':
      case '3':
      case '7':
      case '8':
      case '9':
      case '10':
      case '11':
      case '13':
      case '16':
        const checkTitle =
          ['BN04', 'ZC04', 'BN09', 'ZC09'].indexOf(params.type) > 0;
        const orderType = ['BN15', 'ZC15', 'BN16', 'ZC16'].includes(params.type);
        if (!orderType) {
          arrayValidate = [
            'urlCloseImage_6',
            valueSelect === '1' && checkTitle
              ? 'urlCloseImage_5'
              : 'urlCloseImage_7',
          ];
        }
        break;
      case '4':
        arrayValidate = ['urlImage_011', 'urlImage_012', 'urlCloseImage_7'];
        break;
      case '5':
        arrayValidate = [
          'urlCloseImage_5',
          'urlCloseImage_6',
          'urlCloseImage_7',
        ];
        break;
      case '6':
        arrayValidate = [
          'urlCloseImage_2',
          'urlCloseImage_6',
          'urlCloseImage_7',
        ];
        break;
      case '12':
        arrayValidate = [
          'urlCloseImage_5',
          'urlCloseImage_6',
          'urlCloseImage_7',
        ];
        break;
      default:
        break;
    }

    if (fileData.length > 0 && arrayValidate.length > 0) {
      if (!arrayValidate.every(el => Object.keys(fileData[0]).includes(el))) {
        Alert.alert('แจ้งเตือน', 'กรุณาเพิ่มรูปถ่ายให้ครบ', [{ text: 'ตกลง' }]);
        return false;
      }
    }

    return true;
  };

  const onStoreImage = async (): Promise<any> => {
    let tempUploadUrl = {};
    try {
      if (fileData.length > 0) {
        for (const [index, keyName] of Object.keys(fileData[0]).entries()) {
          if (fileData[0][keyName].formatType === 'file') {
            const result: any = await uploadImage(
              fileData[0][keyName],
              params.orderId,
            );
            if (result.status === 2) {
              tempUploadUrl = {
                ...tempUploadUrl,
                ...{ [keyName]: result.fileDisplay },
              };
            } else {
              throw new Error(`Error image list: ${index}, ${result.error}`);
            }
          }

          if (Object.keys(fileData[0]).length - 1 === index) {
            const response = await fetchWorkOrderImageUpdate({
              orderId: params.orderId,
              ...tempUploadUrl,
            });
            return response;
          }
        }
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const confirmCloseTypeCheckOut = async () => {

    // Alert.alert('close type' + valueSelect);return;
    let formValue = {};

    if (!validateImage()) {
      return false;
    }

    const response = await onStoreImage();
    if (typeof response == 'boolean' && !response) {
      return;
    }
    // if (response.isSuccess) {
    //   // Alert.alert('Success', response.message);
    //   // router.Actions.pop();
    // } else {
    //   throw new Error(response.message);
    // }

    switch (valueSelect) {
      case '5':
        const { identityCode, telNumber } = InputChangeEquipment.getValues();
        if (isShowChangeEquipment(params.type)) {
          if (
            typeIdentify === null &&
            identityCode === null &&
            telNumber === null
          ) {
            Alert.alert('แจ้งเตือน', 'กรอกข้อมูลไม่ครบถ้วน');
            return;
          }

          // if (identityCode.length !== 13) {
          //   Alert.alert('แจ้งเตือน', 'กรอกข้อมูลบัตรประชาชน 13 หลัก');
          //   return;
          // }
        }

        const dateSplit = dateSelect.split('/');
        formValue = {
          ...InputChangeEquipment.getValues(),
          ...{
            workOrder: params.orderId,
            customerType: typeIdentify,
            identityExpier: moment(
              dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0],
            )
          },
        } as any;

        try {
          const checkOutChange = await fetchCheckOutChangeDeviceSet(formValue);
          if (checkOutChange.isSuccess) {
            await postCheckOutCloseType({
              workOrder: params.orderId,
              closeType: parseInt(valueSelect),
              code: '',
              shortText: '',
            });
          }
        } catch (error: any) {
          Alert.alert('แจ้งเตือน test', error.message);
        }
        return;
      case '6':
        // ปิดงานแบบหมายเลขอุปกรณ์ไม่ตรง
        await getCheckOutEquipmentNotMatch();
        setCheckOutEquipmentNotMatch(true);
        return;
      case '7':
        // ปิดงานแบบติดตั้งไม่สำเร็จ
        await getCheckOutOptionCloseType('PLC');
        setCauseCloseTypeModal(true);
        return;
      case '8':
        // ปิดงานแบบถอดถอนไม่สำเร็จ
        await getCheckOutOptionCloseType('RMC');
        setCauseCloseTypeModal(true);
        return;
      case '12':
        const inputMovementEquipment = InputMovementEquipment.getValues();
        if (isShowChangeEquipmentMovement(params.type)) {
          if (
            typeIdentify === null &&
            valueEquipmentType === null &&
            inputMovementEquipment.identityCode === null &&
            inputMovementEquipment.telNumber === null &&
            inputMovementEquipment.equipment === null
          ) {
            Alert.alert('แจ้งเตือน', 'กรอกข้อมูลไม่ครบถ้วน');
            return;
          }

          // if (inputMovementEquipment.identityCode.length !== 13) {
          //   Alert.alert('แจ้งเตือน', 'กรอกข้อมูลบัตรประชาชน 13 หลัก');
          //   return;
          // }
        }

        const dateMovementSplit = dateSelect.split('/');
        const movementEquipment = {
          ...inputMovementEquipment,
          ...{
            workOrder: params.orderId,
            customerType: typeIdentify,
            identityExpier: moment(
              dateMovementSplit[2] +
              '-' +
              dateMovementSplit[1] +
              '-' +
              dateMovementSplit[0],
            ),
            equipmentType: valueEquipmentType,
          },
        };

        try {
          const checkOutEquipmentMovement =
            await fetchCheckOutEquipmentMovementSet(movementEquipment);
          if (checkOutEquipmentMovement.isSuccess) {
            await postCheckOutCloseType({
              workOrder: params.orderId,
              closeType: parseInt(valueSelect),
              code: '',
              shortText: '',
            });
          }
        } catch (error: any) {
          Alert.alert('แจ้งเตือน test', error.message);
        }
        return;
      case '14':
        // ปิดงานแบบ verify สำเร็จ
        await getCheckOutOptionCloseType('SVF');
        setCauseCloseTypeModal(true);
        return;
      case '15':
        // ปิดงานแบบ set up ไม่สำเร็จ
        await getCheckOutOptionCloseType('USS');
        setCauseCloseTypeModal(true);
        return;
      case '16':
        // ปิดงานแบบปกติแบบระบุ code
        await getCheckOutOptionCloseType('CIN');
        setCauseCloseTypeModal(true);
        return;
      default:
        await postCheckOutCloseType({
          workOrder: params.orderId,
          closeType: parseInt(valueSelect),
          code: '',
          shortText: '',
          mobile_remark: valueReasonSelect
        });
        // setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
        // router.Actions.push(ROUTE.WORKORDER);
        return;
    }
  };

  const confirmCauseCloseTypeCheckOut = async () => {
    const cause = causeCloseType.find(
      (v: any) => v.value === valueCauseCloseType,
    );
    await postCheckOutCloseType({
      workOrder: params.orderId,
      closeType: parseInt(valueSelect),
      code: cause.value ? cause.value : null,
      shortText: cause.label ? cause.label : null,
    });
    setCauseCloseTypeModal(!causeCloseTypeModal);
    setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
    navigation.dispatch(StackActions.push(ROUTE.WORKORDER));
  };

  const postCheckOutCloseType = async (
    payload: IWorkOrderCheckOutCloseType,
  ) => {
    try {
      Alert.alert('แจ้งเตือน', 'ต้องการบันทึกข้อมูลหรือไม่?', [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ตกลง',
          onPress: async () => {
            if (!isSubmit) {
              setIsSubmit(true);
              setIsLoading(true);
              const response = await fetchCheckOutCloseTypeSet(payload);
              setIsSubmit(false);
              if (response.isSuccess) {
                setCheckOutSparePartOutStandingModal(false);
                setCloseTypeCheckOutModal(false);
                setIsLoading(false);
                navigation.dispatch(StackActions.push(ROUTE.WORKORDER));
              } else {
                setIsLoading(false);
                Alert.alert('แจ้งเตือน', response.message, [
                  {
                    text: 'ปิด',
                    onPress: () => {
                      setCheckOutSparePartOutStandingModal(false);
                      setCloseTypeCheckOutModal(false);
                      setTimeout(() => {
                        navigation.setParams({ refreshKey: Date.now() });
                      }, 500);
                    },
                  },
                ]);
              }
            }
          },
        },
      ]);

    } catch (error: any) {
      setIsSubmit(false);
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ปิด',
          onPress: () => {
            setCheckOutSparePartOutStandingModal(false);
            setCloseTypeCheckOutModal(false);
            setTimeout(() => {
              navigation.setParams({ refreshKey: Date.now() });
            }, 500);
          },
        },
      ]);
    }
  };

  const ModalCauseCheckOut = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={{ width: 420, height: 350 }}
        visible={causeCloseTypeModal}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.titleCheck}>เช็คเอ้าท์</Text>
          <View style={{ marginRight: 20, marginBottom: 10 }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                setCloseTypeCheckOutModal(false);
                setCauseCloseTypeModal(false);
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
        </View>
        {DrawHorizontalWidget()}
        <View style={{ paddingTop: 30, paddingLeft: 30, paddingRight: 30 }}>
          <DropdownSelect
            selects={valueCauseCloseType}
            dataItem={causeCloseType}
            placeholder={'เลือกเหตุผล'}
            textStyle={{
              color: COLOR.white,
              fontSize: 18,
              marginTop: -4,
            }}
            containerStyle={{
              backgroundColor: 'rgba(0, 172, 200, 0.6)',
              width: '100%',
              height: 52,
              borderRadius: 25,
              paddingTop: 8,
              marginTop: 10,
              alignItems: 'flex-start',
              paddingLeft: 40,
            }}
            iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
            isIcon={true}
            iconSize={20}
            contentContainerStyle={{ borderRadius: 10 }}
            onValueChange={val => {
              setValueCauseCloseType(val);
            }}
            isShowLabel={true}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            width: '100%',
          }}>
          <View style={{ flex: 1 }}></View>
          <View style={{ flex: 2 }}>
            {BottomWidget('ตกลง', () => confirmCauseCloseTypeCheckOut())}
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      </Modal>
    );
  };

  const ModalCheckOutEquipmentNotMatch = () => {
    return (
      <Modal
        transparent
        maskClosable
        style={{ width: screenWidth - 20, height: 550 }}
        visible={checkOutEquipmentNotMatch}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.titleCheck}>ใส่ข้อมูลอุปกรณ์ที่พบ</Text>
          <View style={{ marginRight: 20, marginBottom: 10 }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={async () => {
                setCheckOutEquipmentNotMatch(false);
                setCloseTypeCheckOutModal(false);
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
        </View>
        {DrawHorizontalWidget()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center',
            paddingTop: 20,
          }}>
          <View style={{ flex: 8 }}>
            <Controller
              control={InputChangeEquipmentNotFound.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={{ paddingTop: 20 }}>
                    {InputWidget(
                      'เลขเครื่องที่พบ',
                      (text: any) => onChange(text),
                      value,
                      { editable: true },
                      'text-pad',
                    )}
                  </View>
                </View>
              )}
              name="equipment"
              defaultValue=""
            />
          </View>

          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <Icon
              name="qrcode"
              size={40}
              style={{ paddingTop: screenWidth < 500 ? 1 : 6, paddingLeft: screenWidth < 500 ? 1 : 8 }}
              color="#000000"
              onPress={() => setScan(true)}
            />
          </View>
        </View>
        <View style={{ paddingTop: 20, paddingLeft: 30, paddingRight: 30 }}>
          <DropdownSelect
            selects={valueEquipmentType}
            dataItem={equipmentType}
            placeholder={'เลือก'}
            textStyle={{
              color: COLOR.white,
              fontSize: 18,
              marginTop: -4,
            }}
            containerStyle={{
              backgroundColor: 'rgba(0, 172, 200, 0.6)',
              width: '100%',
              height: 52,
              borderRadius: 25,
              paddingTop: 8,
              marginTop: 10,
              alignItems: 'flex-start',
              paddingLeft: 40,
            }}
            iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
            isIcon={true}
            iconSize={20}
            contentContainerStyle={{ borderRadius: 10 }}
            onValueChange={val => {
              setValueEquipmentType(val);
            }}
            isShowLabel={true}
          />
        </View>

        <View>
          <Controller
            control={InputChangeEquipmentNotFound.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View style={{ paddingTop: 20 }}>
                  {InputWidget(
                    'หมายเหตุ',
                    (text: any) => onChange(text),
                    value,
                    { editable: true },
                    'text-pad',
                  )}
                </View>
              </View>
            )}
            name="comment"
            defaultValue=""
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            width: '100%',
          }}>
          <View style={{ flex: 1 }}></View>
          <View style={{ flex: 2 }}>
            {BottomWidget('ปิดงาน', () => confirmEquipmentNotMatchCloseType())}
          </View>
          <View style={{ flex: 1 }}></View>
        </View>

        {/* <Scanner
            title={'เลขเครื่องที่พบ'}
            onValue={e =>
              InputChangeEquipmentNotFound.reset({
                equipment: e.data,
              })
            }
            onClose={() => setScan(false)}
          /> */}

        {scan && (
          <View
            style={{
              height: 200,
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Text onPress={() => setScan(false)} style={{zIndex: 99, textAlign: 'right', marginRight: 25, fontSize: 42, color: '#ffffff'}}>X</Text> */}
            <QRCodeScanner
              topViewStyle={{ marginTop: 20 }}
              topContent={
                <Button
                  style={[
                    styles.btn,
                    { padding: 6, width: 60, zIndex: 99, alignSelf: 'center' },
                  ]}
                  onPress={() => setScan(false)}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontFamily: Fonts.Prompt_Medium,
                    }}>
                    X
                  </Text>
                </Button>
              }
              containerStyle={{ height: 200 }}
              onRead={(e: BarCodeReadEvent) => {
                InputChangeEquipmentNotFound.setValue('equipment', e.data);
              }}
            />
          </View>
        )}
      </Modal>
    );
  };

  const confirmEquipmentNotMatchCloseType = async () => {
    // console.log(
    //   '[InputChangeEquipmentNotFound]',
    //   InputChangeEquipmentNotFound.getValues(),
    // );
    console.log('[valueEquipmentType]', valueEquipmentType);
    const equipmentNotFound = InputChangeEquipmentNotFound.getValues();
    try {
      setIsLoading(true);
      await fetchCheckOutEquipmentNotMatchSet({
        workOrder: params.orderId,
        equipmentType: valueEquipmentType,
        equipment: equipmentNotFound.equipment,
        comment: equipmentNotFound.comment,
      });
      setIsLoading(false);
      await postCheckOutCloseType({
        workOrder: params.orderId,
        closeType: parseInt(valueSelect),
        code: '',
        shortText: '',
      });
      setCheckOutEquipmentNotMatch(false);
      setCloseTypeCheckOutModal(false);
      setIsLoading(false);
      navigation.dispatch(StackActions.push(ROUTE.WORKORDER));
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const getCheckOutOptionCloseType = async (CodeGroup: string) => {
    try {
      console.log('fetchCauseCheckOutOptionCloseType', {
        WorkOrder: params.orderId,
        CodeGroup,
      });
      const response = await fetchCauseCheckOutOptionCloseType({
        WorkOrder: params.orderId,
        CodeGroup,
      });
      if (response.isSuccess) {
        const result = response.dataResult.map((item: any) => {
          return { label: item.shortText, value: item.code };
        }) as any[];
        setCauseCloseType(result);
      } else {
        Alert.alert('แจ้งเตือน', response.message);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const getCheckOutEquipmentNotMatch = async () => {
    try {
      const response = await fetchCheckOutEquipmentNotMatchGet(params.orderId);
      if (response.isSuccess) {
        setValueEquipmentType(response.dataResult.equipmentType);
        InputChangeEquipmentNotFound.setValue(
          'equipment',
          response.dataResult.equipment,
        );
        InputChangeEquipmentNotFound.setValue(
          'comment',
          response.dataResult.comment,
        );
      } else {
        Alert.alert('แจ้งเตือน', response.message);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const ModalCloseTypeCheckOut = () => {
    const itemsValue = items.find((v: any) => v.value === valueSelect);
    if (itemsValue?.value === '4' && isEditable) {
      return (
        <Modal
          transparent
          maskClosable
          style={{ width: '100%', height: '100%' }}
          visible={closeTypeCheckOutModal}>
          <SparePartOutstandingPage
            confirmModalSparePart={confirmModalSparePart}
            cancelModalSparePart={cancelModalSparePart}
            orderId={params.orderId}
          />
        </Modal>
      );
    } else {
      return (
        <Modal
          transparent
          maskClosable
          style={[styles.modalWidthImg, { height: screenHeight - 105 }]}
          visible={closeTypeCheckOutModal}>
          <ScrollView>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.titleCheck}>{itemsValue?.label}</Text>
              <View style={{ marginRight: 20, marginBottom: 10 }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    setCloseTypeCheckOutModal(!closeTypeCheckOutModal);
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
            </View>
            {DrawHorizontalWidget()}
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 30,
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: 24,
                  paddingBottom: 20,
                }}>
                เช็คเอ้าท์
              </Text>
              <Icon
                name="clock-circle"
                style={{ fontSize: 80, color: 'green' }}
              />
              {/* <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: 24,
                  paddingTop: 30,
                }}>
                เวลาที่ใช้ในการทำงาน{' '}

                  
                {calulateDate(
                  closeClockWorkTIme?.endDate,
                  closeClockWorkTIme?.startDate,
                )}{' '}
                นาที
              </Text> */}
              <WorkDuration startTime={closeClockWorkTIme?.startDate} endTime={closeClockWorkTIme?.endDate} /> 
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              {renderUploadImageCloseType()}
            </View>
            {isEditable && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 20,
                }}>
                <View style={{ flex: 2 }}>
                  {BottomWidget(
                    'ยกเลิก',
                    () => setCloseTypeCheckOutModal(!closeTypeCheckOutModal),
                    '#818181',
                  )}
                </View>
                <View style={{ flex: 2 }}>
                  {BottomWidget('ยืนยันการปิดงาน', () =>
                    confirmCloseTypeCheckOut(),
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </Modal>
      );
    }
  };

  const renderWorkOrderList = () => {
    const listOrder: any = [];
    const orderData: CardWorkListInterface[] = getMenuByWorkType(
      params.type,
      params.objType,
      params.webStatus,
    );
    orderData.forEach((order, index) => {
      listOrder.push(CardWorkOrder(index, order));
    });

    return listOrder;
  };

  const InputWidget = (
    placeholderText?: string,
    onChangeText?: any,
    values?: any,
    option?: { maxLength?: any; editable?: any },
    keyBoardType = 'number-pad',
  ) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flex: 4,
          }}>
          <TextInputComponent
            value={values}
            placeholder={placeholderText}
            keyboardType={keyBoardType}
            style={[styles.text14, { height: 52 }]}
            maxLength={option?.maxLength}
            onChangeText={onChangeText}
            editable={option?.editable}
          />
        </View>
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
            styles.btn, { textAlign: 'center' },
            colorBackground && { backgroundColor: colorBackground },

          ]}
          onPress={action}>
          <Text
            style={[styles.text22, {
              textAlign: 'center',
              color: 'white',
              fontFamily: Fonts.Prompt_Medium,
            }]}>
            {title}
          </Text>
        </Button>
      </View>
    );
  };

  const ButtonGroupEvent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 0,
          marginBottom: 60,
        }}
        key={generateKey('button-group-main')}>
        {isNotCheckActionMileage(params.type) && params.webStatus !== '4' && (
          <View style={{ flex: 1, width: '100%' }}>
            {BottomWidget('เลขไมล์ถึงร้าน', () => _onClickModalCheckIn())}
          </View>
        )}
        {isNotCheckActionCheckIn(params.type) && params.webStatus !== '4' && (
          <View style={{ flex: 1, width: '100%' }}>
            {BottomWidget('เช็คอิน', () => {

              navigation.dispatch(StackActions.push(ROUTE.MainCheckIn, params))

            }
            )}
          </View>
        )}
        {isNotCheckActionPriceCheck(params.type) && (
          <View style={{ flex: 1, width: '100%' }}>
            {BottomWidget('เช็คราคาขาย', () => _onClickModalSalePrice())}
          </View>
        )}
      </View>
    );
  };

  return (
    <>

      <BackGroundImage
        components={
          <Animated.View>
            <AppBar
              // title="Work Order List"
              title={`Order: ${params.orderId}`}
              replacePath={ROUTE.WORKORDER}
              // rightTitle={`Order: ${params.orderId}`}
              key={`work-order-list-app-bar`}
            // onBackReload={params.backReloadPage} ////2023
            ></AppBar>
            {params.errorMessage &&
              params.errorMessage !== null &&
              params.errorMessage.length > 0 ? (
              <View
                style={{
                  padding: screenInfo.width > 500 ? 20 : 3,
                  paddingTop: screenInfo.width > 500 ? 25 : 5,
                  paddingBottom: screenInfo.width > 500 ? 25 : 5,
                  backgroundColor: '#FA5F55',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: screenInfo.width > 500 ? 18 : 10,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  {params.errorMessage}
                </Text>
              </View>
            ) : null}
            <ScrollView
              key={generateKey('scroll-view-main')}
              style={{
                maxHeight: params.type === 'ZC01' ? screenHeight - 0 : screenHeight,
              }}>
              {renderWorkOrderList()}
              {ButtonGroupEvent()}
            </ScrollView>
            {ModalCustomerInformation()}
            {ModalCheckIn()}
            {ModalcheckOut()}

            {ModalCloseType()}

            {ModalCheckSalePrice()}
            {ModalCheckSalePriceSimulate()}
            {ModalCloseTypeCheckOut()}
            {ModalCheckOutSparepartOutstanding()}
            {ModalCauseCheckOut()}
            {previewImage()}
            {ModalCheckOutEquipmentNotMatch()}
            <ModalCloseReason />
            {errorMessage &&
              Alert.alert('แจ้งเตือน', errorMessage, [
                {
                  text: 'ตกลง',
                  onPress: async () => setErrorMessage(undefined),
                },
              ])}
          </Animated.View>
        }
        key={`${generateKey('background-main')}`}></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderListPage;

const stylePrice = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',

    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  customerSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 110,
    borderRadius: 100,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
    paddingLeft: 20,
    minWidth: 200,
  },
  footer: {
    width: screenWidth,
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 5,
    width: '100%',
  }, overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },


  salePriceBox: {
    marginTop: 20,
  },
  titleDetails: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  textDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  billInfo: {
    marginTop: 20,
  },
  billNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  rowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  imageSection: {
    marginTop: 20,
    marginBottom: 20,
  },
 sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: 10,
    color: COLOR.primary,
  },flashListContainer: {
    padding: 10,
  },
  flashItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '50%',
  },



});