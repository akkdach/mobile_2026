import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated, Dimensions, FlatList, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Checkbox, DataTable } from 'react-native-paper';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import DropdownSelect from '../../components/DropdownSelect';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import moment from 'moment-timezone';
import { Icon, Modal } from '@ant-design/react-native';
import { VanManagementModels } from '../../models/vanManagementModels';
import { DropdownSelectMultipleItemProps } from '../../components/DropdownSelectMultiple';
import { getReasonService, getVanManagementService, getVanTypeManagementService, postVanManagementService } from '../../services/managementPlanResourceService';
import Loading from '../../components/loading';
import { _getData } from '../../utils/AsyncStorage';
import LocalStorage from '../../constants/LocalStorageKey'
import TextInputComponent from '../../components/TextInput';
import { useNavigation, StackActions } from '@react-navigation/native';

const logo = require('../../../assets/logo.png');

const ManagementPlanResourcePage: React.FC = (props: any) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelect, setDateSelect] = useState(`${moment(new Date()).locale('th').add(543, 'year').format('DD/MM/YYYY')}`);
  const screenWidth = Dimensions.get('window').width;
  const [visibleVanTypeModal, setVisibleVanTypeModal] = useState(false);
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([
  ]);
  const [itemsVanType, setItemsVanType] = useState<any[]>([

  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [vanManagement, setVanManagement] = useState<VanManagementModels[]>([]);
  const [vanTypeSelect, setVanTypeSelect] = useState<
    DropdownSelectMultipleItemProps[]
  >([])
  const [vanIndex, setVanIndex] = useState<any>();
  const [timeSelect, setTimeSelect] = useState<any>();
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const ref_input = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    Orientation.lockToLandscapeRight();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    getVanManagement()
    getVanTypeManagement()
    getReason()
  }, [])

  const getReason = async () => {
    try {
      const response = await getReasonService();
      setItemsOrderCode(response)
    } catch (error) {
      Alert.alert('แจ้งเตือน', `Reason: ${error}`, [
        {
          text: 'ตกลง',
        },
      ]);
    }
  }


  const getVanTypeManagement = async () => {
    try {
      const response = await getVanTypeManagementService();
      setItemsVanType(response)
    } catch (error) {
      Alert.alert('แจ้งเตือน', `Van type: ${error}`, [
        {
          text: 'ตกลง',
        },
      ]);
    }
  }

  const getVanManagement = async () => {
    const userProfile = await _getData({ key: LocalStorage.userInfo as string });
    const parseProfile = JSON.parse(String(userProfile));
    setIsLoading(true)
    try {
      const date = dateSelect.split('/')
      let response = await getVanManagementService(`${Number(date[2]) - 543}-${date[1]}-${date[0]}`, parseProfile['wk_ctr']);
      if (response.length > 0) {
        response = response.map((v: any) => {
          let van_type_label = v.van_type.map((val: any) => itemsVanType.filter(item => Number(item.value) == Number(val))[0]?.label)

          v = { ...v, ...{ "wK_CTR": parseProfile['wk_ctr'], "van_type_label": van_type_label } }
          return v;
        })
      }
      setVanManagement(response)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      Alert.alert('แจ้งเตือน', `Van Management: ${error}`, [
        {
          text: 'ตกลง',
        },
      ]);
    }
  }

  const _onSubmit = async () => {
    Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ยืนยัน',
        onPress: async () => {
          _submitData();
        },
      },
    ]);
  };

  const _submitData = async () => {
    try {
      const response = await postVanManagementService(vanManagement, dateSelect);
      if (response.isSuccess) {
        Alert.alert('แจ้งเตือน', `บันทึกข้อมูลสำเร็จ`, [
          {
            text: 'ตกลง',
            onPress: async () => {
              // router.Actions.pop();
              navigation.dispatch(StackActions.pop());
            },
          },

        ])
      }
    } catch (error) {
      Alert.alert('แจ้งเตือน', `Submit Van Management: ${error}`, [
        {
          text: 'ตกลง',
        },
      ])
    }
    console.log("on submit", JSON.stringify(vanManagement, null, 2))
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = (time: any, type: string, index: any) => {
    setTimeSelect({ index, type, time })
    setTimePickerVisibility(true)
  }

  const handleConfirmTime = (time: any) => {
    setTimePickerVisibility(false)
    let timeFormat = moment(time).locale('th').add(543, 'year').format('HH:mm')
    if (timeSelect["type"] == "timestart") {
      vanManagement[timeSelect["index"]] = {
        ...vanManagement[timeSelect["index"]], ...{ "start_time": timeFormat }
      }

    } else {
      vanManagement[timeSelect["index"]] = {
        ...vanManagement[timeSelect["index"]], ...{ "end_time": timeFormat }
      }
    }

    setVanManagement([...vanManagement])
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setTimePickerVisibility(false)
    // getVanManagement()
  };

  const handleConfirm = (date: any) => {
    const dateTime = moment(date).locale('th').add(543, 'year').format('DD/MM/YYYY');
    setDateSelect(`${dateTime}`)
    hideDatePicker();
  };

  const formatTime = (date: string) => {
    let time = moment(date).locale('th').add(543, 'year').format('HH:mm')
    return time
  }

  const checkVanActive = (type: string, index: number) => {
    let van_details = vanManagement[index]
    if (type == "active") {
      van_details.is_active = 1
      van_details.reason = 0
    } else {
      van_details.is_active = 0
      van_details.reason = 0
    }
    vanManagement[index] = van_details
    setVanManagement([...vanManagement])
  }


  const DataTableManagement = () => {
    return (
      <ScrollView horizontal>
        <View style={{ padding: 10 }}>
          <DataTable style={{ width: screenWidth * 1.8 }}>
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              <DataTable.Title style={styles.dataTable_title_center}>
                <Text style={styles.dataTableTitle}>Van No.</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.dataTable_title_center}>
                <Text style={styles.dataTableTitle}>Active</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.dataTable_title_center}>
                <Text style={styles.dataTableTitle}>InActive</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.dataTable_title_center}>
                <Text style={styles.dataTableTitle}>เวลาเริ่ม</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.dataTable_title_center}>
                <Text style={styles.dataTableTitle}>เวลาสิ้นสุด</Text>
              </DataTable.Title>
              {/* <DataTable.Title style={[styles.dataTable_title_center, { width: 200 }]}>
                <Text style={styles.dataTableTitle}>OT{"(ช.ม)"}</Text>
              </DataTable.Title> */}
              <DataTable.Title style={[styles.dataTable_title_center, { flex: 2 }]}>
                <Text style={styles.dataTableTitle}>เหตุผล</Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.dataTable_title_center, { flex: 2 }]}>
                <Text style={styles.dataTableTitle}>Van Type</Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.dataTable_title_center, { flex: 2 }]}>
                <Text style={styles.dataTableTitle}>ZONE</Text>
              </DataTable.Title>
            </DataTable.Header>
            {vanManagement.map((val: VanManagementModels, index: any) => {
              return <DataTable.Row key={`van-management-${index}`}>
                <DataTable.Cell style={styles.dataTable_cell_center}>
                  <View >
                    <Text style={styles.dataTable_cell}>{val?.van_no}</Text>
                  </View>
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
                  <Checkbox
                    color={COLOR.secondary_primary_color}
                    status={val?.is_active == 1 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      checkVanActive('active', index)
                    }}
                  />
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
                  <Text style={styles.dataTable_cell}>
                    <Checkbox
                      color={'#e73954'}
                      status={val?.is_active == 0 ? 'checked' : 'unchecked'}
                      onPress={() => {
                        checkVanActive('inActive', index)
                      }}
                    />
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTable_cell_center}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => showTimePicker(val?.start_time, 'timestart', index)}>
                    <Text style={styles.dataTable_cell}>{val?.start_time == "" ? "00:00" : val?.start_time}</Text>
                  </TouchableOpacity>
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTable_cell_center}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => showTimePicker(val?.end_time, 'endTime', index)}>
                    <Text style={styles.dataTable_cell}>{val?.end_time == "" ? "00:00" : val?.end_time}</Text>
                  </TouchableOpacity>
                </DataTable.Cell>
                {/* <DataTable.Cell style={{ flex: 2 }}>
                  <View style={{ width: 200 }}>
                    <TextInputComponent
                      value={`${val?.ot}`}
                      keyboardType={'numeric'}
                      placeholder="ระบุ"
                      style={{
                        width: 150,
                        height: 52
                      }}
                      onChangeText={(v: any) => {
                        vanManagement[index] = { ...vanManagement[index], ...{ "ot": Number(v) } }
                        setVanManagement([...vanManagement])
                      }}
                      onEndEditing={(e: any) => {
                        if (e.nativeEvent.text == "") {
                          let data = { "ot": Number(e.nativeEvent.text) }
                          vanManagement[index] = { ...vanManagement[index], ...data }
                          setVanManagement([...vanManagement])
                        }
                      }
                      }></TextInputComponent>
                  </View>
                </DataTable.Cell > */}
                <DataTable.Cell style={{ flex: 2 }}>
                  <View style={{ width: 100 }}>
                    <DropdownSelect
                      selects={val?.reason}
                      dataItem={itemsOrderCode}
                      placeholder={'เหตุผล'}
                      textStyle={{
                        color: COLOR.white,
                        fontSize: 16,
                        marginTop: -4,
                      }}
                      containerStyle={styles.containerStyle}
                      iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
                      contentContainerStyle={{ borderRadius: 10 }}
                      onValueChange={v => {
                        let data = { ...val, ...{ "reason": v } }
                        vanManagement[index] = data
                        setVanManagement([...vanManagement])
                      }}
                    />
                  </View>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  <View style={{ width: 100 }}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => { _setDropdown(index, val?.van_type) }}
                      style={styles.containerStyle}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: COLOR.white,
                              fontSize: 16,
                              marginTop: 6,
                            }}> {val.van_type != null && val.van_type.length > 0 ? val.van_type_label?.join() : "Van Type"} </Text>
                        </View>
                        <View style={{
                          paddingRight: 10,
                        }}>
                          <Icon
                            style={{
                              paddingLeft: 40,
                              marginTop: 10,
                            }}
                            name={'down'}
                            size={14}
                            color={COLOR.white}
                          />
                        </View>
                      </View>

                    </TouchableOpacity>
                  </View>

                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  <View>
                    <TextInput
                      style={styles.input}
                      onEndEditing={(e) => {
                        if (e.nativeEvent.text != "") {
                          let data = { "zone": e.nativeEvent.text }
                          vanManagement[index] = { ...vanManagement[index], ...data }
                          setVanManagement([...vanManagement])
                        }
                      }}
                      defaultValue={val.zone}
                    />
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            })}

          </DataTable>
        </View>
      </ScrollView>
    );
  };


  const _setDropdown = (index: any, vanType: any) => {
    setVanIndex(index)
    let dataItemsVanType: any = [];
    if (itemsVanType.length > 0) {
      itemsVanType.map(v => {
        if (vanType.length > 0) {
          if (vanType.includes(v.value)) {
            v = { ...v, ...{ "checked": true } }
          }
        } else if (vanType != "") {
          if (vanType == v.value) {
            v = { ...v, ...{ "checked": true } }
          }
        }
        dataItemsVanType.push(v)
      })
      setVanTypeSelect([...dataItemsVanType])
      setVisibleVanTypeModal(true)
    } else {
      setVisibleVanTypeModal(true)
    }
  }


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
            { height: 52, width: 250, paddingTop: 3 },
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

  const onValueChange = (data: DropdownSelectMultipleItemProps, index: any) => {

    vanTypeSelect[index] = data;
    setVanTypeSelect([...vanTypeSelect]);
  };

  const _onSubmitSearch = () => {
    const data = vanTypeSelect
      .filter(val => val.checked)
      .map(val => val.value);
    const label = vanTypeSelect
      .filter(val => val.checked)
      .map(val => val.label);
    if (vanIndex != null) {
      vanManagement[vanIndex] = { ...vanManagement[vanIndex], ...{ "van_type": data, "van_type_label": label } }
    }
    setVanManagement([...vanManagement]);
    setVanTypeSelect([]);
    setVanIndex(null);
    setVisibleVanTypeModal(false);

  };

  const BuildModalDrawer = () => {
    const renderItem = ({ item, index }: any) => {
      return item;
    };

    let listItem: any = [];
    if (vanTypeSelect && vanTypeSelect?.length > 0) {
      vanTypeSelect?.forEach((val: DropdownSelectMultipleItemProps, index) => {
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
              <View style={{ flex: 0.2 }}>
                <Checkbox
                  key={`checkbox-${index}`}
                  status={vanTypeSelect[index].checked ? 'checked' : 'unchecked'}
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
                {vanTypeSelect[index].checked && (
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
          width: 550,
          height: '80%',
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          borderTopLeftRadius: 30,
        }}
        visible={visibleVanTypeModal}>
        <View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                setVisibleVanTypeModal(false);
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: 18 }}>
              Transfer Order Number
            </Text>
          </View>
          <View style={{ padding: 40 }}>
            <FlatList
              data={listItem}
              initialNumToRender={6}
              renderItem={renderItem}
              keyExtractor={(item, index) => `select-list-${index}`}
            />
          </View>
          <View style={{ padding: 30 }}>
            {BottomWidget('ตกลง', () => {
              _onSubmitSearch();
            })}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <BackGroundImage
        components={
          <Animated.View>
            <View style={{ width: '100%' }}>
              <AppBar title="จัดแผนกำลังพล"></AppBar>
            </View>
            <View>
              <View style={{ flexDirection: 'row', }}>
                <View style={{ marginTop: 36, left: 10, flex: 0.1 }}>
                  <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: 16 }}>
                    วันที่ :
                  </Text>
                </View>
                <View>
                  <TouchableOpacity onPress={showDatePicker} activeOpacity={0.9}>
                    <View style={styles.btn_date}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
              </View>

              <View>
                {BuildModalDrawer()}
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideDatePicker}
              />
            </View>
            <View
              style={{
                marginTop: 10,
                height: 900,
              }}>
              <ScrollView>
                {DataTableManagement()}
              </ScrollView>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={_onSubmit} activeOpacity={0.9}>
                <View style={[styles.btn, { alignItems: 'center' }]}>
                  <Text style={styles.text_btn}>บันทึก</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default ManagementPlanResourcePage;


