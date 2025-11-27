import { Icon, Modal } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from 'react-native-image-resizer';
import Lightbox from 'react-native-lightbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, Card, RadioButton } from 'react-native-paper';
import AppBar from '../../../../components/AppBar';
import Loading from '../../../../components/loading';
import TextInputComponent from '../../../../components/TextInput';
import { COLOR } from '../../../../constants/Colors';
import { Fonts } from '../../../../constants/fonts';
import LocalStorageKey from '../../../../constants/LocalStorageKey';
import { ROUTE } from '../../../../constants/RoutePath';
import { LoginResponseInterface } from '../../../../models/login';
import { fetchCloseQIInformation } from '../../../../services/qualityIndexService';
import {
  removeImagesVisitInspector,
  uploadImageVisitInspect,
} from '../../../../services/upload';
import {
  getCheckListCodeDefectMaster,
  getCheckListServiceVisitInspector,
  getImageCheckingListService,
  postCheckingListVisiterInspectService,
  postCreateCheckinglist_Inspector,
  postImageCheckingListService,
  postPmCheckingListVisitInspectorService,
} from '../../../../services/work_order_check_list';
import { _getData } from '../../../../utils/AsyncStorage';
import InspectorWorkOrderCheckListPMPage from './InspectorWorkOrderCheckListPMPage';
import { useNavigation, StackActions } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  workCenter: string;
  objType: string;
  pmType: string;
  orderTypeDescription: string;
  webStatus: string;
  workType: string;
};

