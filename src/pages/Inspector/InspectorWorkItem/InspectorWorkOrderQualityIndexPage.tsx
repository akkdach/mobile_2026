import { Button } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Animated from 'react-native-reanimated';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DropdownSelect from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ROUTE } from '../../../constants/RoutePath';
import { getQualityIndexMaster, getQualityIndex, postQualityIndex, fetchCloseQIInformation } from '../../../services/qualityIndexService';
import QualityIndex from '../../QualityIndex/QualityIndex';
import styleSheet from '../../../components/StyleSheet';
import styles from './InspectorWorkOrderQualityIndexCss';
import { getQualityIndexInspector, getQualityIndexMasterInspector, postQualityIndexInspector } from '../../../services/visitInspector';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
  };
};

const InspectorWorkOrderQualityIndexPage = (props) => {
  const params = props.route?.params as InterfaceProps;
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
    { qualityIndex_Taste: { check: 0, pass: 0, defectCount: 0, percent: 0 } },
    { qualityIndex_BrixRatio: { check: 0, pass: 0, defectCount: 0, percent: 0 } },
    { qualityIndex_Temp: { check: 0, pass: 0, defectCount: 0, percent: 0 } },
    { qualityIndex_OvCarbo: { check: 0, pass: 0, defectCount: 0, percent: 0 } },
    { qualityIndex_Age: { check: 0, pass: 0, defectCount: 0, percent: 0 } },
  ];
  const { orderId } = params?.workOrderData;
  const [numberMachineHeads, setNumberMachineHeads] = useState<any>(0);
  const [itemsOrderCode, setItemsOrderCode] = useState<any>();
  const [qiResult, setQIResult] = useState<any>(0.0);
  const { control, getValues, setValue } = useForm<any>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();


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
      const result = await getQualityIndexMasterInspector();
      if (result) {
        setItemsOrderCode(result);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await getQualityIndexInspector(orderId);
        setDefectItem(response.defectItem);
        setDefectValue(response.cloneValue);
        setNumberMachineHeads(
          Math.max.apply(
            Math,
            response.defectItem.map((val: any, indexMap: any) =>
              checkValue(indexMap, val, 'defectCount'),
            ),
          ),
        );
        let qiResult = [];
        for (const [idx] of response.defectItem.entries()) {
          qiResult.push(
            Number(checkValue(idx, response.defectItem[idx], 'pass')) /
            Number(checkValue(idx, response.defectItem[idx], 'check')) || 0,
          );
        }
        setQIResult(qiResult.reduce((a: any, b: any) => a * b) * 100);
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
            if (statusSave) {
              Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูล defect ให้ครบถ้วน ?', [
                {
                  text: 'ตกลง',
                  onPress: async () => { },
                },
              ]);
              return;
            }

            console.log('[defectItem]', )
            let response = await postQualityIndexInspector(orderId, defectItem);
            if (response.isSuccess) {
              await fetchCloseQIInformation(params.workOrderData.orderId);
              Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
                {
                  text: 'ปิด',
                  onPress: async () => {
                    // Actions.replace(ROUTE.INSPECTOR_WORK_ITEM, params)
                    navigation.dispatch(StackActions.replace(ROUTE.INSPECTOR_WORK_ITEM, params))
                  },
                },
              ]);
            }
          },
        },
      ]);
    } catch (error:any) {
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ปิด',
          onPress: async () => {
            // Actions.replace(ROUTE.INSPECTOR_WORK_ITEM, params)
            navigation.dispatch(StackActions.replace(ROUTE.INSPECTOR_WORK_ITEM, params))
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
              setQIResult(qiResult.reduce((a, b) => a * b) * 100);
            }}
            onChangeText={textSearch => onChange(textSearch)}
          />
        )}
        name={`${name}${type}`}
        defaultValue=""
      />
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

  const BuildDropDown = (idx: any, i: any, defectGroup: any, length: any,) => {
    return (
      <DropdownSelect
        selects={
          defectValue[idx][`defectDetail`][i]['defectCode']
            ? defectValue[idx][`defectDetail`][i]['defectCode']
            : ''
        }
        dataItem={itemsOrderCode[defectGroup]}
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
          const newKey = `defectDetail`;
          const newObjArr = [...defectValue[idx][`defectDetail`]];
          newObjArr.splice(i, 1, data);
          const newObjReplace = {
            [newKey]: newObjArr,
          };
          cloneValue.splice(idx, 1, newObjReplace);
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
          fontSize: 14,
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
        <View style={{ flex: 0.5, marginTop: 10 }}>{BuildTitle(title2)}</View>
        <View style={{ flex: 0.6 }}>
          {BuildInput(
            name,
            index,
            'Pass',
            checkValue(index, defectItem[index], 'pass'),
          )}
        </View>
        <View style={{ flex: 0.5, marginTop: 10 }}>{BuildTitle(title3)}</View>
        <View
          style={{
            flex: 0.6,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
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
      widthItem = 300;
    } else if (Number(numberMachineHeads) == 2) {
      widthItem = 200;
    } else if (Number(numberMachineHeads) == 3) {
      widthItem = 206;
    } else if (Number(numberMachineHeads) == 4) {
      widthItem = 152;
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
              fontSize: 14,
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
          <View style={{ flexDirection: 'column', flex: 3 }}>
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
                  fontSize: 16,
                  marginTop: 4,
                  color: COLOR.white,
                  alignItems: 'center',
                }}>
                Quality Index
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
                    fontSize: 16,
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
                    fontSize: 16,
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
                    fontSize: 16,
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
            {BuildListCheck('OV/CARBO', 'OV/CARBO', 'OV/CARBO', 'ov', 3)}
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
              QI Result :
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
              {qiResult.toFixed(2)}%
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
            { height: 52, width: 250 },
          ]}
          onPress={action}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: Fonts.Prompt_Light,
            }}>
            {title}
          </Text>
        </Button>
      </View>
    );
  };

  const content = () => (
    <View style={[styles.container, { padding: 20 }]}>
      <ScrollView>
        <SafeAreaView>
          <View style={{ flexDirection: 'row' }}>
            {/* <View style={{ flex: 1 }}>
                        {BuildInputNumberMachineHeads()}
                    </View> */}
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
  );

  return (
    <>
      <AppBar
        title="QualityIndex"
        rightTitle={`Order: ${params.workOrderData.orderId}`}></AppBar>
      <BackGroundImage
        keyBg={'QualityIndex'}
        components={
          <Animated.ScrollView>{content()}</Animated.ScrollView>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default InspectorWorkOrderQualityIndexPage;