const styles = StyleSheet.create({
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 16,
  },

  dataTableTitle: {
    color: COLOR.white,
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium
  },
  btn: {
    width: 262,
    height: 62,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 2,
    borderColor: COLOR.secondary_primary_color,
    marginTop: 20,
    paddingTop: 8,
    borderRadius: 30,
    left: 10,
    fontFamily: Fonts.Prompt_Medium,
    backgroundColor: COLOR.secondary_primary_color
  },
  btn_date: {
    width: 262,
    height: 52,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 2,
    borderColor: COLOR.secondary_primary_color,
    marginTop: 20,
    left: 10,
    fontFamily: Fonts.Prompt_Medium,
    backgroundColor: COLOR.white
  },
  text_btn: {
    fontSize: 22,
    padding: 6,
    color: COLOR.white,
    fontFamily: Fonts.Prompt_Medium,
  },

  text_btn_date: {
    fontSize: 18,
    padding: 10,
    color: COLOR.secondary_primary_color,
    fontFamily: Fonts.Prompt_Medium,
  },
  dataTable_title_center: {
    justifyContent: 'center'
  },
  dataTable_cell_end: {
    justifyContent: 'flex-end'
  },
  dataTable_cell_center: {
    justifyContent: 'center'
  },
  input: {
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    height: 42,
    width: 200,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Prompt-Light',
    color: '#ffffff',
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    width: 200,
    height: 42,
    borderRadius: 10,
    paddingTop: 4,
    marginTop: 10,
    alignItems: 'flex-start',
    paddingLeft: 20,
  }

});