const InspectorWorkOrderCheckListPage = (props: {
  workOrderData: InterfaceProps;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();
  const { orderId, type, orderTypeDescription } = props?.workOrderData;
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allValues, setAllValues] = useState({
    electicalSystem: { measure: 'false', remark: '' },
    waterSystem: { measure: 'false', remark: '' },
    machine: { measure: 'false', remark: '' },
    gmpPestControl: { measure: 'false', remark: '' },
    waterQulity: { measure: 'false', remark: '' },
  });

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  }, [screenInfo]);

  const [valueText, onChangeText] = useState('');
  const showModalL1 = () => setVisibleL1(true);
  const hideModalL1 = () => setVisibleL1(false);
  const showModalW3 = () => setVisibleW3(true);
  const hideModalW3 = () => setVisibleW3(false);
  const showModalS4 = () => setVisibleS4(true);
  const hideModalS4 = () => setVisibleS4(false);
  const showModalS5 = () => setVisibleS5(true);
  const hideModalS5 = () => setVisibleS5(false);
  const showModalC6 = () => setVisibleC6(true);
  const hideModalC6 = () => setVisibleC6(false);
  const showModalD8 = () => setVisibleD8(true);
  const hideModalD8 = () => setVisibleD8(false);
  const showModalO9 = () => setVisibleO9(true);
  const hideModalO9 = () => setVisibleO9(false);
  const showModalR = () => setVisibleR(true);
  const hideModalR = () => setVisibleR(false);
  const [indexSelectDate, setIndexSelectDate] = useState<any>();
  const [itemSelects, setItemSelect] = useState<any>();
  const [visibleSelectL1, setVisibleL1] = React.useState(false);
  const [visibleSelectW3, setVisibleW3] = React.useState(false);
  const [visibleSelectS4, setVisibleS4] = React.useState(false);
  const [visibleSelectS5, setVisibleS5] = React.useState(false);
  const [visibleSelectC6, setVisibleC6] = React.useState(false);
  const [visibleSelectD8, setVisibleD8] = React.useState(false);
  const [visibleSelectO9, setVisibleO9] = React.useState(false);
  const [visibleSelectR, setVisibleR] = React.useState(false);
  const [visibleCamera, setVisibleCamera] = React.useState(false);
  const [dataSelects, setDataSelects] = useState<any>('');
  const [indexSelects, setIdexSelects] = useState<any>('');
  const [dataListL1, setDataListL1] = useState<any>();
  const [dataListW3, setDataListW3] = useState<any>();
  const [dataListS4, setDataListS4] = useState<any>();
  const [dataListS5, setDataListS5] = useState<any>();
  const [dataListC6, setDataListC6] = useState<any>();
  const [dataListD8, setDataListD8] = useState<any>();
  const [dataListO9, setDataListO9] = useState<any>();
  const [dataListR, setDataListR] = useState<any>();
  const [typeOrderCheckList, setTypeOrderCheckList] = useState<any>();
  const [errorValidate, setErrorValidate] = useState<any>(false);
  const [dataListL1DatePicker, setDataListL1DatePicker] = useState<any>(false);
  const [dataListW3DatePicker, setDataListW3DatePicker] = useState<any>(false);
  const [dataListS4DatePicker, setDataListS4DatePicker] = useState<any>(false);
  const [dataListS5DatePicker, setDataListS5DatePicker] = useState<any>(false);
  const [dataListC6DatePicker, setDataListC6DatePicker] = useState<any>(false);
  const [dataListD8DatePicker, setDataListD8DatePicker] = useState<any>(false);
  const [dataListO9DatePicker, setDataListO9DatePicker] = useState<any>(false);
  const [dataListRDatePicker, setDataListRDatePicker] = useState<any>(false);
  const [checkListCamera, setCheckListCamera] = useState<any>('');
  const [fileData, setFileData] = useState({} as any);
  const [isVisible, setIsVisible] = useState(false);
  const list = [
    {
      title: 'ยกเลิก',
      icons: '',
      containerStyle: { alignItems: 'flex-end', justifyContent: 'flex-end' },
      onPress: () => setIsVisible(false),
    },
    {
      title: 'ถ่ายภาพ',
      icons: 'camera',
      onPress: () => {
        setIsVisible(false), _launchCamera(checkListCamera.id);
      },
    },
    {
      title: 'เลือกรูปภาพ',
      icons: 'file-image',
      onPress: () => {
        setIsVisible(false), _launchImageLibrary(checkListCamera.id);
      },
    },
  ];

  useEffect(() => {
    getCheckList();
    let timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getCheckList = async () => {
    setIsLoading(true);
    try {
      let defectMaster = await getCheckListCodeDefectMaster();

      let response = await getCheckListServiceVisitInspector(
        props.workOrderData.orderId,
        props.workOrderData.workType,
      );
      setTypeOrderCheckList(response.type);
      setDataListL1({ ...response?.L1, ...{ L1: defectMaster?.L1 } });
      setDataListW3({ ...response?.W3, ...{ W3: defectMaster?.W3 } });
      setDataListS4({ ...response?.S4, ...{ S4: defectMaster?.S4 } });
      setDataListS5({ ...response?.S5, ...{ S5: defectMaster?.S5 } });
      setDataListC6({ ...response?.C6, ...{ C6: defectMaster?.C6 } });
      setDataListD8({ ...response?.D8, ...{ D8: defectMaster?.D8 } });
      setDataListO9({ ...response?.O9, ...{ O9: defectMaster?.O9 } });
      setDataListR({ ...response?.R, ...{ R: defectMaster?.R } });
      let responseImageCheckList = await getImageCheckingListService(
        props.workOrderData.orderId,
        props.workOrderData.workType,
      );
      if (responseImageCheckList) {
        setFileData({ ...responseImageCheckList.images });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (pmCheckListValue?: any) => {
    if (props.workOrderData.webStatus === '4') {
      const isValidateObjType =
        ['TPX', 'NPX', 'TFCB', 'NFCB'].indexOf(props.workOrderData.objType) >=
        0;
      const isValidateType =
        props.workOrderData.type === 'ZC01' ||
        props.workOrderData.type === 'BN01';
      const isValidatePmType =
        props.workOrderData.pmType === 'PME' ||
        props.workOrderData.pmType === 'PMM';
      if (isValidateObjType && isValidateType && isValidatePmType) {
        // Actions.push(ROUTE.QUALITY_INDEX, props);
        navigation.dispatch(StackActions.push(ROUTE.QUALITY_INDEX, props));
      } else {
        Alert.alert(
          'แจ้งเตือน',
          'ไม่สามารถทำรายการได้ใน web status 4 และไม่ใช่ type ZC01, BN01',
          [
            {
              text: 'ตกลง',
              onPress: async () => { },
            },
          ],
        );
      }
      return;
    }
    const listL1 = { ...dataListL1 };
    const listW3 = { ...dataListW3 };
    const listS4 = { ...dataListS4 };
    const listS5 = { ...dataListS5 };
    const listC6 = { ...dataListC6 };
    const listD8 = { ...dataListD8 };
    const listO9 = { ...dataListO9 };
    const listR = { ...dataListR };
    delete listL1.L1;
    delete listW3.W3;
    delete listS4.S4;
    delete listS5.S5;
    delete listC6.C6;
    delete listD8.D8;
    delete listO9.O9;
    delete listR.R;
    const checkList = [
      listL1,
      listW3,
      listS4,
      listS5,
      listC6,
      listD8,
      listO9,
      listR,
    ];

    const itemQiCheckListData: any = {
      type: typeOrderCheckList,
      checkList: checkList,
    };
    let checkValidate = false;
    let itemQiCheckListConvertData: any = [];
    Alert.alert('แจ้งเตือน', 'ต้องการบันทึกข้อมูลใช่หรือไม่ ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          for (const item of itemQiCheckListData?.checkList) {
            if (!checkValidate) {
              if (Object.keys(item).length != 0) {
                for (const itemData of item.items) {
                  if (itemData['type'] === 'radio') {
                    if (
                      itemData['measure'] === 'false' &&
                      itemData['codeDescription'] === ''
                    ) {
                      checkValidate = true;
                      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน ?', [
                        {
                          text: 'ตกลง',
                          onPress: async () => {
                            checkValidate = false;
                          },
                        },
                      ]);
                      setErrorValidate(true);
                      return;
                      break;
                    } else {
                      if (itemData['measure'] === null) {
                        checkValidate = true;
                        Alert.alert(
                          'แจ้งเตือน',
                          'กรุณากรอกข้อมูลให้ครบถ้วน ?',
                          [
                            {
                              text: 'ตกลง',
                              onPress: async () => {
                                checkValidate = false;
                              },
                            },
                          ],
                        );
                        setErrorValidate(true);
                        return;
                        break;
                      }
                    }
                  } else if (
                    itemData['type'] === 'input' &&
                    itemData['inputType'] != 'number'
                  ) {
                    if (itemData['textDescription'] === '') {
                      checkValidate = true;
                      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน ?', [
                        {
                          text: 'ตกลง',
                          onPress: async () => {
                            checkValidate = false;
                          },
                        },
                      ]);
                      setErrorValidate(true);
                      return;
                    }
                  }
                  // else if (itemData['type'] === 'input' && itemData['inputType'] != "date") {
                  //   if (itemData['textDescription'] === '') {
                  //     checkValidate = true;
                  //     Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน ?', [
                  //       {
                  //         text: 'ตกลง',
                  //         onPress: async () => {
                  //           checkValidate = false;
                  //         },
                  //       },
                  //     ]);
                  //     setErrorValidate(true);
                  //     return;
                  //   }
                  // }
                  checkValidate = false;
                  let dataConvert = {
                    checkListMasterId: itemData['id'],
                    checked: itemData['measure'],
                    codeDescription: itemData['codeDescription'],
                    textDescription: itemData['textDescription'],
                  };
                  itemQiCheckListConvertData.push(dataConvert);
                }
              }
            } else {
              break;
            }
          }
          if (props.workOrderData.type.toUpperCase() === 'ZC01') {
            for (const key in pmCheckListValue) {
              if (Object.prototype.hasOwnProperty.call(pmCheckListValue, key)) {
                if (pmCheckListValue[key]['measure'] === '') {
                  setErrorValidate(true);
                  alertError();
                  return;
                }
              }
            }
          }

          try {
            setIsLoading(true);
            const result: any = await _getData({ key: LocalStorageKey.userInfo });
            const userInformation = JSON.parse(result);
            const user = new LoginResponseInterface(userInformation);
            let imageObject: any = [];
            if (Object.keys(fileData).length != 0) {
              for (const property in fileData) {
                fileData[property].map((val: any) => {
                  let dataResponse = {
                    key: Number(val?.key),
                    url: val?.uri,
                  };
                  imageObject.push(dataResponse);
                });
              }
            }
            let imagesCheckList = {
              orderId: orderId,
              work_type: props.workOrderData.workType,
              images: imageObject,
            };
            setErrorValidate(false);
            postCheckingList(
              itemQiCheckListConvertData,
              user.role,
              pmCheckListValue,
              imagesCheckList,
            );
            setLoading(false);
          } catch (error) {
            console.log('error ====>', error);
          }
        },
      },
    ]);
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

          let imageSet: any = {};
          if (!fileData[keyName]) {
            imageSet = {
              [keyName]: [],
            };
          } else {
            imageSet = {
              [keyName]: [...fileData[keyName]],
            };
          }
          imageSet[keyName].push({
            fileName: resizeImageSet.name,
            fileSize: resizeImageSet.size,
            height: resizeImageSet.height,
            type: 'image/jpeg',
            uri: resizeImageSet.uri,
            width: resizeImageSet.width,
            base64: response.base64,
            key: keyName,
            formatType: 'file',
          });
          fileData[keyName] = imageSet[keyName];
          setFileData({ ...fileData });
        }
      })();
    });
  };

  const _launchCamera = async (keyName?: any) => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      (async () => {
        if (!response.didCancel) {
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

          let imageSet: any = {};
          if (!fileData[keyName]) {
            imageSet = {
              [keyName]: [],
            };
          } else {
            imageSet = {
              [keyName]: [...fileData[keyName]],
            };
          }
          imageSet[keyName].push({
            fileName: resizeImageSet.name,
            fileSize: resizeImageSet.size,
            height: resizeImageSet.height,
            type: 'image/jpeg',
            uri: resizeImageSet.uri,
            width: resizeImageSet.width,
            base64: response.base64,
            key: keyName,
            formatType: 'file',
          });
          fileData[keyName] = imageSet[keyName];
          setFileData({ ...fileData });
        }
      })();
    });
  };

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
      return resizedImageUri;
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const alertError = () => {
    Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน ?', [
      {
        text: 'ตกลง',
        onPress: async () => { },
      },
    ]);
  };

  const postCheckingList = async (
    data: any,
    role: any,
    pmCheckListValue: any,
    imagesCheckList: any,
  ) => {
    let payload = {
      ...{ workOrderCheckingList: [...data] },
      ...{
        orderId: props.workOrderData.orderId,
        workType: props.workOrderData.workType,
      },
    };
    setIsLoading(true);
    try {
      let response = await postCreateCheckinglist_Inspector(payload);
      if (imagesCheckList.images.length > 0) {
        await postImageCheckingListService(imagesCheckList);
      }
      if (response?.isSuccess) {
        if (
          props.workOrderData.type.toUpperCase() === 'ZC01' ||
          props.workOrderData.type.toUpperCase() === 'BN01'
        ) {
          postPmCheckingList(pmCheckListValue, role);
        } else {
          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
            {
              text: 'ปิด',
              onPress: async () => {
                // Actions.pop();
                navigation.dispatch(StackActions.pop());
              },
            },
          ]);
        }
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน check list', error.message, [
        {
          text: 'ตกลง',
          onPress: async () => {
            // Actions.pop();
            navigation.dispatch(StackActions.pop());
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const postPmCheckingList = async (data: any, role: any) => {
    let payload = {
      ...data,
      ...{
        orderId: props.workOrderData.orderId,
        workType: props.workOrderData.workType,
      },
    };
    setIsLoading(true);
    try {
      let response = await postPmCheckingListVisitInspectorService(payload);
      if (response.isSuccess) {
        const isValidateObjType =
          ['TPX', 'NPX', 'TFCB', 'NFCB'].indexOf(props.workOrderData.objType) >=
          0;
        const isValidateType =
          props.workOrderData.type === 'ZC01' ||
          props.workOrderData.type === 'BN01';
        const isValidatePmType =
          props.workOrderData.pmType === 'PME' ||
          props.workOrderData.pmType === 'PMM';
        if (isValidateObjType && isValidateType && isValidatePmType) {
          // Actions.push(ROUTE.QUALITY_INDEX, props);
          navigation.dispatch(StackActions.push(ROUTE.QUALITY_INDEX, props));
        } else {
          await fetchCloseQIInformation(props.workOrderData.orderId);
          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
            {
              text: 'ปิด',
              onPress: async () => {
                // Actions.pop();
                navigation.dispatch(StackActions.pop());
              },
            },
          ]);
        }
      } else {
        Alert.alert('แจ้งเตือน pm check list', response.message, [
          {
            text: 'ตกลง',
            onPress: async () => { },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน pm check list', error.message, [
        {
          text: 'ตกลง',
          onPress: async () => { },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItemDropDownSelect = ({ item, index }: any) => {
    return item;
  };

  const BuildDropDownSelectL1 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
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
            <View style={{ flex: screenInfo.width > 500 ? 0.3 : 0.4 }}>
              <RadioButton value={val?.value} />
            </View>
            <View style={{ flex: 3 }}>
              <TouchableOpacity
                onPress={() => {
                  const dataObj = {
                    ...dataItem,
                    ...{ codeDescription: val.value },
                  };
                  dataListL1.items.splice(indexSelects, 1, dataObj);
                  setDataListL1({ ...dataListL1 });
                  hideModalL1();
                }}>
                <View>
                  <Text
                    style={[
                      {
                        fontFamily: Fonts.Prompt_Medium,
                        fontSize: screenInfo.width > 500 ? 18 : 12,
                        marginTop: screenInfo.width > 500 ? 4 : 10,
                        color: COLOR.gray
                      },
                    ]}>
                    {val?.label}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>,
        );
      });
    }
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalL1();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectL1}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalL1(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width > 500 ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListL1.items.splice(indexSelects, 1, dataObj);
                    setDataListL1({ ...dataListL1 });
                    hideModalL1();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectW3 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListW3.items.splice(indexSelects, 1, dataObj);
              setDataListW3({ ...dataListW3 });
              hideModalW3();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 12,
                      marginTop: screenInfo.width > 500 ? 4 : 6,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalW3();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectW3}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalW3(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListW3.items.splice(indexSelects, 1, dataObj);
                    setDataListW3({ ...dataListW3 });
                    hideModalW3();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectS4 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListS4.items.splice(indexSelects, 1, dataObj);
              setDataListS4({ ...dataListS4 });
              hideModalS4();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 12,
                      marginTop: screenInfo.width > 500 ? 4 : 10,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalS4();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectS4}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalS4(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width > 500 ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListS4.items.splice(indexSelects, 1, dataObj);
                    setDataListS4({ ...dataListS4 });
                    hideModalS4();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectS5 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListS5.items.splice(indexSelects, 1, dataObj);
              setDataListS5({ ...dataListS5 });
              hideModalS5();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 12,
                      marginTop: screenInfo.width > 500 ? 4 : 10,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalS5();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: 16,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectS5}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalS5(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width > 500 ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListS5.items.splice(indexSelects, 1, dataObj);
                    setDataListS5({ ...dataListS5 });
                    hideModalS5();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectC6 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListC6.items.splice(indexSelects, 1, dataObj);
              setDataListC6({ ...dataListC6 });
              hideModalC6();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 10,
                      marginTop: screenInfo.width > 500 ? 4 : 10,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalC6();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectC6}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalC6(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width > 500 ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListC6.items.splice(indexSelects, 1, dataObj);
                    setDataListC6({ ...dataListC6 });
                    hideModalC6();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectD8 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListD8.items.splice(indexSelects, 1, dataObj);
              setDataListD8({ ...dataListD8 });
              hideModalD8();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 10,
                      marginTop: screenInfo.width > 500 ? 4 : 10,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalD8();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectD8}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalD8(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListD8.items.splice(indexSelects, 1, dataObj);
                    setDataListD8({ ...dataListD8 });
                    hideModalD8();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectO9 = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListO9.items.splice(indexSelects, 1, dataObj);
              setDataListO9({ ...dataListO9 });
              hideModalO9();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 10,
                      marginTop: screenInfo.width > 500 ? 4 : 10,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalO9();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectO9}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalO9(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width > 500 ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListO9.items.splice(indexSelects, 1, dataObj);
                    setDataListO9({ ...dataListO9 });
                    hideModalO9();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const BuildDropDownSelectR = (
    indexSelect: any,
    item: any,
    dataSelect: any,
    dataItem: any,
  ) => {
    let listItem: any = [];
    if (item && item?.length > 0) {
      item?.forEach((val: any, index: any) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              const dataObj = { ...dataItem, ...{ codeDescription: val.value } };
              dataListR.items.splice(indexSelects, 1, dataObj);
              setDataListR({ ...dataListR });
              hideModalR();
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
              <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: screenInfo.width > 500 ? 18 : 10,
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
    let dataLabel;
    if (item && item?.length > 0) {
      dataLabel = item.filter(
        (val: { value: any; label: any }) => val.value === dataSelect,
      )[0];
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            // width: 220,
            height: 40,
            borderRadius: 8,
            paddingTop: 4,
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onPress={() => {
            setDataSelects(dataSelect);
            setIdexSelects(indexSelect);
            showModalR();
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <View style={[{ paddingTop: 8 }]}>
                <Text
                  style={[
                    {
                      fontFamily: Fonts.Prompt_Light,
                      fontSize: screenInfo.width > 500 ? 16 : 10,
                      color: COLOR.white,
                      marginTop: -4,
                    },
                  ]}>
                  {dataLabel
                    ? screenInfo.width > 500 ? dataLabel.label.substring(0, 20 - 3) + '...' : dataLabel.label
                    : 'สาเหตุ'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: screenInfo.width > 500 ? 690 : screenInfo.width - 10, height: 580, borderRadius: 15 }}
            visible={visibleSelectR}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModalR(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={{ paddingLeft: screenInfo.width > 500 ? 40 : 5, paddingRight: screenInfo.width > 500 ? 40 : 5 }}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataListR.items.splice(indexSelects, 1, dataObj);
                    setDataListR({ ...dataListR });
                    hideModalR();
                  }}
                  value={dataSelects}>
                  <SafeAreaView style={{ height: 500 }}>
                    <FlatList
                      data={listItem}
                      initialNumToRender={5}
                      renderItem={renderItemDropDownSelect}
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

  const renderItem = ({ item, index }: any) => {
    return item;
  };

  const _onClickCameraModels = () => {
    setVisibleCamera(!visibleCamera);
  };

  const _removeImage = async (keyName: any, index: any) => {
    let value = fileData[keyName][index];
    fileData[keyName] = fileData[keyName].splice(
      fileData[keyName].indexOf(value),
      1,
    );
    setFileData({ ...fileData });
    if (value.formatType == 'url') {
      await removeImagesVisitInspector(value.uri);
    }
  };

  const uploadImageCheckList = async (keyNameId: any) => {
    try {
      if (keyNameId) {
        setLoading(true);
        if (fileData[keyNameId]) {
          let imageUrl: any = [];
          for (const [index, keyName] of Object.keys(
            fileData[keyNameId],
          ).entries()) {
            if (fileData[keyNameId][index].formatType === 'file') {
              const result: any = await uploadImageVisitInspect(
                fileData[keyNameId][index],
                orderId,
                props.workOrderData.workType,
              );

              let imageResponse = {
                fileName: '',
                fileSize: 0,
                height: 0,
                type: '',
                uri: result?.fileDisplay,
                width: 0,
                key: `${keyNameId}`,
                formatType: 'url',
              };
              imageUrl.push({ ...fileData[keyNameId][index], ...imageResponse });
            } else {
              imageUrl.push(fileData[keyNameId][index]);
            }
          }

          fileData[keyNameId] = imageUrl;
          setFileData({ ...fileData });
          _onClickCameraModels();
          setLoading(false);
        }
      } else {
        _onClickCameraModels();
      }
    } catch (error) { }
  };

  const CameraModels = () => {
    return (
      <View>
        <View>
          <Modal
            transparent
            maskClosable
            style={{ width: 690, height: 580, borderRadius: 15 }}
            visible={visibleCamera}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    _onClickCameraModels(), setCheckListCamera('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View>
                <Text style={styles.text_title_camera}>
                  รูปถ่าย{checkListCamera?.title} 3 รูป
                </Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 60, marginTop: 40 }}>
                {fileData[checkListCamera?.id]
                  ? fileData[checkListCamera?.id].map((val: any, inx: any) => {
                    return (
                      <View key={`image-${inx}`}>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Icon
                            onPress={() =>
                              _removeImage(checkListCamera?.id, inx)
                            }
                            name="close"
                            size={20}></Icon>
                        </View>
                        <Lightbox
                          activeProps={{ height: screenHeight, width: 'auto' }}>
                          <Image
                            style={{
                              height: 150,
                              width: 150,
                              borderRadius: 20,
                              marginLeft: inx == 0 ? 0 : 20,
                            }}
                            source={{
                              uri: val?.uri,
                            }}
                          />
                        </Lightbox>
                      </View>
                    );
                  })
                  : null}
                {!fileData[checkListCamera?.id] ||
                  fileData[checkListCamera?.id].length < 3 ? (
                  <TouchableHighlight
                    onPress={() => {
                      setIsVisible(!isVisible);
                    }}
                    underlayColor="none">
                    <View
                      style={{
                        marginTop: 20,
                        marginLeft: 20,
                        width: 150,
                        height: 150,
                        borderColor: COLOR.gray,
                        borderRadius: 20,
                        borderStyle: 'dotted',
                        borderWidth: 4,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          name={'plus'}
                          size={100}
                          color={COLOR.secondary_primary_color}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                ) : null}
              </View>
              <View
                style={[
                  {
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingBottom: 100,
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                <Button
                  style={[styles.btn, { padding: 6, width: 350 }]}
                  onPress={() => {
                    uploadImageCheckList(checkListCamera?.id);
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontFamily: Fonts.Prompt_Medium,
                    }}>
                    บันทึกรูปภาพ
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  };

  const dateTimePickerModalW3 = (item: any) => {
    return (
      <DateTimePickerModal
        isVisible={dataListW3DatePicker}
        mode="date"
        onConfirm={date => {
          setDataListW3DatePicker(!dataListW3DatePicker);
          const dateTime = moment(date)
            .locale('th')
            .add(543, 'year')
            .format('DD/MM/YYYY');
          const dataObj = {
            ...itemSelects,
            ...{ textDescription: dateTime },
          };
          dataListW3.items.splice(indexSelectDate, 1, dataObj);
          setDataListW3({ ...dataListW3 });
          setIndexSelectDate('');
          setItemSelect('');
        }}
        onCancel={() => setDataListW3DatePicker(!dataListW3DatePicker)}
      />
    );
  };

  const dataListL1FlatList = () => {
    let listData = [];
    if (dataListL1) {
      const dataListL1Item = dataListL1.items;
      for (let index = 0; index < dataListL1Item.length; index++) {
        let item = dataListL1Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListL1.items.splice(index, 1, dataObj);
                      setDataListL1({ ...dataListL1 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <><View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListL1.items.splice(index, 1, dataObj);
                                setDataListL1({ ...dataListL1 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 170 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListL1DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 180 : 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListL1DatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListL1DatePicker(!dataListL1DatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...item,
                                ...{ textDescription: dateTime },
                              };
                              dataListL1.items.splice(index, 1, dataObj);
                              setDataListL1({ ...dataListL1 });
                              setIndexSelectDate('');
                              setItemSelect('');
                            }}
                            onCancel={() =>
                              setDataListL1DatePicker(!dataListL1DatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListL1.items.splice(index, 1, dataObj);
                                setDataListL1({ ...dataListL1 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 180 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
                </>
              )}
            </View>
            {item?.measure == 'false' && screenInfo.width > 500 ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectL1(
                    index,
                    dataListL1.L1,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>
          {item?.measure == 'false' && screenInfo.width <= 500 ? (
            <View
              style={{ flex: 0.28, marginTop: 8 }}
              key={`view-dropdownSelect2-${index}`}>
              {item.type == 'radio' &&
                BuildDropDownSelectL1(
                  index,
                  dataListL1.L1,
                  item?.codeDescription,
                  item,
                )}
            </View>
          ) : (
            <View
              style={{ flex: 0.28 }}
              key={`view-dropdownSelect2-${index}`}></View>
          )}
        </>
        );
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-L1`}>
        <Card.Content key={`card-content-L1`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListL1 && dataListL1.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                onPress={() => {
                  setCheckListCamera(dataListL1);
                  _onClickCameraModels();
                }}
                name={'camera'}
                size={26}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-l1`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListL1FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListW3FlatList = () => {
    let listData = [];
    if (dataListW3) {
      const dataListW3Item = dataListW3.items;
      for (let index = 0; index < dataListW3Item.length; index++) {
        let item = dataListW3Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListW3.items.splice(index, 1, dataObj);
                      setDataListW3({ ...dataListW3 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListW3.items.splice(index, 1, dataObj);
                                setDataListW3({ ...dataListW3 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListW3DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 150 : 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                          {dateTimePickerModalW3(
                            dataListW3.items[indexSelects],
                          )}
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListW3.items.splice(index, 1, dataObj);
                                setDataListW3({ ...dataListW3 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {item?.measure == 'false' && screenInfo.width > 500 ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectW3(
                    index,
                    dataListW3.W3,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>
          {screenInfo.width <= 500 ?
            <View style={{ flexDirection: 'row' }} key={`input-action2-${index}`}>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 4, marginTop: 8 }}
                  key={`view-dropdownSelect2-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectW3(
                      index,
                      dataListW3.W3,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 4 }}
                  key={`view-dropdownSelect2-${index}`}></View>
              )}
            </View> : null}
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-W3`}>
        <Card.Content key={`card-content-L1`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListW3 && dataListW3.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                onPress={() => {
                  setCheckListCamera(dataListW3);
                  _onClickCameraModels();
                }}
                size={26}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-w3`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListS4FlatList = () => {
    let listData = [];
    if (dataListS4) {
      const dataListS4Item = dataListS4.items;
      for (let index = 0; index < dataListS4Item.length; index++) {
        let item = dataListS4Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListS4.items.splice(index, 1, dataObj);
                      setDataListS4({ ...dataListS4 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListS4.items.splice(index, 1, dataObj);
                                setDataListS4({ ...dataListS4 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListS4DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 150 : 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListS4DatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListS4DatePicker(!dataListS4DatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...indexSelects,
                                ...{ textDescription: dateTime },
                              };
                              dataListS4.items.splice(indexSelects, 1, dataObj);
                              setDataListS4({ ...dataListS4 });
                              setIndexSelectDate('');
                              setItemSelect('');
                            }}
                            onCancel={() =>
                              setDataListS4DatePicker(!dataListS4DatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListS4.items.splice(index, 1, dataObj);
                                setDataListS4({ ...dataListS4 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width > 500 ? 400 : 150,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {item?.measure == 'false' && screenInfo.width > 500 ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectS4(
                    index,
                    dataListS4.S4,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>
          {screenInfo.width <= 500 ?
            <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 4, marginTop: 8 }}
                  key={`view-dropdownSelect-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectS4(
                      index,
                      dataListS4.S4,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 4 }}
                  key={`view-dropdownSelect-${index}`}></View>
              )}
            </View> : null
          }
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-S4`}>
        <Card.Content key={`card-content-S4`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListS4 && dataListS4.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                size={26}
                onPress={() => {
                  setCheckListCamera(dataListS4);
                  _onClickCameraModels();
                }}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-S4`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListS5FlatList = () => {
    let listData = [];
    if (dataListS5) {
      const dataListS5Item = dataListS5.items;
      for (let index = 0; index < dataListS5Item.length; index++) {
        let item = dataListS5Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListS5.items.splice(index, 1, dataObj);
                      setDataListS5({ ...dataListS5 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: screenInfo.width > 500 ? 18 : 10 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListS5.items.splice(index, 1, dataObj);
                                setDataListS5({ ...dataListS5 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListS5DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 150 : 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListS5DatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListS5DatePicker(!dataListS5DatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...itemSelects,
                                ...{ textDescription: dateTime },
                              };
                              dataListS5.items.splice(indexSelects, 1, dataObj);
                              setDataListS5({ ...dataListS5 });
                              setIndexSelectDate('');
                            }}
                            onCancel={() =>
                              setDataListS5DatePicker(!dataListS5DatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListS5.items.splice(index, 1, dataObj);
                                setDataListS5({ ...dataListS5 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {item?.measure == 'false' && screenInfo.width > 500 ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectS5(
                    index,
                    dataListS5.S5,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>
          {screenInfo.width <= 500 ? (<View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            {item?.measure == 'false' ? (
              <View
                style={{ flex: 4, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectS5(
                    index,
                    dataListS5.S5,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 4 }}
                key={`view-dropdownSelect-${index}`}></View>)}
          </View>) : nul}
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-S5`}>
        <Card.Content key={`card-content-S5`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListS5 && dataListS5.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                size={26}
                onPress={() => {
                  setCheckListCamera(dataListS5);
                  _onClickCameraModels();
                }}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-S5`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListC6FlatList = () => {
    let listData = [];
    if (dataListC6) {
      const dataListC6Item = dataListC6.items;
      for (let index = 0; index < dataListC6Item.length; index++) {
        let item = dataListC6Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListC6.items.splice(index, 1, dataObj);
                      setDataListC6({ ...dataListC6 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListC6.items.splice(index, 1, dataObj);
                                setDataListC6({ ...dataListC6 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 0,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListC6DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 150 : 400 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListC6DatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListC6DatePicker(!dataListC6DatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...itemSelects,
                                ...{ textDescription: dateTime },
                              };
                              dataListC6.items.splice(indexSelects, 1, dataObj);
                              setDataListC6({ ...dataListC6 });

                              setIndexSelectDate('');
                            }}
                            onCancel={() =>
                              setDataListC6DatePicker(!dataListC6DatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListC6.items.splice(index, 1, dataObj);
                                setDataListC6({ ...dataListC6 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {item?.measure == 'false' && screenInfo.width > 500 ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectC6(
                    index,
                    dataListC6.C6,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : screenInfo.width > 500 ? (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            ) : null}
          </View>
          {screenInfo.width <= 500 && (
            <View style={{ flexDirection: 'row' }} key={`input-action2-${index}`}>
              {item.measure == 'false' ? (
                <View
                  style={{ flex: 4, marginTop: 8 }}
                  key={`view-dropdownSelect2-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectC6(
                      index,
                      dataListC6.C6,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) :
                (<View
                  style={{ flex: 4 }}
                  key={`view-dropdownSelect2-${index}`}></View>)
              }
            </View>
          )}
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-C6`}>
        <Card.Content key={`card-content-C6`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListC6 && dataListC6.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                size={26}
                onPress={() => {
                  setCheckListCamera(dataListC6);
                  _onClickCameraModels();
                }}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-C6`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListD8FlatList = () => {
    let listData = [];
    if (dataListD8) {
      const dataListD8Item = dataListD8.items;
      for (let index = 0; index < dataListD8Item.length; index++) {
        let item = dataListD8Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListD8.items.splice(index, 1, dataObj);
                      setDataListD8({ ...dataListD8 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListD8.items.splice(index, 1, dataObj);
                                setDataListD8({ ...dataListD8 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListD8DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListD8DatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListD8DatePicker(!dataListD8DatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...itemSelects,
                                ...{ textDescription: dateTime },
                              };
                              dataListD8.items.splice(indexSelects, 1, dataObj);
                              setDataListD8({ ...dataListD8 });
                              setIndexSelectDate('');
                              setItemSelect('');
                            }}
                            onCancel={() =>
                              setDataListD8DatePicker(!dataListD8DatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListD8.items.splice(index, 1, dataObj);
                                setDataListD8({ ...dataListD8 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {item?.measure == 'false' ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelectD8(
                    index,
                    dataListD8.D8,
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>
          {screenInfo.width > 500 && (
            <View style={{ flexDirection: 'row' }} key={`input-action2-${index}`}>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 4, marginTop: 8 }}
                  key={`view-dropdownSelect2-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectD8(
                      index,
                      dataListD8.D8,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 4 }}
                  key={`view-dropdownSelect2-${index}`}></View>
              )}
            </View>
          )}
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-D8`}>
        <Card.Content key={`card-content-D8`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListD8 && dataListD8.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                size={26}
                onPress={() => {
                  setCheckListCamera(dataListD8);
                  _onClickCameraModels();
                }}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-D8`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListO9FlatList = () => {
    let listData = [];
    if (dataListO9) {
      const dataListO9Item = dataListO9.items;
      for (let index = 0; index < dataListO9Item.length; index++) {
        let item = dataListO9Item[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListO9.items.splice(index, 1, dataObj);
                      setDataListO9({ ...dataListO9 });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: screenInfo.width > 500 ? 16 : 10,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListO9.items.splice(index, 1, dataObj);
                                setDataListO9({ ...dataListO9 });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListO9DatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 150 : 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListO9DatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListO9DatePicker(!dataListO9DatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...itemSelects,
                                ...{ textDescription: dateTime },
                              };
                              dataListO9.items.splice(indexSelects, 1, dataObj);
                              setDataListO9({ ...dataListO9 });
                              setIndexSelectDate('');
                            }}
                            onCancel={() =>
                              setDataListO9DatePicker(!dataListO9DatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListO9.items.splice(index, 1, dataObj);
                                setDataListO9({ ...dataListO9 });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {screenInfo.width > 500 ? (<>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 0.28, marginTop: 8 }}
                  key={`view-dropdownSelect-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectO9(
                      index,
                      dataListO9.O9,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 0.28 }}
                  key={`view-dropdownSelect-${index}`}></View>
              )}</>) : null}
          </View>
          {screenInfo.width <= 500 ? (
            <View style={{ flexDirection: 'row' }} key={`input-action2-${index}`}>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 4, marginTop: 8 }}
                  key={`view-dropdownSelect2-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectO9(
                      index,
                      dataListO9.O9,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 4 }}
                  key={`view-dropdownSelect2-${index}`}></View>
              )}
            </View>
          ) : null}
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-09`}>
        <Card.Content key={`card-content-09`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListO9 && dataListO9.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                size={26}
                onPress={() => {
                  setCheckListCamera(dataListO9);
                  _onClickCameraModels();
                }}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-09`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const dataListRFlatList = () => {
    let listData = [];
    if (dataListR) {
      const dataListRItem = dataListR.items;
      for (let index = 0; index < dataListRItem.length; index++) {
        let item = dataListRItem[index];
        listData.push(<>
          <View style={{ flexDirection: 'row' }} key={`input-action-${index}`}>
            <View style={{ flex: 1 }}>
              {item.type == 'radio' ? (
                <View>
                  <RadioButton.Group
                    onValueChange={val => {
                      let dataObj;
                      if (val == 'true') {
                        dataObj = {
                          ...item,
                          ...{ measure: val, codeDescription: '' },
                        };
                      } else {
                        dataObj = { ...item, ...{ measure: val } };
                      }
                      dataListR.items.splice(index, 1, dataObj);
                      setDataListR({ ...dataListR });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={{
                            fontSize: screenInfo.width > 500 ? 16 : 10,
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }}>
                          {item?.title}
                          {errorValidate && item?.measure === null ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                          {errorValidate &&
                            item?.measure === 'false' &&
                            item?.codeDescription == '' ? (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={{ flex: 1.6 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="false" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 4 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }}>
                      {item?.title}
                      {errorValidate &&
                        item?.textDescription === '' &&
                        item?.inputType != 'date' ? (
                        <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                      ) : null}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ marginTop: -18 }}>
                      {item?.inputType === 'number' ? (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListR.items.splice(index, 1, dataObj);
                                setDataListR({ ...dataListR });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      ) : item?.inputType === 'date' ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setDataListRDatePicker(true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={{ width: screenInfo.width < 500 ? 150 : 450 }}>
                            <View style={styles.btn_date}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.secondary_primary_color}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          <DateTimePickerModal
                            isVisible={dataListRDatePicker}
                            mode="date"
                            onConfirm={date => {
                              setDataListRDatePicker(!dataListRDatePicker);
                              const dateTime = moment(date)
                                .locale('th')
                                .add(543, 'year')
                                .format('DD/MM/YYYY');
                              const dataObj = {
                                ...itemSelects,
                                ...{ textDescription: dateTime },
                              };
                              dataListR.items.splice(indexSelects, 1, dataObj);
                              setDataListR({ ...dataListR });
                              setIndexSelectDate('');
                              setItemSelect('');
                            }}
                            onCancel={() =>
                              setDataListRDatePicker(!dataListRDatePicker)
                            }
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              placeholder="ระบุ"
                              value={`${item?.textDescription}`}
                              onChangeText={(text: any) => {
                                const dataObj = {
                                  ...item,
                                  ...{ textDescription: text },
                                };
                                dataListR.items.splice(index, 1, dataObj);
                                setDataListR({ ...dataListR });
                              }}
                              style={[
                                {
                                  height: 40,
                                  width: screenInfo.width < 500 ? 150 : 400,
                                  paddingLeft: 20,
                                  fontSize: screenInfo.width > 500 ? 14 : 10,
                                  borderRadius: 12,
                                },
                                errorValidate && item?.textDescription === ''
                                  ? {
                                    borderColor: 'red',
                                    borderWidth: 1,
                                  }
                                  : null,
                              ]}
                              keyInput={`textInputComponent-${index}`}
                            />
                          )}
                          name={`l1-${index}-input`}
                          defaultValue={item?.textDescription}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
            {screenInfo.width > 500 && (<>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 0.28, marginTop: 8 }}
                  key={`view-dropdownSelect-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectR(
                      index,
                      dataListR.R,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 0.28 }}
                  key={`view-dropdownSelect-${index}`}></View>
              )}
            </>)}
          </View>
          {screenInfo.width <= 500 && (
            <View style={{ flexDirection: 'row' }} key={`input-action2-${index}`}>
              {item?.measure == 'false' ? (
                <View
                  style={{ flex: 4, marginTop: 8 }}
                  key={`view-dropdownSelect2-${index}`}>
                  {item.type == 'radio' &&
                    BuildDropDownSelectR(
                      index,
                      dataListR.R,
                      item?.codeDescription,
                      item,
                    )}
                </View>
              ) : (
                <View
                  style={{ flex: 4 }}
                  key={`view-dropdownSelect2-${index}`}></View>
              )}
            </View>
          )}
        </>);
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup-R`}>
        <Card.Content key={`card-content-09`}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.text_btn_date}>
                {dataListR && dataListR.title}
              </Text>
            </View>
            <View style={{ left: -6, marginTop: 8 }}>
              <Icon
                name={'camera'}
                size={26}
                onPress={() => {
                  setCheckListCamera(dataListR);
                  _onClickCameraModels();
                }}
                color={COLOR.secondary_primary_color}
              />
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}-R`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListW3FlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const Contents = () => {
    return (
      <View>
        <View style={styles.headerListView}>
          <Text style={styles.headerListText}>Checking List</Text>
        </View>
        {dataListL1 && dataListL1?.items?.length > 0
          ? dataListL1FlatList()
          : null}
        {dataListW3 && dataListW3?.items?.length > 0
          ? dataListW3FlatList()
          : null}
        {dataListS4 && dataListS4?.items?.length > 0
          ? dataListS4FlatList()
          : null}
        {dataListS5 && dataListS5?.items?.length > 0
          ? dataListS5FlatList()
          : null}
        {dataListC6 && dataListC6?.items?.length > 0
          ? dataListC6FlatList()
          : null}
        {dataListD8 && dataListD8?.items?.length > 0
          ? dataListD8FlatList()
          : null}
        {dataListO9 && dataListO9?.items?.length > 0
          ? dataListO9FlatList()
          : null}
        {dataListR && dataListR?.items?.length > 0 ? dataListRFlatList() : null}
        {['ZC01', 'BN01'].includes(props.workOrderData.type.toUpperCase()) ? (
          <View>
            <View
              style={{
                ...styles.headerListView,
                borderTopWidth: 1,
                borderColor: COLOR.gray,
              }}>
              <Text style={styles.headerListText}>PM Checking List</Text>
            </View>
            <InspectorWorkOrderCheckListPMPage
              qiSubmit={props.workOrderData.webStatus === '4' ? null : onSubmit}
              errorValidate={errorValidate}
              orderId={props.workOrderData.orderId}
              webStatus={props.workOrderData.webStatus}
            />
          </View>
        ) : (
          <View
            style={[
              {
                paddingLeft: 40,
                paddingRight: 40,
                paddingBottom: 100,
                alignItems: 'center',
                alignSelf: 'center',
              },
            ]}>
            {props.workOrderData.webStatus != '4' ? (
              <Button
                style={[styles.btn, { padding: 6, width: 350 }]}
                onPress={() =>
                  props.workOrderData.webStatus === '4' ? null : onSubmit()
                }>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  บันทึก
                </Text>
              </Button>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {/* <AppBar
        title="CheckList"
        rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar> */}

      {/* <SafeAreaView > */}
      <FlatList
        data={null}
        listKey={moment().valueOf().toString()}
        renderItem={null}
        ListHeaderComponent={Contents()}
        ListFooterComponent={<View></View>}
      />
      {/* </SafeAreaView> */}
      {CameraModels()}
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        {list.map((l, i) =>
          i == 0 ? (
            <ListItem key={i} containerStyle={l?.containerStyle}>
              <View>
                <Icon name={l.icons} />
              </View>
              <View>
                <Text onPress={l.onPress} style={{ fontSize: 18 }}>
                  {l.title}
                </Text>
              </View>
            </ListItem>
          ) : (
            <ListItem
              key={i}
              containerStyle={l?.containerStyle}
              onPress={l.onPress}>
              <View>
                <Icon name={l.icons} />
              </View>
              <View>
                <Text style={{ fontSize: 18 }}>{l.title}</Text>
              </View>
            </ListItem>
          ),
        )}
      </BottomSheet>
      <Loading loading={isLoading} />
    </>
  );
};

const stylesLg = StyleSheet.create({
  headerListView: {
    height: 70,
    backgroundColor: 'rgb(246, 246, 246)',
    color: COLOR.secondary_primary_color,
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: COLOR.gray,
  },
  headerListText: {
    fontSize: 20,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
    fontWeight: 'bold',
  },
  marginTop: { marginTop: 5 },
  btn: {
    width: '100%',
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
  textTitle: {
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 16,
  },
  textLabel: {
    marginTop: 6,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 16,
  },
  btn_date: {
    width: 400,
    height: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: COLOR.secondary_primary_color,
    marginTop: 20,
    borderRadius: 12,
    left: 20,
    fontFamily: Fonts.Prompt_Medium,
    backgroundColor: COLOR.white,
  },
  text_btn_date: {
    fontSize: 16,
    padding: 6,
    marginLeft: 10,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
  },
  text_title_camera: {
    fontSize: 22,
    padding: 6,
    marginLeft: 10,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
  },
});

const stylesSm = StyleSheet.create({
  headerListView: {
    height: 70,
    backgroundColor: 'rgb(246, 246, 246)',
    color: COLOR.secondary_primary_color,
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: COLOR.gray,
  },
  headerListText: {
    fontSize: 14,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
    fontWeight: 'bold',
  },
  marginTop: { marginTop: 5 },
  btn: {
    width: '100%',
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
  textTitle: {
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 12,
  },
  textLabel: {
    marginTop: 6,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 10,
  },
  btn_date: {
    width: 150,
    height: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: COLOR.secondary_primary_color,
    marginTop: 20,
    borderRadius: 12,
    left: 20,
    fontFamily: Fonts.Prompt_Medium,
    backgroundColor: COLOR.white,
  },
  text_btn_date: {
    fontSize: 12,
    padding: 6,
    marginLeft: 10,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
  },
  text_title_camera: {
    fontSize: 14,
    padding: 6,
    marginLeft: 10,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
  },
});
export default InspectorWorkOrderCheckListPage;
