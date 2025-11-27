import { Button } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, set, useForm } from 'react-hook-form';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Animated from 'react-native-reanimated';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import DropdownSelect from '../../components/DropdownSelect';
import Loading from '../../components/loading';
import styleSheet from '../../components/StyleSheet';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { ROUTE } from '../../constants/RoutePath';
import {
  fetchCloseQIInformation,
  getQualityIndex,
  getQualityIndexMaster,
  postQualityIndex,
} from '../../services/qualityIndexService';
import styles from './QualityIndexNonCSDCSS';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
  };
};
const options = [
  { label: 'วัด QI ได้', value: 'yes' },
  { label: 'วัด QI ไม่ได้', value: 'no' },
];

const QualityIndexNonCSD = (props: InterfaceProps) => {

  const [canMeasureQI, setCanMeasureQI] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string | null>('yes');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const navigation = useNavigation();

  let defectMaster = [
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
  ];

  let defectItemMaster = [
    { qualityIndex_Taste: { check: 0, pass: 0, defectCount: 0, percent: 0, type: 'NON CSD' } },
    { qualityIndex_BrixRatio: { check: 0, pass: 0, defectCount: 0, percent: 0, type: 'NON CSD' } },
    { qualityIndex_Temp: { check: 0, pass: 0, defectCount: 0, percent: 0, type: 'NON CSD' } },
    { qualityIndex_OvCarbo: { check: 0, pass: 0, defectCount: 0, percent: 0, type: 'NON CSD' } },
    { qualityIndex_Age: { check: 0, pass: 0, defectCount: 0, percent: 0, type: 'NON CSD' } },
  ];



  const { orderId } = props?.workOrderData;
  const [numberMachineHeads, setNumberMachineHeads] = useState<any>(0);
  const [itemsOrderCode, setItemsOrderCode] = useState<any>();
  const [qiResult, setQIResult] = useState<any>(0.0);
  const [qiResultCsd, setQIResultCsd] = useState<any>(0.0);
  const [qiResultTotal, setQIResultTotal] = useState<any>(0.0);
  const [taste, setTaste] = useState<any>(0.0);
  const { control, getValues, setValue } = useForm<any>();
  const [isLoading, setIsLoading] = useState(false);


  const [defectValue, setDefectValue] = useState<any>([
    { defectDetail: defectMaster },
    { defectDetail: defectMaster },
    { defectDetail: defectMaster },
    { defectDetail: defectMaster },
    { defectDetail: defectMaster },
  ]);

  const [defectItem, setDefectItem] = useState<any>(defectItemMaster);

  useEffect(() => {
    Orientation.lockToLandscapeRight();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const result = await getQualityIndexMaster('NON CSD');
      if (result) {
        setItemsOrderCode(result);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await getQualityIndex(orderId, 'NON CSD');
        console.log('response data', response.data);
        setSelectedReason(response.data?.qi_reason_non_csd ?? null);
        setQIResultTotal(parseInt(response?.data?.qi_result) == 0 ? response?.data?.qi_result_csd: response?.data?.qi_result);
        setDefectItem(response.defectItem);
        setDefectValue(response.cloneValue);
        setTaste(response?.data?.taste ?? 0);
        setNumberMachineHeads(
          Math.max.apply(
            Math,
            response.defectItem.map((val: any, indexMap: any) =>
              checkValue(indexMap, val, 'defectCount'),
            ),
          ),
        );
        // let qiResult = [];
        // for (const [idx] of response.defectItem.entries()) {
        //   qiResult.push(
        //     Number(checkValue(idx, response.defectItem[idx], 'pass')) /
        //     Number(checkValue(idx, response.defectItem[idx], 'check')) || 0,
        //   );
        // }
        // setQIResult(qiResult.reduce((a: any, b: any) => a * b) * 100);
        setQIResult(response?.data?.qi_result_non_csd ?? 0);
        setQIResultCsd(response?.data?.qi_result_csd ?? 0);
      } catch (error) {
        setDefectItem(defectItemMaster);
      }
    })();
  }, []);

  const _submit = () => {
    try {
      Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ตกลง',
          onPress: async () => {
            defectItem.map((val: any, index: any) => {
              let dataDefault: any = val[`${checkKey(index)}`];
              let defectValueData = [...defectValue[index]['defectDetail']];
              let defectDetail = defectValueData.splice(
                0,
                Number(dataDefault['defectCount']),
              );
              defectItem[index][`${checkKey(index)}`] = {
                ...dataDefault,
                ...{ defectDetail },
              };
            });

            let statusSave = false;
            for (let idx = 0; idx < defectItem.length; idx++) {
              let data: any =
                defectItem[idx][`${checkKey(idx)}`]['defectDetail'];
              if (statusSave) {
                break;
              }
              for (let i = 0; i < data.length; i++) {
                if (data[i]['defectCode'] == '') {
                  statusSave = true;
                  break;
                }
              }
            }
            if (statusSave && selected == 'yes') {
              Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูล defect ให้ครบถ้วน ?', [
                {
                  text: 'ตกลง',
                  onPress: async () => { },
                },
              ]);
              return;
            }
            setIsLoading(true);
            let response = await postQualityIndex(props.workOrderData.orderId, 'NON CSD', !isNaN(Number(qiResult)) ? Number(qiResult).toFixed(2) : '0.00', defectItem, selectedReason ?? '');
            setIsLoading(false);
            if (response.isSuccess) {
              setIsLoading(true);
              await fetchCloseQIInformation(props.workOrderData.orderId);
              setIsLoading(false);
              Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
                {
                  text: 'ปิด',
                  onPress: async () => {
                    // Actions.replace(ROUTE.WORKORDERLIST, props)
                    navigation.dispatch(StackActions.replace(ROUTE.WORKORDERLIST, props))
                  },
                },
              ]);
            }
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ปิด',
          onPress: async () => {
            // Actions.replace(ROUTE.WORKORDERLIST, props)
            navigation.dispatch(StackActions.replace(ROUTE.WORKORDERLIST, props))
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const BuildInput = (name: any, index: any, type: any, values?: any) => {
    setValue(`${name}${type}`, `${values}`);
    return (
      <>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              key={`${name}${type}`}
              style={[
                styleSheet.input,
                {
                  height: 40,
                  width: '100%',
                  marginHorizontal: 0,
                  fontSize: 14,
                  textAlign: 'center',
                  paddingLeft: 0,
                },
              ]}
              value={value}
              keyboardType="numeric"
              maxLength={2}
              onBlur={(e: any) => {
                value = value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '');
                let item: any = [];
                switch (index) {
                  case 0:
                    item = defectItem[index]['qualityIndex_Taste'];
                    break;
                  case 1:
                    item = defectItem[index]['qualityIndex_BrixRatio'];
                    break;
                  case 2:
                    item = defectItem[index]['qualityIndex_Temp'];
                    break;
                  case 3:
                    item = defectItem[index]['qualityIndex_OvCarbo'];
                    break;
                  case 4:
                    item = defectItem[index]['qualityIndex_Age'];
                    break;
                  default:
                    break;
                }

                if (Number(value) <= 10) {
                  if (type === 'Pass') {
                    if (value != '' && Number(item[`check`]) < Number(value)) {
                      item = {
                        ...item,
                        [`pass`]: Number(item[`check`]),
                      };
                      item = {
                        ...item,
                        [`pass`]: Number(item[`check`]),
                        defectCount: Number(item[`check`]) - Number(item[`pass`]),
                        percent: Math.ceil(
                          (Number(item[`pass`]) / Number(item[`check`])) * 100,
                        ),
                      };
                    } else {
                      item = {
                        ...item,
                        [`pass`]: Number(value),
                        defectCount:
                          value != '' ? Number(item[`check`]) - Number(value) : 0,
                        percent: Math.ceil(
                          (Number(value) / Number(item[`check`])) * 100,
                        ),
                      };
                      if (value == '') {
                        item = {
                          ...item,
                          [`check`]: 0,
                          defectCount: 0,
                          percent: 0,
                        };
                        setValue(`${name}Check`, '');
                        const cloneValue = [...defectValue];
                        const clearData = { defectDetail: defectMaster };
                        cloneValue.splice(index, 1, clearData);
                        setDefectValue(cloneValue);
                      }
                    }
                  } else {
                    let valPass = item[`pass`] != '' ? Number(item[`pass`]) : 0;

                    if (Number(valPass) > Number(value)) {
                      item = {
                        ...item,
                        [`check`]: Number(value),
                        [`pass`]: Number(value),
                      };

                      item = {
                        ...item,
                        defectCount: Number(item[`check`]) - Number(item[`pass`]),
                        percent: Math.ceil(
                          Number(Number(item[`pass`]) / Number(value)) * 100,
                        ),
                      };

                      if (value == '') {
                        setValue(`${name}Pass`, '');
                      }

                      const cloneValue = [...defectValue];
                      const clearData = { defectDetail: defectMaster };
                      cloneValue.splice(index, 1, clearData);
                      setDefectValue(cloneValue);
                    } else {
                      item = {
                        ...item,
                        [`check`]: Number(value),
                        defectCount:
                          valPass > 0 && Number(value) > 0
                            ? Number(value) - valPass
                            : 0,
                        percent: Math.ceil(Number(valPass / Number(value)) * 100),
                      };
                    }
                  }
                } else {
                  if (type === 'Pass') {
                    item = {
                      ...item,
                      [`pass`]: 0,
                      defectCount: 0,
                      percent: 0,
                    };
                  } else {
                    item = {
                      ...item,
                      [`check`]: 0,
                      defectCount: 0,
                      percent: 0,
                    };
                  }
                }
                defectItem[index] = { [`${checkKey(index)}`]: item };
                setDefectItem([...defectItem]);
                setNumberMachineHeads(
                  Math.max.apply(
                    Math,
                    defectItem.map((val: any, indexMap: any) =>
                      checkValue(indexMap, val, 'defectCount'),
                    ),
                  ),
                );

                let nameArr = ['Taste', 'BrixRatio"', 'Temp', 'OvCarbo', 'Age'];
                let qiResult = [];
                for (const [idx, name] of nameArr.entries()) {
                  qiResult.push(
                    Number(checkValue(idx, defectItem[idx], 'pass')) /
                    Number(checkValue(idx, defectItem[idx], 'check')) || 0,
                  );
                }
                const validNumbers = qiResult.filter(n => typeof n === 'number' && !isNaN(n) && n > 0);
                console.log('validNumbers', validNumbers);
                const average = validNumbers.length > 0
                  ? validNumbers.reduce((acc, num) => acc * num, 1)
                  : 0;
                var totalCsd = ((parseFloat(qiResultCsd)) * parseInt(taste));
                console.log('totalCsd', totalCsd);
                var totoalNonCsd = ((parseFloat(average) * 100) * parseInt(checkValue(0, defectItem[0], 'check')));
                console.log('totoalNonCsd', totoalNonCsd);
                var totalTase = (parseInt(checkValue(0, defectItem[0], 'check')) + parseInt(taste));
                console.log('totalTase', totalTase);
                console.log('average', average * 100);
                setQIResult(average * 100); // แสดงเป็นเปอร์เซ็นต์
                if (selected == 'yes') {
                  setQIResultTotal((qiResultCsd)); // แสดงเป็นเปอร์เซ็นต์
                } else {
                  setQIResultTotal((totalCsd) / totalTase); // แสดงเป็นเปอร์เซ็นต์
                }

                //   setQIResult(qiResult.reduce((a, b) => {

                //     console.log('qiResult', a, b);
                //     if (b > 0) {
                //       return a * b;
                //     } else {
                //       return 1;
                //     }
                //   }) * 100);
              }}
              onChangeText={textSearch => onChange(textSearch)}
            />
          )}
          name={`${name}${type}`}
          defaultValue=""
        />
      </>
    );
  };


  const checkKey = (index: any) => {
    switch (index) {
      case 0:
        return 'qualityIndex_Taste';
        break;
      case 1:
        return 'qualityIndex_BrixRatio';
        break;
      case 2:
        return 'qualityIndex_Temp';
        break;
      case 3:
        return 'qualityIndex_OvCarbo';
        break;
      case 4:
        return 'qualityIndex_Age';
        break;
      default:
        break;
    }
  };

  const checkValue = (index: any, val: any, key: any) => {
    console.log('val', val)
    switch (index) {
      case 0:
        return val['qualityIndex_Taste'][key] ?? val['qualityIndex_Taste'][key];
      case 1:
        return (
          val['qualityIndex_BrixRatio'][key] ?? val['qualityIndex_Taste'][key]
        );
      case 2:
        return val['qualityIndex_Temp'][key] ?? val['qualityIndex_Taste'][key];
      case 3:
        return (
          val['qualityIndex_OvCarbo'][key] ?? val['qualityIndex_Taste'][key]
        );
      case 4:
        return val['qualityIndex_Age'][key] ?? val['qualityIndex_Taste'][key];
      default:
        break;
    }
  };

  const MemoizedDropdown = React.memo(
    ({ selects, dataItem, onValueChange, length }: any) => {
      return (
        <DropdownSelect
          selects={selects}
          dataItem={dataItem}
          placeholder={'สาเหตุ'}
          textStyle={{
            color: COLOR.white,
            fontSize: 12,
            marginTop: 2,
            paddingLeft: 10,
          }}
          modelContainer={{ maxHeight: 500 }}
          modelStyle={{ paddingLeft: 200, paddingRight: 200 }}
          containerStyle={{
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            height: 40,
            borderRadius: 20,
            alignItems: 'flex-start',
            paddingLeft: 10,
          }}
          maxLimit={length > 5 ? 10 : 20}
          iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
          contentContainerStyle={{ borderRadius: 10 }}
          onValueChange={onValueChange}
        />
      );
    }
  );



  const BuildDropDown = (idx: number, i: number, defectGroup: string, length: number) => {
    const defectCode = defectValue?.[idx]?.defectDetail?.[i]?.defectCode ?? '';

    const dataItem = itemsOrderCode?.[defectGroup] ?? [];
    return (
      <DropdownSelect

        key={`${idx}-${i}-${defectCode}`} // บังคับให้ re-render เมื่อ defectCode เปลี่ยน

        selects={defectCode}
        dataItem={dataItem}
        placeholder={'สาเหตุ'}
        textStyle={{
          color: COLOR.white,
          fontSize: 12,
          marginTop: 2,
          paddingLeft: 10,
        }}
        modelContainer={{ maxHeight: 500 }}
        modelStyle={{ paddingLeft: 200, paddingRight: 200 }}
        containerStyle={{
          backgroundColor: 'rgba(0, 172, 200, 0.6)',
          height: 40,
          borderRadius: 20,
          alignItems: 'flex-start',
          paddingLeft: 10,
        }}
        maxLimit={length > 5 ? 10 : 20}
        iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
        contentContainerStyle={{ borderRadius: 10 }}
        onValueChange={(val: any, index: any, label: any) => {
          const data = {
            defectCode: val,
            defectDetail: label,
          };

          const cloneValue = [...defectValue];
          const newObjArr = [...(defectValue?.[idx]?.defectDetail ?? [])];
          newObjArr.splice(i, 1, data);
          cloneValue[idx] = {
            defectDetail: newObjArr,
          };

          setDefectValue(cloneValue);
        }}
      />
    );
  };

  const BuildTitle = (text: String) => {
    return (
      <Text
        style={{
          fontFamily: Fonts.Prompt_Medium,
          fontSize: 11,
          color: COLOR.gray,
          left: 14,
        }}>
        {text}
      </Text>
    );
  };

  const BuildListCheck = (
    title1: String,
    title2: String,
    title3: String,
    name: String,
    index: any,
  ) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <View style={{ flex: 0.5, marginTop: 10 }}>{BuildTitle(title1)}</View>
        <View
          style={{
            flex: 0.6,
          }}>
          {BuildInput(
            name,
            index,
            'Check',
            checkValue(index, defectItem[index], 'check'),
          )}
        </View>
        {/* <View style={{ flex: 0.5, marginTop: 10 }}>{BuildTitle(title2)}</View> */}
        <View style={{ flex: 0.6 }}>
          {BuildInput(
            name,
            index,
            'Pass',
            checkValue(index, defectItem[index], 'pass'),
          )}
        </View>
        {/* <View style={{ flex: 0.5, marginTop: 10 }}>{BuildTitle(title3)}</View> */}
        <View
          style={{
            flex: 0.6,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: Fonts.Prompt_Light,
              color: COLOR.gray,
            }}>
            {isNaN(checkValue(index, defectItem[index], 'percent'))
              ? 0
              : checkValue(index, defectItem[index], 'percent')}
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }: any) => {
    return item;
  };

  const BuildTableQualityIndex = () => {
    var payments = [];
    var itemRow = [];
    var widthItem: any = 140;

    if (Number(numberMachineHeads) == 1) {
      widthItem = 150;
    } else if (Number(numberMachineHeads) == 2) {
      widthItem = 150;
    } else if (Number(numberMachineHeads) == 3) {
      widthItem = 150;
    } else if (Number(numberMachineHeads) == 4) {
      widthItem = 150;
    }

    for (let i = 0; i < numberMachineHeads; i++) {
      payments.push(
        <View
          key={i}
          style={{
            width: widthItem,
            alignItems: 'center',
            borderTopColor: COLOR.gray,
            borderLeftColor: COLOR.gray,
            borderRightColor:
              i + 1 === numberMachineHeads ? COLOR.gray : COLOR.white,
            borderBottomColor: COLOR.gray,
            borderWidth: 1,
          }}>
          <Text
            style={{
              fontFamily: Fonts.Prompt_Light,
              fontSize: 10,
              marginTop: 20,
              color: COLOR.white,
            }}>
            Defect {i + 1}
          </Text>
        </View>,
      );
    }
    for (let index = 0; index < 5; index++) {
      let dropdownSelect: any = [];
      if (Number(checkValue(index, defectItem[index], 'defectCount')) > 0) {
        for (
          let i = 0;
          i < Number(checkValue(index, defectItem[index], 'defectCount'));
          i++
        ) {

          dropdownSelect.push(
            <View
              key={`${i}-${index}`}
              style={{ width: widthItem, marginTop: 6, paddingLeft: 6 }}>
              {BuildDropDown(
                index,
                i,
                ["Taste", "RatioBrix", "Temp", "OverRunCabonation", "SyrupAge"][index],
                Number(checkValue(index, defectItem[index], 'defectCount')),
              )}
            </View>,
          );

        }
      } else {
        for (let idx = 0; idx < numberMachineHeads; idx++) {
          dropdownSelect.push(
            <View
              key={`${idx}-${index}`}
              style={{
                width: widthItem,
                marginTop: 6,
                paddingLeft: 6,
                height: 40,
              }}></View>,
          );
        }
      }
      itemRow.push(
        <View
          key={`${itemRow}-${new Date().valueOf}`}
          style={{
            flexDirection: 'row',
            marginTop: -2,
            left: 2,
          }}>
          {dropdownSelect}
          <View style={{ width: 6 }}></View>
        </View>,
      );
    }
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: 'column',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', flex: 3, width: '100%' }}>
            <View
              style={{
                backgroundColor: COLOR.secondary_primary_color,
                flexDirection: 'row',
                justifyContent: 'center',
                height: 30,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: 12,
                  marginTop: 4,
                  color: COLOR.white,
                  alignItems: 'center',
                }}>
                Quality Index Non CSD
              </Text>
            </View>
            <View
              style={{
                borderTopColor: COLOR.white,
                borderLeftColor: COLOR.secondary_primary_color,
                borderRightColor: COLOR.secondary_primary_color,
                borderBottomColor: COLOR.secondary_primary_color,
                borderWidth: 1,
                backgroundColor: COLOR.secondary_primary_color,
                flexDirection: 'row',
                justifyContent: 'center',
                height: 30,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderTopColor: COLOR.secondary_primary_color,
                  borderLeftColor: COLOR.secondary_primary_color,
                  borderRightColor: COLOR.white,
                  borderBottomColor: COLOR.secondary_primary_color,
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 14,
                    // marginTop: 2,
                    color: COLOR.white,
                  }}>
                  Title
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderTopColor: COLOR.secondary_primary_color,
                  borderLeftColor: COLOR.secondary_primary_color,
                  borderRightColor: COLOR.white,
                  borderBottomColor: COLOR.secondary_primary_color,
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 12,
                    // marginTop: 2,
                    color: COLOR.white,
                  }}>
                  Check
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderTopColor: COLOR.secondary_primary_color,
                  borderLeftColor: COLOR.secondary_primary_color,
                  borderRightColor: COLOR.white,
                  borderBottomColor: COLOR.secondary_primary_color,
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 12,
                    // marginTop: 2,
                    color: COLOR.white,
                  }}>
                  Pass
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 12,
                    // marginTop: 2,
                    color: COLOR.white,
                    alignItems: 'center',
                  }}>
                  percent%
                </Text>
              </View>
            </View>
            {/* -Pass */}
            {BuildListCheck('TASTE', 'TASTE', 'TASTE', 'teste', 0)}
            {BuildListCheck(
              'BRIX/RATIO',
              'BRIX/RATIO',
              'BRIX/RATIO',
              'brix',
              1,
            )}
            {BuildListCheck('TEMP', 'TEMP', 'TEMP', 'time', 2)}
            {/* {BuildListCheck('OV/CARBO', 'OV/CARBO', 'OV/CARBO', 'ov', 3)} */}
            {BuildListCheck('AGE', 'AGE', 'AGE', 'age', 4)}
          </View>
          {numberMachineHeads > 0 ? (
            <View
              style={{
                flex:
                  Number(numberMachineHeads) == 1
                    ? 1
                    : Number(numberMachineHeads) == 2
                      ? 1.5
                      : 3,
                flexDirection: 'column',
              }}>
              <SafeAreaView>
                <ScrollView horizontal>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: COLOR.gray,
                        height: 60,
                      }}>
                      {/* {payments} */}
                      <FlatList
                        data={payments}
                        renderItem={renderItem}
                        ListFooterComponent={<View></View>}
                      />
                    </View>
                    <FlatList
                      data={itemRow}
                      renderItem={renderItem}
                      ListFooterComponent={<View></View>}
                    />
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
          ) : null}
        </View>
        <View
          style={{
            marginTop: 8,
            flex: 4,
            height: 30,
            flexDirection: 'row',
            backgroundColor: COLOR.secondary_primary_color,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 16,
              }}>
              QI Result Non CSD :
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 16,
              }}>
              {!isNaN(Number(qiResult)) ? Number(qiResult).toFixed(2) : '0.00'}%
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            flex: 4,
            height: 30,
            flexDirection: 'row',
            backgroundColor: COLOR.secondary_primary_color,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 16,
              }}>
              QI Result CSD :
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 16,
              }}>
              {!isNaN(Number(qiResultCsd)) ? Number(qiResultCsd).toFixed(2) : '0.00'}%
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            flex: 4,
            height: 30,
            flexDirection: 'row',
            backgroundColor: COLOR.secondary_primary_color,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 16,
              }}>
              QI Result Total:
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginTop: 2,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.white,
                fontSize: 16,
              }}>
              {!isNaN(Number(qiResultTotal)) ? Number(qiResultTotal).toFixed(2) : '0.00'}%
            </Text>
          </View>
        </View>
      </View>
    );
  };


  const BuildPostMixDetail = (title: String, description: String) => {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.8 }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Light,
                fontSize: 10,
              }}>
              {title}
            </Text>
          </View>
          <View style={{ flex: 3 }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Light,
                fontSize: 10,
              }}>
              {description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const BuildPostMixDetailRatio = (title: String, description: String) => {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.8 }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Light,
                fontSize: 10,
              }}>
              {title}
            </Text>
          </View>
          <View style={{ flex: 3 }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Light,
                fontSize: 10,
              }}>
              {description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const BuildPostMix = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 300,
          borderColor: COLOR.secondary_primary_color,
          borderWidth: 2,
          borderRadius: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            paddingLeft: 20,
            paddingRight: 40,
            marginTop: 10,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 14,
              }}>
              Posttmix
            </Text>
          </View>
          {BuildPostMixDetail(
            '1.Temperrature :',
            'for all beverage must less than 5 °C or 41 °F',
          )}
          {BuildPostMixDetail(
            '2.Taste :',
            'Free from off-taste and odors Taste testers must be formally trained with documentation available',
          )}
          {BuildPostMixDetail(
            '3.Carbonation :',
            '3.15 to 4.00 gas volume , Target 3.45 gas volume @ Coca-Cola Valve',
          )}
          {BuildPostMixDetail(
            '4.Syrup Age :',
            'within 120 days of manufacture.',
          )}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0.8 }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Light,
                  fontSize: 12,
                }}>
                5.Ratio :
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              {BuildPostMixDetailRatio(
                'Coca-Cola',
                '5.0 - 5.4, Target 5.2 : 1',
              )}
              {BuildPostMixDetailRatio(
                'Fanta Orange',
                '4.3 - 4.4 , Target 4.4 : 1',
              )}
              {BuildPostMixDetailRatio('Sprite', '3.9 - 4.1 , Target 4.0 : 1')}
              {BuildPostMixDetailRatio(
                'Fanta Strawberry',
                '3.9 - 4.1 , Target 4.0 : 1 (Pungent Flavor)',
              )}
              {BuildPostMixDetailRatio(
                'Fanta Green',
                '3.9 - 4.1 , Target 4.0 : 1 (Pungent Flavor)',
              )}
              {BuildPostMixDetailRatio(
                'Fanta Berry Love',
                '3.9 - 4.1 , Target 4.0 : 1 (Pungent Flavor)',
              )}
              {BuildPostMixDetailRatio(
                'Fanta Salaberry',
                '3.9 - 4.1 , Target 4.0 : 1 (Pungent Flavor)',
              )}
              {BuildPostMixDetailRatio(
                'Fanta Grape',
                '3.9 - 4.1 , Target 4.0 : 1 (Pungent Flavor)',
              )}
              {BuildPostMixDetailRatio(
                'Fuze Tea',
                '4.8 - 5.0 , Target 4.9 : 1',
              )}
            </View>
          </View>
          {BuildPostMixDetail(
            '6.Microbiology :',
            'The beverage must not contain more than 10 yeast colony forming unit (CFU) per 5 ml. at the nozzle',
          )}
        </View>
      </View>
    );
  };

  const BuildFCB = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 300,
          borderColor: COLOR.secondary_primary_color,
          borderWidth: 2,
          borderRadius: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            paddingLeft: 20,
            paddingRight: 40,
            marginTop: 10,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 14,
              }}>
              FCB
            </Text>
          </View>
          {BuildPostMixDetail(
            '1.Temperrature :',
            '-4°C (24.8°F) to -2°C (28.4°F) , Target -3.3 °C (26°F)',
          )}
          {BuildPostMixDetail(
            '2.Taste :',
            'Free from off-taste and odors taste testers must be formally trained with documentation available.',
          )}
          {BuildPostMixDetail(
            '3.Expansion :',
            'syrup without foaming agent maintain 50 — 80 %, target = 65 % syrup with foaming agent maintain 80-110%. Target =95%',
          )}
          {BuildPostMixDetail(
            '4.Syrup Age :',
            'Within 120 days of manufacture',
          )}
          {BuildPostMixDetail(
            '5.Brix :',
            'Coca-Cola = 13.00 + 1.0 °Brix Allied flavor (Customize Flavor/Fanta flavor) = 13.00 + 1.0 °Brix',
          )}
          {BuildPostMixDetail(
            '6.Microbiology :',
            'The beverage must not contain more than 10 yeast colony forming unit (CFU) per 5 ml. at the nozzle',
          )}
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
            styles.btn,
            colorBackground && { backgroundColor: colorBackground },
            { height: 42, width: 250 },
          ]}
          onPress={action}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: Fonts.Prompt_Light,
            }}>
            {title}
          </Text>
        </Button>
      </View>
    );
  };

  ;

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason);
    setModalVisible(false);
  };

  const QICanCheckRadioBox = () => {

    return (
      <View style={styles2.container}>
        <View style={{ flexDirection: 'row', padding: 0, }}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={styles2.option}
              onPress={() => {
                setSelected(option.value)
                if (option.value == 'no') {
                  setQIResultTotal(qiResultCsd);
                  setModalVisible(true)
                } else {
                  handleSelectReason('')
                }
              }}
            >
              <View style={styles2.radioCircle}>
                {selected === option.value && <View style={styles2.radioDot} />}
              </View>
              <Text style={styles2.label}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
        <QiResultCanCheck />
      </View>
    );
  }



  const QiResultCanCheck = () => {
    return (
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles2.modalContainer}>
          <Text style={styles2.modalTitle}>เลือกเหตุผลที่วัด QI ไม่ได้</Text>
          <FlatList
            data={reasons}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles2.reasonItem}
                onPress={() => handleSelectReason(`${item.code} - ${item.message}`)}
              >
                <Text>{item.code} - {item.message}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles2.button, styles2.closeButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles2.buttonText}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );

  }

  const content = () => (
    <>
      <View style={[styles.container, { padding: 20 }]}>
        <ScrollView>
          <SafeAreaView>
            <View style={{ flexDirection: 'row' }}>

              <View style={{ flex: 6 }}>
                <QICanCheckRadioBox />
                <View style={styles2.selectedReasonBox}>
                  <Text style={styles2.selectedReasonText}>
                    เหตุผลที่เลือก: {selectedReason || 'ยังไม่ได้เลือก'}
                  </Text>
                </View>
              </View>

              <View style={{ flex: 4, alignItems: 'flex-end', marginTop: -20 }}>
                {BottomWidget('บันทึก', () => _submit())}
              </View>
            </View>
            {BuildTableQualityIndex()}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 2 }}>{BuildPostMix()}</View>
              <View style={{ flex: 0.1 }}></View>
              <View style={{ flex: 2 }}>{BuildFCB()}</View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </>
  )
  return (
    <>
      <AppBar
        title="QualityIndex"
        rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar>
      {content()}
      <Loading loading={isLoading} />
    </>
  );
};

