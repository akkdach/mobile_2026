import {Icon} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Button, DataTable, Dialog, Portal} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import Scanner from '../../../components/Scanner';
import TextInputComponent from '../../../components/TextInput';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {ROUTE} from '../../../constants/RoutePath';
import {ISparePartRequest} from '../../../models/WorkOrderSparePart';
import {fetchSparePartAddTransferRequest} from '../../../services/sparePart';
import {FullArrayTextSearch} from '../../../utils/FullTextSearch';
import { useNavigation, StackActions } from '@react-navigation/native'

const screenHeight = Dimensions.get('window').height;

function ToolAddRequestTransferPage(props: any) {
  const {control, setValue, watch, getValues} =
    useForm<{search: string; countRetrive: string}>();
  const {wk_ctr} = props;
  const [valueOrderCode, setValueOrderCode] = useState<any>(null);
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [componentStorageValue, setComponentStorageValue] = useState<
    ISparePartRequest[]
  >([]);
  const [componentStorageMasterValue, setComponentStorageMasterValue] =
    useState<ISparePartRequest[]>([]);
  const [componentCloneStorageValue, setComponentCloneStorageValue] = useState<
    ISparePartRequest[]
  >([]);
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
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }
  
  },[screenInfo]);

  const hideDialog = () => setVisible(false);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetchSparePartAddTransferRequest(
        props.stge_loc,
        'tool',
      );
      const newArray = response.dataResult
        ? response.dataResult
            ?.map((item: any) => {
              if (item.quantity > 0) {
                return {
                  ...item,
                  ...{countRetrive: 0},
                  ...{add: false},
                  maxQuantity: item.quantity,
                };
              }
              return {
                ...item,
                ...{countRetrive: 0},
                ...{add: false},
                maxQuantity: item.quantity,
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
                      countRetrive: matchMaterial.quantity,
                      maxQuantity: val.maxQuantity - matchMaterial.quantity,
                      add: true,
                    },
                  };
                }
              }
              return val;
            })
        : [];
      const results = response.dataResult
        ? response.dataResult?.map((item: any) => {
            return {label: item.material, value: item.material};
          })
        : [];
      setItemsOrderCode(results);
      setComponentStorageValue(newArray);
      setComponentStorageMasterValue(newArray);
      setComponentCloneStorageValue(newArray);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  watch(observe => {
    if (observe.search && observe.search.length > 1) {
      setComponentStorageValue(
        FullArrayTextSearch(componentStorageMasterValue, observe.search),
      );
    } else {
      // setComponentStorageValue([...componentStorageMasterValue, ...componentStorageValue]);
      setComponentStorageValue(componentStorageMasterValue);
    }
  });

  useEffect(() => {
    loadAll();
  }, []);

  const confirmTool = () => {
    const newArray: any = [...componentStorageValue];
    const masterArray: any = [...componentCloneStorageValue];
    const {key, ...item} = componentStorageByItem;
    newArray[key] = {
      ...item,
      ...{
        add: Number(getValues('countRetrive')) > 0 ? true : false,
        quantity:
          Number(getValues('countRetrive')) > masterArray[key].quantity
            ? masterArray[key].quantity - masterArray[key].quantity
            : masterArray[key].quantity - Number(getValues('countRetrive')),
        maxQuantity: masterArray[key].maxQuantity,
        znew:
          Number(getValues('countRetrive')) > masterArray[key].quantity
            ? masterArray[key].quantity - masterArray[key].quantity
            : masterArray[key].quantity - Number(getValues('countRetrive')),
        countRetrive:
          Number(getValues('countRetrive')) > masterArray[key].quantity
            ? masterArray[key].quantity
            : Number(getValues('countRetrive')),
      },
    };
    setComponentStorageValue(newArray);
    setComponentStorageMasterValue(newArray);
    setVisible(false);
    setComponentStorageByItem({});
  };

  const cancelTool = () => {
    setVisible(false);
    setComponentStorageByItem({});
  };

  const onRetriveTool = (item: any, index: number) => {
    setComponentStorageByItem({
      ...{key: index},
      ...item,
    });
    setValue('countRetrive', `${item?.countRetrive}`);
    setVisible(true);
  };

  const submitTool = () => {
    const componentStorageSelected = componentStorageValue
      .filter(item => item.add === true)
      .map(item => {
        delete item.add;
        return item;
      });
    // Actions.replace(ROUTE.TOOLS_REQUEST_TRANSFER, {
    //   profile: props.profile,
    //   componentStorageSelected,
    // });
    navigation.dispatch(StackActions.replace(ROUTE.TOOLS_REQUEST_TRANSFER, {
      profile: props.profile,
      componentStorageSelected,
    }));
  };

  const ToolModal = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text style={styles.modalTitle}>เพิ่ม</Text>
            <View style={styles.modalContent}>
              <View>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
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
            <View style={{marginRight: 10}}>
              <Button
                onPress={cancelTool}
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
                onPress={confirmTool}
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

  const generateDataTableRow = (item: any, idx: number) => {
    return (
      <DataTable.Row key={`${item.material}-${idx}`}>
        <DataTable.Cell>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.material}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex05]}>
          <Pressable
            onPress={() => {
              setModalImageVisible(true);
              setActiveImageUriPreview(item.imageUrl || '');
            }}>
            <Image
              style={{...styles.tinyLogo}}
              source={{
                uri: item.imageUrl,
              }}
            />
          </Pressable>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex5]}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.materialDescription}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex1,{justifyContent: 'center'}]}>
          <Text style={{...styles.dataTable_cell}}>{item.quantity}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex1,{justifyContent: 'center'}]}>
          <Button
            color={COLOR.secondary_primary_color}
            mode="contained"
            onPress={() => onRetriveTool(item, idx)}>
            <Text style={{color: COLOR.white}}>{item.countRetrive}</Text>
          </Button>
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const Tools = () => {
    const listOrder: any = [];
    componentStorageValue.map((item, index) => {
      listOrder.push(generateDataTableRow(item, index));
    });

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View style={styles.sparePartBodySection}>
        <DataTable style={{width:'105%'}}>
          <DataTable.Header style={{backgroundColor: COLOR.primary}}>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05]}>
              <Text style={styles.dataTableTitle}></Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex5]}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex1,{ justifyContent: 'center'}]}>
              <Text style={styles.dataTableTitle}>คงเหลือ</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex1,{ justifyContent: 'center'}]}>
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
    );
  };

  const ToolFooter = () => {
    return (
      <View style={[styles.sparePartButtonSection, {marginTop: wp('16')}]}>
        <View style={{justifyContent: 'center'}}>
          <Button
            mode="contained"
            onPress={submitTool}
            style={{
              marginTop: 4,
              height: 62,
              padding: 8,
              width: 152,
              borderRadius: 50,
              backgroundColor: COLOR.secondary_primary_color,
            }}>
            <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 20}}>
              ตกลง
            </Text>
          </Button>
        </View>
      </View>
    );
  };

  const Search = () => {
    return (
      <View style={{flexDirection: 'row', padding: 10}}>
        <View style={{flex: 2, paddingRight: 20}}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{height: 52, width: '100%'}}
                onChangeText={(value: string) => onChange(value)}
                onBlur={onBlur}
              />
            )}
            name="search"
          />
        </View>
        <View style={{marginTop: 12}}>
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
          <View style={{flexDirection: 'row'}}>
            {modalImageVisible && (
              <Image
                style={{resizeMode: 'contain', flex: 1, aspectRatio: 1}}
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
          title="ขอโอนเครื่องมือเพิ่ม"
          rightTitle={props.profile.wk_ctr}></AppBar>
        {scan && (
          <Scanner
            title="Spare Part No."
            onValue={e => onValueScanner(e)}
            onClose={() => setScan(false)}
          />
        )}
        {!scan && (
          <>
            {ToolModal()}
            {Search()}
            {Tools()}
            {ToolFooter()}
          </>
        )}
      </ImageBackground>
      <Loading loading={isLoading} />
    </>
  );
}
const stylesLg = StyleSheet.create({
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontFamily: Fonts.Prompt_Medium,
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalIconMinus: {fontSize: 80, marginRight: 30, color: 'red'},
  modalIconPlus: {fontSize: 80, marginLeft: 30, color: '#33C3FF'},
  sparePartBodySection: {
    width: '100%',
    height: hp(80),
    padding: 10,
  },
  sparePartButtonSection: {
    position: 'absolute',
    top: '80%',
    bottom: 0,
    marginTop: -10,
    left: '50%',
    transform: [{translateX: -0.5 * 150}],
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 14.5,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  flex05:{
    flex:0.5
  },
  flex1:{
    flex:1
  },
  flex5:{
    flex:5
  }
});
const stylesSm = StyleSheet.create({
  flex05:{
    flex:0.5
  },
  flex1:{
    flex:1
  },
  flex5:{
    flex:2
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 12,
    fontFamily: Fonts.Prompt_Medium,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontFamily: Fonts.Prompt_Medium,
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalIconMinus: {fontSize: 80, marginRight: 30, color: 'red'},
  modalIconPlus: {fontSize: 80, marginLeft: 30, color: '#33C3FF'},
  sparePartBodySection: {
    width: '100%',
    height: hp(80),
    padding: 10,
  },
  sparePartButtonSection: {
    position: 'absolute',
    top: '80%',
    bottom: 0,
    marginTop: -10,
    left: '50%',
    transform: [{translateX: -0.5 * 150}],
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 12,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
});

export default ToolAddRequestTransferPage;
