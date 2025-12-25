import { Flex, Icon } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Checkbox, DataTable, Dialog, Portal } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import Scanner from '../../../components/Scanner';
import TextInputComponent from '../../../components/TextInput';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ROUTE } from '../../../constants/RoutePath';
import {
  IWorkOrderSparePart,
  IWorkOrderSparePartStorage,
} from '../../../models/WorkOrderSparePart';
import {
  fetchWorkOrderSparepart,
  fetchWorkOrderSparepartPost,
} from '../../../services/workOrderSparepart';
import { FullArrayTextSearch } from '../../../utils/FullTextSearch';
import { styleSm, styleLg } from './WorkOrderSparePartListCss';
import { Grid } from 'react-native-easy-grid';
import { useNavigation, StackActions } from '@react-navigation/native';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
    webStatus: string;
  };
  componentStorageSelected?: [];
};

const getUniqueListBy = (arr: any[], key: string) => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
};

const screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

if (screenWidth < 690) {
  screenWidth = screenWidth * 1.2;
}



const WorkOrderSparePartsListPage = (
  props,
) => {
  const params = props.route?.params as InterfaceProps
  const { control, getValues, watch, setValue } =
    useForm<{ search: string; countRetrive: any }>();
  const { orderId } = params?.workOrderData;
  const [saleStatus, setSaleStatus] = useState({ checked: false });
  const [visible, setVisible] = useState(false);
  const [componentsMasterValue, setComponentsMasterValue] = useState<
    IWorkOrderSparePart[]
  >([]);
  const [componentsValue, setComponentsValue] = useState<IWorkOrderSparePart[]>(
    [],
  );

  const [componentByItem, setComponentByItem] = useState<any>();

  const [valueOrderCode, setValueOrderCode] = useState<any>(null);
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([]);
  const [scan, setScan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');
  const [openSparePartModal2, setOpenSparePartModal2] = useState(false);
  const [itemSelected,setItemSelected] = useState<any>();
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result = (await fetchWorkOrderSparepart(orderId)).dataResult;
      if (result) {
        console.log('result::', result);
        result.map(item => {
          if (item.requirementQuantity <= 0) {
            item.requirementQuantity = 1;
          }
          return item;
        });
        const response = result.map(item => {
          return { label: item.material, value: item.material };
        }) as any[];
        setItemsOrderCode(response);
      }
      setComponentsValue(result ? result : []);
      setComponentsMasterValue(result ? result : []);
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  watch(observe => {
    if (observe.search && observe.search.length > 3) {
      setComponentsValue(
        FullArrayTextSearch(componentsMasterValue, observe.search),
      );
    } else if (
      observe.search === undefined ||
      observe.search === null ||
      observe.search.length === 0
    ) {
      setComponentsValue(componentsMasterValue);
    }
  });

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (params.componentStorageSelected) {
      const componentStorage = params.componentStorageSelected;
      console.log('componentStorage::', componentStorage);
      const newComponent: any = componentStorage.map(
        (item: IWorkOrderSparePartStorage) => {
          return {
            workOrderComponentId: 0,
            material: item.material,
            matlDesc: item.matDesc,
            requirementQuantity: item.countRetrive,
            requirementQuantityUnit: item.unit,
            moveType: false,
            sparepartImage: item.sparepartImage,
          };
        },
      );
      setComponentsValue(previouseValue => {
        return getUniqueListBy(
          [...previouseValue, ...newComponent],
          'material',
        );
      });
      setComponentsMasterValue(previouseValue => {
        return getUniqueListBy(
          [...previouseValue, ...newComponent],
          'material',
        );
      });
    }
  }, [params.componentStorageSelected]);

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
  const onChangeSaleStatus = () => {
    setSaleStatus({
      checked: !saleStatus.checked,
    });
  };

  const addRetrive = () => {
    setComponentByItem((previousValue: IWorkOrderSparePart) => {
      if (params.componentStorageSelected) {
        const findStorage: any = params.componentStorageSelected.find(
          (val: any) => val.material === previousValue.material,
        );

        if (
          findStorage &&
          previousValue.requirementQuantity >= findStorage.znew
        ) {
          return {
            ...previousValue,
            ...{ requirementQuantity: previousValue.requirementQuantity },
          };
        }
      }
      return {
        ...previousValue,
        ...{ requirementQuantity: previousValue.requirementQuantity + 1 },
      };
    });
  };

  const removeRetrive = () => {
    setComponentByItem((previousValue: IWorkOrderSparePart) => ({
      ...previousValue,
      ...{
        requirementQuantity:
          previousValue.requirementQuantity >= 0
            ? previousValue.requirementQuantity - 1
            : 0,
      },
    }));
  };

  const confirmSparePart = () => {
    componentByItem;
    const newArray: any = [...componentsValue];
    const { key, ...item } = componentByItem;
    if (getValues('countRetrive')) {
      newArray[key] = {
        ...item,
        ...{
          requirementQuantity: Number(getValues('countRetrive')),
        },
      };
    } else {
      newArray[key] = item;
    }
    setComponentsValue(newArray);
    setComponentsMasterValue(newArray);
    setVisible(false);
    setComponentByItem({});
  };

  const confirmSparePart2 = () => {
    componentByItem;
    const newArray: any = [...componentsValue];
    const { key, ...item } = componentByItem;
    if (getValues('countRetrive')) {
      newArray[key] = {
        ...item,
        ...{
          requirementQuantity: Number(getValues('countRetrive')),
        },
      };
    } else {
      newArray[key] = item;
    }
    setOpenSparePartModal2(false);
    // setComponentsValue(newArray);
    // setComponentsMasterValue(newArray);
    // setVisible(false);
    // setComponentByItem({});
  };

  const cancelSparePart = () => {
    setVisible(false);
    setComponentByItem({});
  };

  const hideDialog = () => setVisible(false);

  const onRetriveSparepart = (item: IWorkOrderSparePart, index: number) => {
    setComponentByItem({ ...{ key: index }, ...item });
    setValue('countRetrive', `${item?.requirementQuantity}`);
    setVisible(true);
  };

  const onCheckChange = (item: any, index: number) => {
    let data = { ...item, ...{ moveType: !item.moveType } };
    componentsValue[index] = data;
    setComponentsValue([...componentsValue]);
    setComponentsMasterValue([...componentsValue]);
  };

  const deleteSparepartList = (index: number) => {
    const newArray = [...componentsValue];
    newArray.splice(index, 1);
    setComponentsValue(newArray);
    setComponentsMasterValue(newArray);
  };

  const saveSpareParse = async () => {
    Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          await postWorkOrderSpareParse();
        },
      },
    ]);
  };

  const postWorkOrderSpareParse = async () => {
    setIsLoading(true);
    try {
      const components = componentsValue.map(item => {
        return {
          ...item,
          ...{ workOrder: orderId },
        };
      });
      const result = await fetchWorkOrderSparepartPost(
        components,
        params.workOrderData.orderId,
      );
      if (result.isSuccess) {
        Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
          {
            text: 'ตกลง',
            onPress: async () => {
              navigation.dispatch(StackActions.replace(ROUTE.WORKORDERLIST, params.workOrderData));
            }
          },
        ]);
      } else {
        Alert.alert('แจ้งเตือน', result.message, [
          { text: 'ตกลง', onPress: () => console.log('OK Pressed') },
        ]);
      }
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSparePart = () => {
    const searchTxt = getValues('search');
    setValueOrderCode('');
    setFilterSparePart(searchTxt);
  };

  const setFilterSparePart = (val: string) => {
    const filter = componentsMasterValue.filter(
      component => component.material.indexOf(val) >= 0,
      [] as IWorkOrderSparePart[],
    );
    if (val && val.length > 0) {
      setComponentsValue(filter);
    } else {
      setComponentsValue(componentsMasterValue);
    }
  };


  const SparePartModal2 = () => {
    return (
      <Portal>
        <Dialog visible={openSparePartModal2} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text style={styles.modalTitle}>แก้ไข</Text>
            <View style={styles.modalContent}>
              {/* <Icon
                name="minus-circle"
                style={styles.modalIconMinus}
                onPress={removeRetrive}></Icon>
              <Text style={{fontSize: 45}}>
                {componentByItem?.requirementQuantity}
              </Text>
              <Icon
                name="plus-circle"
                style={styles.modalIconPlus}
                onPress={addRetrive}></Icon> */}
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{alignItems:'center'}}>
                      <Text>{itemSelected.material}</Text>
                      <Text>{itemSelected.matlDesc}</Text>
                      <TextInputComponent
                        maxLength={6}
                        keyboardType={'numeric'}
                        value={itemSelected.requirementQuantity}
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
                    </View>
                  )}
                  name="countRetrive"
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <View style={{ marginRight: 10 }}>
              <Button
                onPress={() => setOpenSparePartModal2(false)}
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
                onPress={confirmSparePart2}
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
              <Text style={{fontSize: 45}}>
                {componentByItem?.requirementQuantity}
              </Text>
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
      !scan && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '15%',
          }}>
          <Flex justify="center" style={{ marginTop: wp('18') }}>
            <Button
              mode="contained"
              onPress={saveSpareParse}
              style={{
                marginTop: -75,
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
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  navigation.dispatch(StackActions.push(ROUTE.WORKORDER_SPARE_PART_ADD, {
                    orderId,
                    componentVal: componentsValue,
                    componentMasterVal: componentsMasterValue,
                    workOrderData: params.workOrderData
                  }));
                }}
                style={{
                  borderRadius: 50,
                  height: 80,
                  width: 80,
                  marginTop: -75,
                  backgroundColor: COLOR.orange,
                }}>
                <View style={{ marginLeft: 25, marginTop: 16 }}>
                  <Icon
                    name="plus"
                    color={COLOR.white}
                    size={30}
                    style={{ position: 'absolute', marginTop: 10 }}></Icon>
                </View>
              </TouchableOpacity>
            </View>
          </Flex>
        </View>
      )
    );
  };

  const Search = () => {
    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <View style={{ flex: 2, paddingRight: 15 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{ height: 52, width: '95%' }}
                onChangeText={(value: string) => onChange(value)}
                onBlur={onBlur}
              />
            )}
            name="search"
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => setScan(true)}>
            <Icon name="qrcode" size={45} color={COLOR.gray}></Icon>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const generateDataTableRow2 = (item: IWorkOrderSparePart, index: number) => {
    return (
      <DataTable.Row key={`${item?.material}-${index}`}>
        <DataTable.Cell style={[styles.flex1]}>
          <Text
            style={[styles.dataTable_cell]}>
            {item.material}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex05]}>
          <Pressable
            onPress={() => {
              setModalImageVisible(true);
              setActiveImageUriPreview(item.sparepartImage || '');
            }}>
            <Image
              style={{ ...styles.tinyLogo }}
              source={{
                uri: item.sparepartImage,
              }}
            />
          </Pressable>
        </DataTable.Cell>
        <DataTable.Cell
          style={[styles.flex4]}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.matlDesc}
          </Text>
        </DataTable.Cell>
        {screenInfo.width > 500 && <DataTable.Cell style={[styles.flex2, { justifyContent: 'center' }]}>
          <Button
            disabled={params.workOrderData.webStatus !== '4' ? false : true}
            mode="contained"
            onPress={() => onRetriveSparepart(item, index)}
            style={{
              backgroundColor: COLOR.white,
              borderColor: COLOR.secondary_primary_color,
              borderWidth: 2,
            }}>
            <Text style={{ color: COLOR.secondary_primary_color }}>
              {item.requirementQuantity ? item.requirementQuantity : 1}
            </Text>
          </Button>
        </DataTable.Cell>}
        {screenInfo.width <= 500 && <DataTable.Cell style={[styles.flex05, { justifyContent: 'center' }]}>
          <Text style={{ color: COLOR.secondary_primary_color }}>
            {item.requirementQuantity ? item.requirementQuantity : 1}
          </Text>
        </DataTable.Cell>}
        <DataTable.Cell style={[styles.flex05, { justifyContent: 'center' }]}>
          <Text style={styles.dataTable_cell}>
            {item?.requirementQuantityUnit}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex1, { justifyContent: 'center' }]}>
          <Checkbox
            color={COLOR.secondary_primary_color}
            status={componentsValue[index].moveType ? 'checked' : 'unchecked'}
            disabled={params.workOrderData.webStatus !== '4' ? false : true}
            onPress={() => onCheckChange(item, index)}
          />
        </DataTable.Cell>
        {params.workOrderData.webStatus !== '4' && (
          <DataTable.Cell style={[styles.flex1]}>
            <TouchableOpacity
              style={{ justifyContent: 'center' }}
              activeOpacity={0.9}
              onPress={() => deleteSparepartList(index)}>
              <View
                style={{
                  width: 60,
                  height: 30,
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
                      fontFamily: Fonts.Prompt_Medium,
                      color: COLOR.white,
                    }}>
                    ลบ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </DataTable.Cell>
        )}
      </DataTable.Row>
    );
  };

  const generateDataTableRow = (item: IWorkOrderSparePart, index: number) => {
    return (
      <Grid style={{ flexDirection: 'row' }} key={`${item?.material}-${index}`}>
        <Grid style={[styles.flex1]}>
          <Text
            style={[styles.dataTable_cell, { paddingLeft: screenWidth > 500 ? 0 : 3 }]}>
            {item.material}
          </Text>
        </Grid>
        <Grid style={[styles.flex05]}>
          <Pressable
            onPress={() => {
              setModalImageVisible(true);
              setActiveImageUriPreview(item.sparepartImage || '');
            }}>
            <Image
              style={{ ...styles.tinyLogo }}
              source={{
                uri: item.sparepartImage,
              }}
            />
          </Pressable>
        </Grid>
        <Grid
          style={[styles.flex4]}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.matlDesc}
          </Text>
        </Grid>
        {screenInfo.width > 500 && <Grid style={[styles.flex2, { justifyContent: 'center' }]}>
          <Button
            disabled={params.workOrderData.webStatus !== '4' ? false : true}
            mode="contained"
            onPress={() => onRetriveSparepart(item, index)}
            style={{
              backgroundColor: COLOR.white,
              borderColor: COLOR.secondary_primary_color,
              borderWidth: 2,
            }}>
            <Text style={{ color: COLOR.secondary_primary_color }}>
              {item.requirementQuantity ? item.requirementQuantity : 1}
            </Text>
          </Button>
        </Grid>}
        {screenInfo.width <= 500 && <Grid style={[styles.flex05, { justifyContent: 'center' }]}>
          <TouchableOpacity 
                      disabled={params.workOrderData.webStatus !== '4' ? false : true}
          onPress={() => onRetriveSparepart(item, index)}>
            <Text style={{ color: COLOR.secondary_primary_color }}>
              {item.requirementQuantity ? item.requirementQuantity : 1}
            </Text>
          </TouchableOpacity>
        </Grid>}
        <Grid style={[styles.flex05, { justifyContent: 'center' }]}>
          <Text style={styles.dataTable_cell}>
            {item?.requirementQuantityUnit}
          </Text>
        </Grid>
        <Grid style={[styles.flex1, { justifyContent: 'center' }]}>
          <Checkbox
            color={COLOR.secondary_primary_color}
            status={componentsValue[index].moveType ? 'checked' : 'unchecked'}
            disabled={params.workOrderData.webStatus !== '4' ? false : true}
            onPress={() => onCheckChange(item, index)}
          />
        </Grid>
        {params.workOrderData.webStatus !== '4' && (
          <Grid style={[styles.flex1]}>
            <TouchableOpacity
              style={{ justifyContent: 'center' }}
              activeOpacity={0.9}
              onPress={() => deleteSparepartList(index)}>
              <View
                style={{
                  width: screenInfo.width > 500 ? 60 : 35,
                  height: 30,
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
                      fontFamily: Fonts.Prompt_Medium,
                      color: COLOR.white,
                    }}>
                    ลบ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Grid>
        )}
      </Grid>
    );
  };


  const SpareParts = () => {
    const listOrder: any = [];
    componentsValue.forEach((item: IWorkOrderSparePart, index: number) => {
      if (screenWidth > 500) {
        listOrder.push(generateDataTableRow2(item, index));
      } else {
        listOrder.push(generateDataTableRow(item, index));
      }

    });

    const renderItem = ({ item, index }: any) => {
      return item;
    };

    return (
      <ScrollView >
        <View style={[styles.ScrollView, { paddingLeft: 1 }]}>
          {screenInfo.width > 500 ? <DataTable style={[styles.datatable1]}>
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              <DataTable.Title style={[styles.flex1]}>
                <Text style={styles.dataTableTitle}>รหัส</Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.flex05]}>
                <Text style={styles.dataTableTitle}></Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.flex4]}>
                <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.flex2, { justifyContent: 'center' }]}>
                <Text style={styles.dataTableTitle}>ใช้เบิก</Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.flex1, { justifyContent: 'center' }]}>
                <Text style={styles.dataTableTitle}>หน่วย</Text>
              </DataTable.Title>
              <DataTable.Title style={[styles.flex1, { justifyContent: 'center' }]}>
                <Text style={styles.dataTableTitle}>ขาย</Text>
              </DataTable.Title>
              {params.workOrderData.webStatus !== '4' && (
                <DataTable.Title style={[styles.flex1]}>&nbsp;</DataTable.Title>
              )}
            </DataTable.Header>
            <FlatList
              data={listOrder}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `spare-part-list-${index}`}
            />
          </DataTable> :
            <>
              <Grid style={{ backgroundColor: COLOR.primary, flexDirection: 'row' }}>
                <Grid style={[styles.flex1]}>
                  <Text style={styles.dataTableTitle}>รหัส</Text>
                </Grid>
                <Grid style={[styles.flex05]}>
                  <Text style={styles.dataTableTitle}></Text>
                </Grid>
                <Grid style={[styles.flex4]}>
                  <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
                </Grid>
                <Grid style={[styles.flex2, { justifyContent: 'center' }]}>
                  <Text style={styles.dataTableTitle}>ใช้เบิก</Text>
                </Grid>
                <Grid style={[styles.flex1, { justifyContent: 'center' }]}>
                  <Text style={styles.dataTableTitle}>หน่วย</Text>
                </Grid>
                <Grid style={[styles.flex1, { justifyContent: 'center' }]}>
                  <Text style={styles.dataTableTitle}>ขาย</Text>
                </Grid>
                {params.workOrderData.webStatus !== '4' && (
                  <Grid style={[styles.flex1]}><Text>&nbsp;</Text></Grid>
                )}
              </Grid>
              <FlatList
                data={listOrder}
                initialNumToRender={5}
                renderItem={renderItem}
                keyExtractor={(item, index) => `spare-part-list-${index}`}
              />
            </>
          }
        </View>
      </ScrollView>
    );
  };

  const onValueScanner = (e: BarCodeReadEvent) => {
    setScan(false);
    if (e.data && e.data.length > 0) {
      setComponentsValue(FullArrayTextSearch(componentsMasterValue, e.data));
      setValue('search', e.data);
    } else if (e.data === undefined || e.data === null || e.data.length === 0) {
      setComponentsValue(componentsMasterValue);
      setValue('search', e.data);
    }
  };

  const _buildModalSparePart = () => (
    <Portal>
      <Dialog
        visible={modalImageVisible}
        onDismiss={() => setModalImageVisible(false)}>
        <Dialog.Content>
          <View style={{ flexDirection: 'row' }}>
            {modalImageVisible && (
              <Image
                style={{ resizeMode: 'contain', flex: 1, aspectRatio: 1 }}
                source={{
                  uri: activeImageUriPreview,
                }}
              />
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              flex: 1,
            }}>
            <Button
              onPress={() => setModalImageVisible(false)}
              style={{
                backgroundColor: COLOR.primary,
                width: 500,
                borderRadius: 50,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: 20,
                  color: COLOR.white,
                }}>
                ปิด
              </Text>
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <>
      {_buildModalSparePart()}
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../../assets/images/bg.png')}>
        {screenInfo.width >= 500 && <AppBar
          title="รายการอะไหล่"
          rightTitle={`Order: ${params.workOrderData.orderId}`}
          replacePath={ROUTE.WORKORDERLIST}
          replaceProps={params.workOrderData}></AppBar>}
        {screenInfo.width <= 500 && <AppBar
          title={`รายการอะไหล่ ${params.workOrderData.orderId}`}
          replacePath={ROUTE.WORKORDERLIST}
          replaceProps={params.workOrderData}></AppBar>}
        {scan && (
          <Scanner
            title="Spare Part No."
            onValue={e => onValueScanner(e)}
            onClose={() => setScan(false)}
          />
        )}
        {!scan && (
          <>
            {SparePartModal()}
            <SparePartModal2 />
            {Search()}
            {SpareParts()}
            {params.workOrderData.webStatus !== '4' && SparePartFooter()}
          </>
        )}
      </ImageBackground>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderSparePartsListPage;
