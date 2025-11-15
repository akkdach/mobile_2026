import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import LocalStorageKey from '../../../constants/LocalStorageKey';
import { ROUTE } from '../../../constants/RoutePath';
import { LoginResponseInterface } from '../../../models/login';
import { fetchCloseQIInformation } from '../../../services/qualityIndexService';
import {
  getCheckListCodeDefectMaster,
  getCheckListService,
  postCheckingListService,
  postPmCheckingListService,
} from '../../../services/work_order_check_list';
import { _getData } from '../../../utils/AsyncStorage';
import WorkOrderPmCheckListPage from '../WorkOrderPmCheckList/WorkOrderPmCheckList';
import WorkOrderQlChecklistItem from './itemCheckList/WorkOrderQlChecklistItem';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  workCenter: string;
  objType: string;
  pmType: string;
  orderTypeDescription: string;
  webStatus: string;
};

const WorkQlChecklist = (props: { workOrderData: InterfaceProps }) => {
  console.log('props.workOrderData::', props.workOrderData);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [allValues, setAllValues] = useState({
    electicalSystem: { measure: 'false', remark: '' },
    waterSystem: { measure: 'false', remark: '' },
    machine: { measure: 'false', remark: '' },
    gmpPestControl: { measure: 'false', remark: '' },
    waterQulity: { measure: 'false', remark: '' },
  });

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

  const changeHandler = (
    name: string,
    args: { measure?: string; remark?: string },
  ) => {
    setAllValues({ ...allValues, [name]: args });
  };

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
      let response = await getCheckListService(props.workOrderData.orderId);
      setTypeOrderCheckList(response.type);
      setDataListL1({ ...response?.L1, ...{ L1: defectMaster?.L1 } });
      setDataListW3({ ...response?.W3, ...{ W3: defectMaster?.W3 } });
      setDataListS4({ ...response?.S4, ...{ S4: defectMaster?.S4 } });
      setDataListS5({ ...response?.S5, ...{ S5: defectMaster?.S5 } });
      setDataListC6({ ...response?.C6, ...{ C6: defectMaster?.C6 } });
      setDataListD8({ ...response?.D8, ...{ D8: defectMaster?.D8 } });
      setDataListO9({ ...response?.O9, ...{ O9: defectMaster?.O9 } });
      setDataListR({ ...response?.R, ...{ R: defectMaster?.R } });
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
        Actions.push(ROUTE.QUALITY_INDEX, props);
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
    setIsLoading(true);
    Alert.alert('แจ้งเตือน', 'ต้องการบันทึกข้อมูลใช่หรือไม่ ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
        onPress: async () => {
          setIsSubmit(false);
        },
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          setIsSubmit(true);
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
          setIsSubmit(false);

          try {
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
                        setIsLoading(false);
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
                      } else {
                        if (itemData['measure'] === null) {
                          checkValidate = true;
                          setIsLoading(false);
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
                      itemData['inputType'] != 'date'
                    ) {
                      if (itemData['textDescription'] === '') {
                        checkValidate = true;
                        setIsLoading(false);
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
                      }
                    }
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
                if (
                  Object.prototype.hasOwnProperty.call(pmCheckListValue, key)
                ) {
                  if (pmCheckListValue[key]['measure'] === '') {
                    setErrorValidate(true);
                    alertError();
                    return;
                  }
                }
              }
            }

            const result: any = await _getData({ key: LocalStorageKey.userInfo });
            const userInformation = JSON.parse(result);
            const user = new LoginResponseInterface(userInformation);
            setErrorValidate(false);
            postCheckingList(
              itemQiCheckListConvertData,
              user.role,
              pmCheckListValue,
            );
          } catch (error) {
            console.log('error ====>', error);
          }
        },
      },
    ]);
  };

  const alertError = () => {
    Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน ?', [
      {
        text: 'ตกลง',
        onPress: async () => {
          setIsLoading(false);
        },
      },
    ]);
  };

  const postCheckingList = async (
    data: any,
    role: any,
    pmCheckListValue: any,
  ) => {
    let payload = {
      ...{ workOrderCheckingList: [...data] },
      ...{ orderId: props.workOrderData.orderId, commentType: role },
    };
    try {
      let response = await postCheckingListService(payload);
      if (response.isSuccess) {
        if (
          props.workOrderData.type.toUpperCase() === 'ZC01' ||
          props.workOrderData.type.toUpperCase() === 'BN01'
        ) {
          setIsLoading(true);
          postPmCheckingList(pmCheckListValue, role);
        } else {
          setIsLoading(true);
          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
            {
              text: 'ปิด',
              onPress: async () => {
                Actions.pop()
              }
            },
          ]);
        }
      }
      setIsLoading(true);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ตกลง',
          onPress: async () => {
            Actions.pop();
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
      ...{ orderId: props.workOrderData.orderId, commentedUserType: role },
    };
    setIsLoading(true);
    try {
      let response = await postPmCheckingListService(payload);
      if (response.isSuccess) {
        if (
          props.workOrderData.type === 'ZC01' ||
          props.workOrderData.type === 'BN01'
        ) {
          const isValidateObjType =
            ['TPX', 'NPX', 'TFCB', 'NFCB'].indexOf(
              props.workOrderData.objType,
            ) >= 0;
          const isValidatePmType =
            props.workOrderData.pmType === 'PME' ||
            props.workOrderData.pmType === 'PMM';
          if (isValidateObjType && isValidatePmType) {
            Actions.push(ROUTE.QUALITY_INDEX, props);
          } else {
            await fetchCloseQIInformation(props.workOrderData.orderId);
            Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
              {
                text: 'ปิด',
                onPress: async () => Actions.pop(),
              },
            ]);
          }
        } else {
          await fetchCloseQIInformation(props.workOrderData.orderId);
          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
            {
              text: 'ปิด',
              onPress: async () => Actions.pop(),
            },
          ]);
        }
      } else {
        Alert.alert('แจ้งเตือน', response.message, [
          {
            text: 'ตกลง',
            onPress: async () => { },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ตกลง',
          onPress: async () => { },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const responseDataList = (data: any, type: any) => {
    switch (type) {
      case 'L1':
        setDataListL1(data);
        break;
      case 'W3':
        setDataListW3(data);
        break;
      case 'S4':
        setDataListS4(data);
        break;
      case 'S5':
        setDataListS5(data);
        break;
      case 'C6':
        setDataListC6(data);
        break;
      case 'D8':
        setDataListD8(data);
        break;
      case 'O9':
        setDataListO9(data);
        break;
      case 'R':
        setDataListR(data);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {ScreenWidth >= 500 && <AppBar
        title="Check List"
        rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar>}
      {ScreenWidth < 500 && <AppBar
        title={`Check List ${props.workOrderData.orderId}`}
      ></AppBar>}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListL1}
              keyItem={'L1'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListW3}
              keyItem={'W3'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListS4}
              keyItem={'S4'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListS5}
              keyItem={'S5'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListC6}
              keyItem={'C6'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListD8}
              keyItem={'D8'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListO9}
              keyItem={'O9'}
              isValidate={errorValidate}
            />
            <WorkOrderQlChecklistItem
              isSubmit={isSubmit}
              submitData={responseDataList}
              dataListItem={dataListR}
              keyItem={'R'}
              isValidate={errorValidate}
            />
          </View>
          <View>
            {['ZC01', 'BN01'].includes(
              props.workOrderData.type.toUpperCase(),
            ) ? (
              <View>
                <View
                  style={{
                    ...styles.headerListView,
                    borderTopWidth: 1,
                    borderColor: COLOR.gray,
                  }}>
                  <Text style={styles.headerListText}>PM Checking List</Text>
                </View>
                <WorkOrderPmCheckListPage
                  qiSubmit={onSubmit}
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
                    onPress={() => onSubmit()}>
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
        </ScrollView>
      </SafeAreaView>
      <Loading loading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default WorkQlChecklist;
