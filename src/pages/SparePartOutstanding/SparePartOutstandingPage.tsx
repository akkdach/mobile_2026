import { Flex, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, FlatList, ImageBackground, Text, TouchableHighlight, View } from 'react-native';
import { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import { Button, DataTable, Dialog, Portal } from 'react-native-paper';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import DropdownSelect from '../../components/DropdownSelect';
import Scanner from '../../components/Scanner';
import TextInputComponent from '../../components/TextInput';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { SparePartOutstanding } from '../../models/SparePartOutstanding';
import { IWorkOrderSparePartStorage } from '../../models/WorkOrderSparePart';
import { fetchCheckOutLackOfSpareParts, fetchCheckOutLackOfSparePartsList } from '../../services/workOrderCheckout';
import { FullArrayTextSearch } from '../../utils/FullTextSearch';
import {styleLg,styleSm} from './SparePartOutstandingCss'


type InterfaceProps = {
  orderId: string;
  confirmModalSparePart: (value: boolean) => void,
  cancelModalSparePart: () => void
};


const SparePartOutstandingPage = (props) => {
  const params = props.route?.params as InterfaceProps;
  const { control, getValues, watch, setValue } = useForm<{ search: string, countRetrive: any }>();
  const [componentsValue, setComponentsValue] = useState<SparePartOutstanding[]>([]);
  const [componentsValueClone, setComponentsValueClone] = useState<SparePartOutstanding[]>([]);
  const [visible, setVisible] = useState(false);
  const [componentByItem, setComponentByItem] = useState<any>()
  const [valueOrderCode, setValueOrderCode] = useState<any>(null);
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([]);
  const [scan, setScan] = useState(false);
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

  const [componentStorageMasterValue, setComponentStorageMasterValue] = useState<
    IWorkOrderSparePartStorage[]
  >([]);
  const [componentStorageValue, setComponentStorageValue] = useState<
    IWorkOrderSparePartStorage[]
  >([]);

  useEffect(() => {
    (async () => {
      const result = (await fetchCheckOutLackOfSparePartsList(params.orderId)).dataResult
      setComponentsValueClone(result ? result : [])
      setComponentsValue(result ? result : [])

      // console.log(JSON.stringify(result, null, 2))
      const response: any = result?.map((item: any) => {
        return { label: `${item.code}: ${item.sparePartsName}`, value: item.code };
      });
      setItemsOrderCode(response);

    })();
  }, [])

  const onRetriveSparepart = (item: SparePartOutstanding, index: number) => {
    // console.log('[item]', item)
    // console.log('[index]', index)

    setComponentByItem({ ...{ key: index }, ...item })
    setValue('countRetrive', `${item?.quantity}`);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const addRetrive = () => {
    setComponentByItem(
      (previousValue: any) => ({
        ...previousValue,
        ...{ quantity: previousValue.quantity + 1 }
      })
    );
  };

  const removeRetrive = () => {
    setComponentByItem((previousValue: any) => ({
      ...previousValue,
      ...{ quantity: previousValue.quantity >= 0 ? previousValue.quantity - 1 : 0 }
    }))
  };

  const confirmSparePart = () => {
    const newArray: any = [...componentsValue]
    
    console.log('[componentStorageByItem]', componentByItem)
    const { key, ...item } = componentByItem
    console.log(item);
    if (getValues("countRetrive")) {
      newArray[key] = {
        ...item,
        ...{
          quantity: Number(getValues("countRetrive"))
        },
      }
    } else {
      newArray[key] = item;
    }
// console.log('[newArray]', newArray)
    setComponentsValue(newArray)
    setVisible(false);
    setComponentByItem({})
  };

  const cancelSparePart = () => {
    setVisible(false)
    setComponentByItem({})
  }

  const saveSpareParse = async () => {
    Alert.alert(
      "แจ้งเตือน",
      "คุณต้องการบันทึกข้อมูล ?",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            const result = await postSpareParse()
            params.confirmModalSparePart(result)
          }
        }
      ]
    );
  };

  const postSpareParse = async () => {
    try {
      var param = componentsValue.filter((item:any)=>item.quantity>0)
      const response = await fetchCheckOutLackOfSpareParts({ workOrder: params.orderId, sparePartsItem: param })
      if (response.isSuccess) {
        Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ')
        return true;
      } else {
        Alert.alert('แจ้งเตือน', response.message)
        return false
      }
    } catch (error:any) {
      Alert.alert('แจ้งเตือน', error.message)
      return false
    }
  }

  const onSearch = (input:string)=>{
    (async () => {
      const result = (await fetchCheckOutLackOfSparePartsList(params.orderId,input)).dataResult
      setComponentsValueClone(result ? result : [])
      setComponentsValue(result ? result : [])

      // console.log(JSON.stringify(result, null, 2))
      const response: any = result?.map((item: any) => {
        return { label: `${item.code}: ${item.sparePartsName}`, value: item.code };
      });
      setItemsOrderCode(response);

    })();
  }
  const setFilterSparePart = (val: string) => {
    console.log('val',val);
    if (val) {
      const temp = (FullArrayTextSearch(componentsValue, val))
      console.log(temp);
      if(temp.length > 100){
        setComponentsValue(temp)
      }else{
        onSearch(val);
      }
    } else {
      setComponentsValue([...componentsValueClone, ...componentsValue])
    }
  };

  const onValueScanner = (e: BarCodeReadEvent) => {
    console.log('barcode value =====>', e);
    setValueOrderCode(e.data);
    setScan(false)
    setFilterSparePart(e.data)
  };


  const filterSparePart = () => {
    const searchTxt = getValues('search');
    setValueOrderCode('');
    setFilterSparePart(searchTxt);
    onSearch(searchTxt)
  };

  const Search = () => {
    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        {/* <View style={{ flex: 1 }}>
          <DropdownSelect
            selects={valueOrderCode}
            dataItem={itemsOrderCode}
            placeholder={'รหัส'}
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
              console.log('val ====>', val)
              setValueOrderCode(val);
              setFilterSparePart(val);
            }}
            showValueOnly={true}
          />
        </View> */}
        <View style={{ flex: 2, paddingRight: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={[styles.input ,{ height: 52, width: '100%' }]}
                onChangeText={(value: string) => { onChange(value), filterSparePart() }}
                onBlur={filterSparePart}
              />
            )}
            name="search"
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => setScan(true)}>
            <Icon name="qrcode" size={50} color={COLOR.gray}></Icon>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const SparePartModal = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text style={styles.modalTitle}>เพิ่ม</Text>
            <View style={styles.modalContent}>
              {/* <Icon
                name="minus-circle"
                style={styles.modalIconMinus}
                onPress={removeRetrive}></Icon>
              <Text style={{ fontSize: 45 }}>{componentByItem?.quantity}</Text>
              <Icon
                name="plus-circle"
                style={styles.modalIconPlus}
                onPress={addRetrive}></Icon> */}
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInputComponent
                      maxLength={6}
                      keyboardType={'numeric'}
                      value={value}
                      style={{
                        width: 320,
                        fontSize: 35,
                        paddingLeft: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                      onChangeText={(value: string) => onChange(value)}
                      onBlur={onBlur}
                    />
                  )}
                  name="countRetrive"
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <View style={{ marginRight: 10 }}>
              <Button
                onPress={cancelSparePart}
                style={{
                  backgroundColor: COLOR.gray,
                  width: 152,
                  borderRadius: 50,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 20,
                    color: COLOR.white,
                  }}>
                  ยกเลิก
                </Text>
              </Button>
            </View>
            <View>
              <Button
                onPress={confirmSparePart}
                style={{
                  backgroundColor: COLOR.primary,
                  width: 152,
                  borderRadius: 50,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 20,
                    color: COLOR.white,
                  }}>
                  ตกลง
                </Text>
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const SparePartFooter = () => {
    return (
      <View style={{
        width: '100%',
        height: '15%',
        position: 'absolute',
        bottom: 0,
        marginBottom:screenInfo.width < 500 ?  50 : 10
      }}>
        <Flex justify="center">
          <Button
            onPress={params.cancelModalSparePart}
            style={{
              backgroundColor: COLOR.gray,
              height: 62,
              padding: 8,
              width: 152,
              borderRadius: 50,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.white,
              }}>
              ยกเลิก
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={saveSpareParse}
            style={{
              height: 62,
              padding: 8,
              width: 152,
              borderRadius: 50,
              backgroundColor: COLOR.secondary_primary_color,
            }}>
            <Text style={{ fontFamily: Fonts.Prompt_Light, fontSize: 20 }}>
              บันทึก
            </Text>
          </Button>
        </Flex>
      </View>

    );
  };

  const renderItem = ({ item, index }: any) => {
    return item;
  };


  const SpareParts = () => {
    let listItem: any = [];
    componentsValue.map((item: SparePartOutstanding, index: number) => {
      listItem.push(
        <DataTable.Row key={`${item?.code}-${index}`}>
          <DataTable.Cell>
            <Text style={styles.dataTable_cell}>
              {item?.code.replace(/^0+/, '')}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 3 }}>
            <Text style={styles.dataTable_cell}>{item?.sparePartsName}</Text>
          </DataTable.Cell>
          <DataTable.Cell>
            <Button
              color={COLOR.secondary_primary_color}
              mode="contained"
              onPress={() => onRetriveSparepart(item, index)}>
              <Text style={{ color: COLOR.white }}>
                {item.quantity === 0 && <Icon name="plus" color={COLOR.white} size={12} />}
                {item.quantity}
              </Text>
            </Button>
          </DataTable.Cell>
        </DataTable.Row>
      )
    })

    return (
      <View style={{ height: '100%', padding: 10 }}>
        {Search()}
        <View style={{ height: '80%' }}>
          <DataTable>
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              <DataTable.Title>
                <Text style={styles.dataTableTitle}>รหัส</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 3 }}>
                <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.dataTableTitle}>ค้าง</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.2 }}>
              <Text ></Text>
              </DataTable.Title>
            </DataTable.Header>

            <FlatList
              data={listItem}
              initialNumToRender={10}
              renderItem={renderItem}
              keyExtractor={(item: any, index: number) => `select-list-${index}`}
            />
          </DataTable>
        </View>
      </View>
    )
  }

  return (
    <>
      <View style={{ top: -22 }}>
        <AppBar title="รายการค้างอะไหล่"></AppBar>
      </View>
      <ImageBackground
        key={"ImageBackground"}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../assets/images/bg.png')}>
        <View style={{ width: screenInfo.width < 500 ? 380 : 800 }}>
          {scan && (
            <Scanner
              title="Spare Part No."
              onValue={e => onValueScanner(e)}
              onClose={() => setScan(false)}
            />
          )}
          {!scan && (
            <>
              {SpareParts()}
              {SparePartFooter()}
              {SparePartModal()}
            </>
          )}

        </View>
      </ImageBackground>
    </>
  );
};

export default SparePartOutstandingPage;
