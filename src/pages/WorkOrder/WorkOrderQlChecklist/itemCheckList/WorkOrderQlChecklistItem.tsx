import { Modal } from "@ant-design/react-native";
import Icon from "@ant-design/react-native/lib/icon";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, FlatList, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Card, RadioButton, Title } from "react-native-paper";
import { COLOR } from "../../../../constants/Colors";
import { Fonts } from "../../../../constants/fonts";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment-timezone';
import styles from '../WorkOrderQlChecklistCss';
import TextInputComponent from "../../../../components/TextInput";
import {styleLg,styleSm} from './WorkOrderQlChecklistItemCSS'
import { SafeAreaView } from "react-native-safe-area-context";
import 'moment/locale/th';

interface Props {
  submitData?: (allValues: any, keyItem: any) => void,
  dataListItem?: any,
  isSubmit?: any,
  keyItem?: String,
  isValidate?:Boolean
}
const WorkOrderQlChecklistItem = ({submitData, dataListItem, isSubmit, keyItem, isValidate }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();

  const showModal = () => setVisible(true);
  const [visibleSelect, setVisible] = React.useState(false);
  const [dataList, setDataList] = useState<any>();
  const hideModal = () => setVisible(false);
  const [dataListDatePicker, setDataListDatePicker] = useState<any>(false);

  const [dataSelects, setDataSelects] = useState<any>('');
  const [indexSelects, setIdexSelects] = useState<any>('');
  const [indexSelectDate, setIndexSelectDate] = useState<any>();
  const [itemSelects, setItemSelect] = useState<any>();

  useEffect(() => {
    if (dataListItem) {
      setDataList(dataListItem)
    }
    if (isSubmit) {
      submitData(dataList, keyItem)
    }
  }, [isSubmit, dataListItem, isValidate]);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  },[]);


  const dateTimePickerModal = (item: any) => {
    return (
      <DateTimePickerModal
        isVisible={dataListDatePicker}
        mode="date"
        onConfirm={date => {
          setDataListDatePicker(false)
          const dateTime = moment(date)
            .locale('th')
            .add(543, 'year')
            .format('DD/MM/YYYY');
          const dataObj = {
            ...itemSelects,
            ...{ textDescription: dateTime },
          };
          dataList.items.splice(indexSelectDate, 1, dataObj);
          setDataList({ ...dataList });
          setIndexSelectDate('');
          setItemSelect('');
        }}
        onCancel={() => setDataListDatePicker(false)}
      />
    );
  };

  const dateTimePickerModal2 = (item: any) => {
    return (
      <DateTimePickerModal
        isVisible={true}
        mode="date"
        onConfirm={date => {
          setDataListDatePicker(!dataListDatePicker)
          const dateTime = moment(date)
            .locale('th')
            .add(543, 'year')
            .format('DD/MM/YYYY');
          const dataObj = {
            ...itemSelects,
            ...{ textDescription: dateTime },
          };
          dataList.items.splice(indexSelectDate, 1, dataObj);
          setDataList({ ...dataList });
          setIndexSelectDate('');
          setItemSelect('');
        }}
        onCancel={() => setDataListDatePicker(!dataListDatePicker)}
      />
    );
  };

  const renderItemDropDownSelect = ({ item, index }: any) => {
    return item;
  };

  const BuildDropDownSelect = (
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
              dataList.items.splice(indexSelects, 1, dataObj);
              setDataList({ ...dataList });
              hideModal();
            }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 4,
                height: 44,
                marginTop: 8,
                backgroundColor: '#F9F9F9',
                borderRadius: 10
              }}
              key={index}>
              <View style={{ flex: 0.3 }}>
                <RadioButton value={val?.value} />
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={[styles.text2,
                    {
                      fontFamily: Fonts.Prompt_Medium,
                      marginTop: 4,
                      height:100
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
      <View >
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
            showModal();
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
                    ? dataLabel.label.substring(0, 20 - 3) + '...'
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
            style={[styles.ModalWidth]}
            visible={visibleSelect}>
            <View >
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    hideModal(), setDataSelects(''), setIdexSelects('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View style={[styles.ModalPadding]}>
                <RadioButton.Group
                  onValueChange={newValue => {
                    const dataObj = {
                      ...dataItem,
                      ...{ codeDescription: newValue },
                    };
                    dataList.items.splice(indexSelects, 1, dataObj);
                    setDataList({ ...dataList });
                    hideModal();
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

  const dataListFlatList = () => {
    let listData = [];
    if (dataList) {
      const dataListItem = dataList.items;
      for (let index = 0; index < dataListItem.length; index++) {
        let item = dataListItem[index];
        listData.push(
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
                      dataList.items.splice(index, 1, dataObj);
                      setDataList({ ...dataList });
                    }}
                    value={`${item?.measure}`}
                    key={`radioButton-${index}`}>
                    <View style={{ flexDirection: 'row', marginTop: 12 }}>
                      <View style={{ flex: 4 }}>
                        <Text
                          style={[styles.text1,{
                            fontFamily: Fonts.Prompt_Light,
                            marginTop: 6,
                          }]}>
                          {item?.title}
                          {isValidate && item?.measure === null ? (
                            <Text style={[styles.text2,{ color: 'red' }]}>*</Text>
                          ) : null}
                          {isValidate && item?.measure === "false" && item?.codeDescription == "" ? (
                            <Text style={[styles.text2,{ color: 'red'}]}>*</Text>
                          ) : null}
                        </Text>
                      </View>
                      <View style={[styles.flex12]}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <RadioButton value="true" />
                          </View>
                          <View>
                            <Text style={styles.textLabel}>ผ่าน</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.flex12]}>
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
                      style={[styles.text1,{
                        fontFamily: Fonts.Prompt_Light,
                        marginTop: 6,
                      }]}>
                      {item?.title}
                      {isValidate && item?.textDescription === '' && item?.inputType != 'number' ? (
                        <Text style={[styles.text1,{ color: 'red'}]}>*</Text>
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
                                dataList.items.splice(index, 1, dataObj);
                                setDataList({ ...dataList });
                              }}
                              keyboardType={'numeric'}
                              style={[
                                styles.input1,
                                isValidate && item?.textDescription === ''
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
                        <View >
                          <TouchableOpacity
                            onPress={() => {
                              setDataListDatePicker(dataListDatePicker ? false : true);
                              setIndexSelectDate(index);
                              setItemSelect(item);
                            }}
                            activeOpacity={0.9}
                            style={[styles.dateWidth]}>
                            <View >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignContent:'center',
                                  marginLeft: screenInfo.width > 500 ? 20 :0,
                                  margin:5,
                                  backgroundColor:COLOR.secondary_primary_color,
                                  borderRadius:10,
                                  paddingBottom: 15
                                  
                                  
                                }}  
                                >
                                <View style={{}}>
                                  <Text style={styles.text_btn_date}>
                                    {item?.textDescription}
                                  </Text>
                                </View>
                                <View style={{ left: -6, marginTop: 8 }}>
                                  <Icon
                                    name={'calendar'}
                                    size={20}
                                    color={COLOR.white}
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                          {dateTimePickerModal(
                            dataList.items[indexSelects],
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
                                dataList.items.splice(index, 1, dataObj);
                                setDataList({ ...dataList });
                              }}
                              style={[styles.text1,
                                {
                                  height: 40,
                                  width: 400,
                                  paddingLeft: 20,
                                  borderRadius: 12,
                                },
                                isValidate && item?.textDescription === ''
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
            {item?.measure == 'false' && screenInfo.width >=500 ? (
              <View
                style={{ flex: 0.28, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelect(
                    index,
                    dataList[`${keyItem}`],
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 0.28 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>,
          <View style={{ flexDirection: 'row' }} key={`input-action2-${index}`}>
            {item?.measure == 'false' && screenInfo.width < 500 ? (
              <View
                style={{ flex: 1, marginTop: 8 }}
                key={`view-dropdownSelect-${index}`}>
                {item.type == 'radio' &&
                  BuildDropDownSelect(
                    index,
                    dataList[`${keyItem}`],
                    item?.codeDescription,
                    item,
                  )}
              </View>
            ) : (
              <View
                style={{ flex: 1 }}
                key={`view-dropdownSelect-${index}`}></View>
            )}
          </View>,
        );
      }
    }
    return (
      <Card style={styles.marginTop} key={`card-checkListGroup`}>
        <Card.Content key={`card-content-L1`}>
          <Title style={styles.textTitle} key={`title-card-L1`}>
            {dataList && dataList.title}
          </Title>
          <View style={[styles.cardContentView]}>
            <FlatList
              data={listData}
              listKey={`${moment().valueOf().toString()}`}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `dataListFlatList-${index}`}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };


  return (<View>{dataList && dataList?.items?.length > 0 && dataListFlatList()}</View>)
}

export default WorkOrderQlChecklistItem;