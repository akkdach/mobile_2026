import { Icon, Modal } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Animated, Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Card, DataTable } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DataNotFound from '../../../components/DataNotFound';
import DropdownSelect from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import TextInputComponent from '../../../components/TextInput';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { fetchPostActionApprove, fetchtGetUnderVanSub, fetchtGetWorkOrderVanSub } from '../../../services/workOrderListChangeApprove';
import { FullArrayTextSearch } from '../../../utils/FullTextSearch';
import { styleSm, styleLg } from './ApproveWorklistPageCss';

type InterfaceProps = {};
type Inputs = {
  searchText: string;
};


const ApproveWorkListPage: FC<InterfaceProps> = (props) => {
  const { control, getValues, reset, setValue, watch } = useForm<Inputs>();
  const [isModalVisible, setModalVisible] = useState(false)
  const [valueSelect, setValueSelect] = useState<any>(null);
  const [items, setItems] = useState<any>([]);
  const [workOrderDataVanSubMaster, setWorkOrderVanSubMaster] = useState([]);
  const [workOrderDataVanSubFilter, setWorkOrderVanSubFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workOrderSelect, setWorkOrderSelect] = useState<any>(null)

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, [screenInfo]);

  useEffect(() => {
    (async () => {
      const data: any = (await fetchtGetUnderVanSub()).dataResult
      setItems(data.map((item: any) => {
        return { label: item.wk_ctr, value: item.wk_ctr }
      }))
    })();
  }, [])

  useEffect(() => {
    onGetWorkOrderVanSub()
  }, [])

  watch(observe => {
    if (observe.searchText && observe.searchText.length > 3) {
      const filterFullText = FullArrayTextSearch(
        workOrderDataVanSubMaster,
        observe.searchText,
      ) as any;
      setWorkOrderVanSubFilter(filterFullText);
    } else if (observe.searchText && observe.searchText.length > 0) {
      setWorkOrderVanSubFilter(workOrderDataVanSubMaster);
    }
  });

  const onGetWorkOrderVanSub = async () => {
    setIsLoading(true);
    try {
      const data: any = (await fetchtGetWorkOrderVanSub()).dataResult
      await setWorkOrderVanSubMaster(data);
      await setWorkOrderVanSubFilter(data);

    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }


  const onActionApprove = async (payload: any) => {
    Alert.alert('แจ้งเตือน', 'ต้องการยืนยันหรือไม่?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
        onPress: async () => {
          setValueSelect(null)
        }
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          const response = await fetchPostActionApprove(payload);
          if (response.isSuccess) {
            Alert.alert('บันทึกสำเร็จ', response.message);
            onGetWorkOrderVanSub()
          } else {
            Alert.alert('บันทึกไม่สำเร็จ', response.message);
          }
        },
      },
    ]);
  }

  const onSelectWorker = () => {
    return (
      valueSelect !== null ?
        <Text style={[styles.btnText]}>เลือกช่าง</Text> :
        <DropdownSelect
          selects={valueSelect}
          dataItem={items}
          placeholder={'เลือกช่าง'}
          textStyle={[styles.btnText, {
            color: COLOR.primary,
            fontFamily: Fonts.Prompt_Medium
          }]}
          containerStyle={{
            width: '100%',
            height: '100%',
            marginLeft: '50%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          // iconStyle={{paddingTop: 18, paddingLeft: 120}}
          contentContainerStyle={{ borderRadius: 10 }}
          onValueChange={val => onChangeVan(val)}
          isShowLabel={true}
        />
    )
  }

  const onChangeVan = async (val?: any) => {
    let payload = {
      workOrderId: workOrderSelect.workOrder,
      approveAction: '',
      referToWorkCenter: ''
    }
    if (val === 'approved') {
      payload.approveAction = 'approved'
    } else {
      payload.approveAction = 'change_van'
      payload.referToWorkCenter = val;
      setValueSelect(val);
    }
    console.log('[val]', val)
    setModalVisible(false)
    await onActionApprove(payload)
  }

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

  const ModalApproveChange = () => {
    console.log('[workOrderSelect]', workOrderSelect)
    return (
      <Modal
        transparent
        maskClosable
        style={[styles.modal, { width: screenInfo.width > 500 ? 'auto' : 350 }]}
        visible={isModalVisible}>
        <View>
          <View style={{ alignItems: 'flex-end', paddingBottom: 5 }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => setModalVisible(false)}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View style={{ display: 'flex', marginLeft: screenInfo.width > 500 ? 30 : 5, paddingBottom: 20 }}>
            <Text style={styles.dataTable_cell}><Text style={{ fontWeight: 'bold' }}>Work Order</Text>: {workOrderSelect?.workOrder ? workOrderSelect?.workOrder : '-'}</Text>
            <Text style={styles.dataTable_cell}><Text style={{ fontWeight: 'bold' }}>Work Center</Text>: {workOrderSelect?.workCenter ? workOrderSelect?.workCenter : '-'}</Text>
            <Text style={styles.dataTable_cell}><Text style={{ fontWeight: 'bold' }}>Equipment Found</Text>: {workOrderSelect?.equipmentFound ? workOrderSelect?.equipmentFound : '-'}</Text>
            <Text style={styles.dataTable_cell}><Text style={{ fontWeight: 'bold' }}>Equipment Inform</Text>: {workOrderSelect?.equipmentInform ? workOrderSelect?.equipmentInform : '-'}</Text>
            <Text style={styles.dataTable_cell}><Text style={{ fontWeight: 'bold' }}>Model</Text>: {workOrderSelect?.model ? workOrderSelect?.model : '-'}</Text>
          </View>

          {DrawHorizontalWidget()}

          <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingLeft: screenInfo.width > 500 ? 30 : 3, paddingRight: 15, paddingTop: 50, paddingBottom: 50, flex: 1 }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => onChangeVan('approved')}>
                <View style={styles.btn}>
                  <Text style={[styles.btnText]}>Approve</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={{ paddingLeft: 15, paddingRight: screenInfo.width > 500 ? 30 : 3, paddingTop: 50, paddingBottom: 50, flex: 1 }}>
              <TouchableHighlight>
                <View style={[styles.btn2]}>
                  {onSelectWorker()}
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const Search = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{ flex: 2 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{ height: 52 }}
                onChangeText={(value: any) => onChange(value)}
                keyboardType="number-pad"
              />
            )}
            name="searchText"
            defaultValue=""
          />
        </View>
      </View>
    );
  };

  const convertApproveAction = (approveAction: string, webStatus: string) => {
    if (webStatus !== '4')
      switch (approveAction) {
        case 'change_van':
          return 'green';
        case 'approved':
          return 'gray';
        default:
          return '#127782'
      } else {
      return 'gray'
    }
  }


  const LayoutApproveWorkList = () => {
    // console.log('workOrderDataVanSubFilter', workOrderDataVanSubFilter)
    let listItem: any = [];
    workOrderDataVanSubFilter
      .forEach((item: any, index: number) => {
        listItem.push({ ...item, index })
      })

    const renderItem = ({ item }: { item: any }) => (
      <TouchableOpacity onPress={() => {
        if (item.webStatus !== '4') {

          setModalVisible(true)
          setWorkOrderSelect(item)
        }
      }}>

        <View style={stylesList.card}>
          <View style={stylesList.row}>
            <Text style={stylesList.title}>ข้อมูลที่แจ้ง</Text>
            <Text style={stylesList.value}>ข้อมูลที่ช่างพบ</Text>
          </View>
          <View style={stylesList.row}>
            <Text style={stylesList.title}>{item.workOrder}</Text>
            <Text style={stylesList.value}>{item.workCenter}</Text>
          </View>
          <View style={stylesList.row}>
            <Text style={stylesList.label}>{item.equipmentInform}</Text>
            <Text style={stylesList.value}>{item.equipmentFound}</Text>
            {/* {item.equipmentFound && <Text style={{ ...stylesList.value, ...stylesList.badge }}>{item.equipmentFound}</Text>} */}
          </View>
          <View style={stylesList.row}>
            <Text style={stylesList.label}>{item.objectTypeInform}</Text>
            {/* {item.objectTypeFound && <Text style={{ ...stylesList.value, ...stylesList.badge }}>{item?.objectTypeFound}</Text>} */}
          </View>
          <View style={stylesList.row}>
            <Text style={stylesList.value}>{item.shotText}</Text>
          </View>
          <View style={stylesList.row}>
            <Text style={stylesList.value}>{item.customerNumber}</Text>
          </View>
          <View style={stylesList.row}>
            <Text style={stylesList.value}>{item.customerDescription}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View
        style={{
          flex: 4,
        }}>
        <View style={{ flexDirection: 'column' }}>
          {workOrderDataVanSubFilter.length > 0 ?
            <FlatList
              data={listItem}
              initialNumToRender={10}
              renderItem={renderItem}
              keyExtractor={(item: any, index: number) => `select-list-${index}`}
            /> : <DataNotFound />}
        </View>
      </View>
    )
  }

  const renderItem = ({ item, index }: any) => {
    return item;
  };

  const statusWorkOrderAmount = (type: string) => {
    const data = workOrderDataVanSubFilter.filter((v: any) => v.approveAction === type)
    return data.length > 0 ? data.length : 0
  }

  // 91590106
  return (
    <>
      {/* <Animated.View> */}
      <View style={{ width: '100%' }}>
        <AppBar title="อนุมัติเปลี่ยนฯ"></AppBar>
      </View>
      {/* <SafeAreaView> */}
      {workOrderDataVanSubFilter.length > 0 &&
        <>
          <View style={{ display: 'flex', flexDirection: 'row', padding: 20, paddingBottom: 0 }}>
            <Text style={[styles.labelStyle, { marginRight: 20 }]}>ทั้งหมด: {workOrderDataVanSubFilter?.length} รายการ</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', padding: 20, paddingBottom: 0 }}>
            <Text style={[styles.labelStyle, { marginRight: 20 }]}>Approved: {statusWorkOrderAmount('approved')} รายการ</Text>
            <Text style={[styles.labelStyle, { marginRight: 20 }]}>เปลี่ยนช่าง: {statusWorkOrderAmount('change_van')} รายการ</Text>
          </View>
        </>
      }
      <Search />
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <ScrollView contentContainerStyle={stylesList.scrollContent}>
          <LayoutApproveWorkList />
        </ScrollView>
      </View>
      {/* </SafeAreaView> */}
      {ModalApproveChange()}
      {/* </Animated.View> */}
      <Loading loading={isLoading} />
    </>
  );
};

export default ApproveWorkListPage;
const stylesList = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
    paddingVertical: 0,
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  content: {
    width: '100%',
    paddingBottom: 100, // กันไม่ให้เนื้อหาทับ footer
    flexDirection: 'column'
  },
  footer: {
    height: 100,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // สำคัญ! เว้นพื้นที่ให้ปุ่มไม่ทับเนื้อหา
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  deleteText: {
    fontSize: 14,
    color: '#FF4D4D',
    fontFamily: Fonts.Prompt_Medium,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badge: {
    backgroundColor: '#FFA500', // สีส้ม
    borderColor: '#FFC07A',
    opacity: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    minWidth: 100,
    color: '#fff'
  },



});