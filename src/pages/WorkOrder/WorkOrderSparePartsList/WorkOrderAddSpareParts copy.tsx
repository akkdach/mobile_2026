import { Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button, DataTable, Dialog, Portal } from 'react-native-paper';
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
import { IWorkOrderSparePartStorage } from '../../../models/WorkOrderSparePart';
import { fetchWorkOrderSparepartStorage } from '../../../services/workOrderSparepart';
import { FullArrayTextSearch } from '../../../utils/FullTextSearch';
import { styleLg, styleSm } from './WorkOrderSparePartListCss';
import { Grid } from 'react-native-easy-grid';
import { useNavigation, StackActions } from '@react-navigation/native';

let screenWidth = Dimensions.get('window').width;

if (screenWidth < 690) {
  screenWidth = screenWidth * 1.2
}

function WorkOrderAddSparePartsPage(props: any) {
  const { control, setValue, watch, getValues } =
    useForm<{ search: string; countRetrive: any }>();
  const { orderId } = props;
  const [valueOrderCode, setValueOrderCode] = useState<any>(null);
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [componentStorageValue, setComponentStorageValue] = useState<
    IWorkOrderSparePartStorage[]
  >([]);
  const [componentCloneStorageValue, setComponentCloneStorageValue] = useState<
    IWorkOrderSparePartStorage[]
  >([]);
  const [componentStorageMasterValue, setComponentStorageMasterValue] =
    useState<IWorkOrderSparePartStorage[]>([]);
  const [componentStorageByItem, setComponentStorageByItem] = useState<any>();
  const [scan, setScan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');

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

  const hideDialog = () => setVisible(false);

  const getWorkOrderSparePart = async () => {
    setIsLoading(true);
    try {
      const result: any = (await fetchWorkOrderSparepartStorage(orderId))
        .dataResult;
      const newArray = result
        ? result
          ?.map((item: any) => {
            if (item.znew > 0) {
              return {
                ...item,
                ...{ countRetrive: 0 },
                ...{ add: false },
              };
            }
            return {
              ...item,
              ...{ countRetrive: 0 },
              ...{ add: false },
            };
          })
          .map((val: any) => {
            if (props.componentMasterVal) {
              const matchMaterial = props.componentMasterVal.find(
                (component: any) => component.material === val.material,
              );
              if (matchMaterial) {
                return {
                  ...val,
                  ...{
                    countRetrive: matchMaterial.requirementQuantity,
                    znew: val.znew - matchMaterial.requirementQuantity,
                    add: true,
                  },
                };
              }
            }
            return val;
          })
        : [];
      const response = result
        ? result?.map((item: any) => {
          return { label: item.material, value: item.material };
        })
        : [];
      setItemsOrderCode(response);
      setComponentStorageValue(newArray);
      setComponentStorageMasterValue(newArray);
      setComponentCloneStorageValue(newArray);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message, [
        { text: 'ตกลง', onPress: () => console.log('OK Pressed') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  watch(observe => {
    if (observe.search && observe.search.length > 3) {
      setComponentStorageValue(
        FullArrayTextSearch(componentStorageMasterValue, observe.search),
      );
    } else if (
      observe.search === undefined ||
      observe.search === null ||
      observe.search.length === 0
    ) {
      setComponentStorageValue(componentStorageMasterValue);
    }
  });

  useEffect(() => {
    getWorkOrderSparePart();
  }, []);

  const addRetrive = () => {
    setComponentStorageByItem((previousValue: any) => {
      if (previousValue.countRetrive >= previousValue.znew) {
        return previousValue;
      }
      return {
        ...previousValue,
        ...{ countRetrive: previousValue.countRetrive + 1 },
      };
    });
  };

  const removeRetrive = () => {
    setComponentStorageByItem((previousValue: any) => ({
      ...previousValue,
      ...{
        countRetrive:
          previousValue.countRetrive > 0 ? previousValue.countRetrive - 1 : 0,
      },
    }));
  };

  const confirmSparePart = () => {
    const newArray: any = [...componentStorageValue];
    const masterArray: any = [...componentCloneStorageValue];
    if (Object.keys(componentStorageByItem).length != 0) {
      const { key, ...item } = componentStorageByItem;
      newArray[key] = {
        ...item,
        ...{
          add: Number(getValues('countRetrive')) > 0 ? true : false,
          znew:
            Number(getValues('countRetrive')) > masterArray[key].znew
              ? masterArray[key].znew - masterArray[key].znew
              : masterArray[key].znew - Number(getValues('countRetrive')),
          countRetrive:
            Number(getValues('countRetrive')) > masterArray[key].znew
              ? masterArray[key].znew
              : Number(getValues('countRetrive')),
        },
      };
    }
    setComponentStorageValue(newArray);
    setComponentStorageMasterValue(newArray);
    setVisible(false);
    setComponentStorageByItem({});
  };

  const cancelSparePart = () => {
    setVisible(false);
    setComponentStorageByItem({});
  };

  const onRetriveSparepart = (
    item: IWorkOrderSparePartStorage,
    index: number,
  ) => {
    setComponentStorageByItem({
      ...{ key: index },
      ...item,
    });
    setValue('countRetrive', `${item?.countRetrive}`);
    setVisible(true);
  };

  const submitSparePart = () => {
    const componentStorageSelected = componentStorageValue
      .filter(item => item.add === true)
      .map(item => {
        delete item.add;
        return item;
      });
    navigation.dispatch(StackActions.replace(ROUTE.WORKORDER_SPARE_PART_LIST, {
      componentStorageSelected,
    }));
  };

  const SparePartModal = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text style={styles.modalTitle}>เพิ่ม</Text>
            <View style={styles.modalContent}>
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInputComponent
                      maxLength={6}
                      keyboardType={'numeric'}
                      value={value}
                      style={[styles.sparePartModalInput]}
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

  const generateDataTableRow = (
    item: IWorkOrderSparePartStorage,
    idx: number,
  ) => {
    return (
      <DataTable.Row key={`${item.material}-${idx}`}>
        <DataTable.Cell style={{ flex: screenInfo.width > 500 ? 1 : 0.9 }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.material}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ flex: screenInfo.width > 500 ? 0.5 : 0 }}>
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
        <DataTable.Cell style={{ flex: screenInfo.width > 500 ? 2 : 2.5 }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.matDesc}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ flex: screenInfo.width > 500 ? 1 : 0.7, justifyContent: 'center' }}>
          <Text style={{ ...styles.dataTable_cell }}>{item.znew}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ flex: 1.1, justifyContent: 'center' }}>
          <Button
            color={COLOR.secondary_primary_color}
            mode="contained"
            onPress={() => onRetriveSparepart(item, idx)}>
            <Text style={{ color: COLOR.white }}>{item.countRetrive}</Text>
          </Button>
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const generateDataTableRow2 = (
    item: IWorkOrderSparePartStorage,
    idx: number,
  ) => {
    return (
      <Grid key={`${item.material}-${idx}`} style={{ flexDirection: 'row', padding: 2 }} >
        <Grid style={{ flex: screenInfo.width > 500 ? 1 : 0.9 }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.material}
          </Text>
        </Grid>
        <Grid style={{ flex: screenInfo.width > 500 ? 0.5 : 0 }}>
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
        <Grid style={{ flex: screenInfo.width > 500 ? 2 : 2.5 }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.matDesc}
          </Text>
        </Grid>
        <Grid style={{ flex: screenInfo.width > 500 ? 1 : 0.7, justifyContent: 'center' }}>
          <Text style={{ ...styles.dataTable_cell }}>{item.znew}</Text>
        </Grid>
        <Grid style={{ flex: 1.1, justifyContent: 'center' }}>
          <Button
            color={COLOR.secondary_primary_color}
            mode="contained"
            onPress={() => onRetriveSparepart(item, idx)}>
            <Text style={{ color: COLOR.white }}>{item.countRetrive}</Text>
          </Button>
        </Grid>
      </Grid>
    );
  };

  const SpareParts = () => {
    const listOrder: any = [];
    componentStorageValue.map((item, index) => {
      listOrder.push(generateDataTableRow2(item, index));

    });

    const renderItem = ({ item, index }: any) => {
      return item;
    };

    return (
      <ScrollView >
        <View style={styles.sparePartBodySection}>
          <DataTable style={{ width: screenInfo.width }}>
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              <DataTable.Title style={{ flex: 1 }}>
                <Text style={styles.dataTableTitle}>รหัส</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.5 }}>
                <Text style={styles.dataTableTitle}></Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>
                <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.dataTableTitle}>คงเหลือ</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 1.1, justifyContent: 'center' }}>
                <Text style={styles.dataTableTitle}>เบิกเพิ่ม</Text>
              </DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={listOrder}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `check-list-qi-${index}`}
            />
          </DataTable>
        </View>
      </ScrollView>
    );
  };

  const SparePartFooter = () => {
    return (
      <View style={[styles.sparePartButtonSection, { marginTop: wp('16') }]}>
        <View style={{ justifyContent: 'center' }}>
          <Button
            mode="contained"
            onPress={submitSparePart}
            style={[styles.btnOk]}>
            <Text style={{ fontFamily: Fonts.Prompt_Light, fontSize: 20 }}>
              ตกลง
            </Text>
          </Button>
        </View>
      </View>
    );
  };

  const Search = () => {
    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <View style={{ flex: 2, paddingRight: 20 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{ height: 52, width: '100%' }}
                onChangeText={(value: string) => onChange(value)}
                onBlur={onBlur}
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

  const onValueScanner = (e: BarCodeReadEvent) => {
    setScan(false);
    if (e.data && e.data.length > 3) {
      setComponentStorageValue(
        FullArrayTextSearch(componentStorageMasterValue, e.data),
      );
    } else if (e.data === undefined || e.data === null || e.data.length === 0) {
      setComponentStorageValue(componentStorageMasterValue);
    }
    setValue('search', e.data);
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
        <AppBar
          title="เพิ่มอะไหล่"
          rightTitle={`Order: ${props.orderId}`}></AppBar>
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
            {Search()}
            {SpareParts()}
            {SparePartFooter()}
          </>
        )}
      </ImageBackground>
      <Loading loading={isLoading} />
    </>
  );
}

// const styles = StyleSheet.create({
//   dataTableTitle: {
//     color: COLOR.white,
//     fontSize: 18,
//     fontFamily: Fonts.Prompt_Medium,
//   },
//   modalTitle: {
//     textAlign: 'center',
//     fontSize: 24,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     fontFamily: Fonts.Prompt_Medium,
//   },
//   modalContent: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 30,
//   },
//   modalIconMinus: {fontSize: 80, marginRight: 30, color: 'red'},
//   modalIconPlus: {fontSize: 80, marginLeft: 30, color: '#33C3FF'},
//   sparePartBodySection: {
//     width: '100%',
//     height: hp(80),
//     padding: 10,
//   },
//   sparePartButtonSection: {
//     position: 'absolute',
//     top: '80%',
//     bottom: 0,
//     marginTop: -10,
//     left: '50%',
//     transform: [{translateX: -0.5 * 150}],
//   },
//   dataTable_cell: {
//     fontFamily: Fonts.Prompt_Light,
//     fontSize: 14.5,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalView: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: '#F194FF',
//   },
//   buttonClose: {
//     backgroundColor: '#2196F3',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 30,
//     fontFamily: Fonts.Prompt_Light,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

export default WorkOrderAddSparePartsPage;