export default QualityIndexNonCSD;
const reasons = [
  { code: 'S01', message: 'Model ไม่มีค่า QI' },
  { code: 'S02', message: 'ไม่มี Co2' },
  { code: 'S03', message: 'ไม่มี Syrup' },
  { code: 'S04', message: 'ไม่มีน้ำ Syrup และ Co2' },
  { code: 'S05', message: 'ลูกค้าไม่ให้วัด QI' },
  { code: 'S06', message: 'PM อย่างเดียวเครื่องไม่ได้ใช้งาน' },
  { code: 'S07', message: 'เครื่องไม่ได้ใช้งานเก็บในสโตร์' },
  { code: 'S08', message: 'ระบบน้ำทางร้านมีปัญหาPMเครื่องอย่างเดียว' },
  { code: 'S09', message: 'ระบบไฟฟ้ามีปัญหาPMเครื่องอย่างเดียว' },
  { code: 'S10', message: 'เครื่อง OFF ก่อนทำ PM' },
  { code: 'S11', message: 'PM อย่างเดียว ไม่มีน้ำเชื่อม' },
  { code: 'S12', message: 'PM อย่างเดียว ไม่มีน้ำเชื่อมและแก็ส' },
  { code: 'S13', message: 'ลูกค้าไม่ยอมให้ทำ PM' },
  { code: 'S14', message: 'เครื่องติดตั้งได้ไม่ถึง 45 วัน' },
];


const styles2 = StyleSheet.create({
  container: { padding: 0 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  option: {
    flexDirection: 'row', // ✅ เพิ่มตรงนี้
    alignItems: 'center',
    marginVertical: 8,
    marginRight: 20,
    // สามารถเพิ่ม padding หรือ spacing ตามต้องการ
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, // ✅ เว้นระยะระหว่างวงกลมกับ label
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  warning: {
    marginTop: 15,
    color: '#d32f2f',
    fontWeight: 'bold',
  }, buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  green: { backgroundColor: '#4CAF50' },
  red: { backgroundColor: '#F44336' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  reasonBox: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  reasonText: { fontSize: 16 },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  reasonItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#555',
    marginTop: 20,
  },
  selectedReasonBox: {
    padding: 12,
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedReasonText: {
    fontSize: 16,
    color: '#333',
  },

});

