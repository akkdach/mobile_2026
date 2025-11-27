import {Flex, Icon} from '@ant-design/react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import {Button, DataTable, Dialog, Portal} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../components/AppBar';
import Loading from '../../components/loading';
import Scanner from '../../components/Scanner';
import TextInputComponent from '../../components/TextInput';
import {COLOR} from '../../constants/Colors';
import {Fonts} from '../../constants/fonts';
import {ROUTE} from '../../constants/RoutePath';
import {IWorkOrderSparePart} from '../../models/WorkOrderSparePart';
import styles from './SparePartCheckCss';
import { useNavigation, StackActions } from '@react-navigation/native'

const screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

if (screenWidth < 690) {
  screenWidth = screenWidth * 1.2;
}

const SparePartCheckPage = (props: any) => {
  const {control, getValues, watch, setValue} =
    useForm<{search: string; countRetrive: any}>();
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');
  const [visible, setVisible] = useState(false);
  const [scan, setScan] = useState(false);
  const [componentsValue, setComponentsValue] = useState<IWorkOrderSparePart[]>(
    [],
  );
  const [componentsMasterValue, setComponentsMasterValue] = useState<
    IWorkOrderSparePart[]
  >([]);
  const navigation = useNavigation()

  const hideDialog = () => setVisible(false);

  const removeRetrive = () => {
    // setComponentByItem((previousValue: ISparePartRequest) => ({
    //   ...previousValue,
    //   ...{
    //     quantity: previousValue.quantity >= 0 ? previousValue.quantity - 1 : 0,
    //   },
    // }));
  };

  const addRetrive = () => {
    // setComponentByItem((previousValue: ISparePartRequest) => {
    //   if (props.componentStorageSelected) {
    //     const findStorage: any = props.componentStorageSelected.find(
    //       (val: any) => val.material === previousValue.material,
    //     );
    //     if (findStorage && previousValue.quantity >= findStorage.maxQuantity) {
    //       return {
    //         ...previousValue,
    //         ...{quantity: previousValue.quantity},
    //       };
    //     }
    //   }
    //   return {
    //     ...previousValue,
    //     ...{quantity: previousValue.quantity + 1},
    //   };
    // });
  };

  const cancelSparePart = () => {
    setVisible(false);
    // setComponentByItem({});
  };

  const confirmSparePart = () => {
    // const newArray: any = [...componentsValue];
    // const {key, ...item} = componentByItem;
    // newArray[key] = item;
    // setComponentsValue(newArray);
    // setComponentsMasterValue(newArray);
    setVisible(false);
    // setComponentByItem({});
  };

  const onRetriveSparepart = (item: IWorkOrderSparePart, index: number) => {
    // setComponentByItem({...{key: index}, ...item});
    setValue('countRetrive', `${item?.requirementQuantity}`);
    setVisible(true);
  };

  const onValueScanner = (e: BarCodeReadEvent) => {
    setScan(false);
    if (e.data && e.data.length > 0) {
      // setComponentsValue(FullArrayTextSearch(componentsMasterValue, e.data));
      setValue('search', e.data);
    } else if (e.data === undefined || e.data === null || e.data.length === 0) {
      // setComponentsValue(componentsMasterValue);
      setValue('search', e.data);
    }
  };

  const SparePartModal = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text style={styles.modalTitle}>เพิ่ม</Text>
            <View style={styles.modalContent}>
              <Icon
                name="minus-circle"
                style={styles.modalIconMinus}
                onPress={removeRetrive}></Icon>
              {/* <Text style={{fontSize: 45}}>{componentByItem?.quantity}</Text> */}
              <Text style={{fontSize: 45}}>1</Text>
              <Icon
                name="plus-circle"
                style={styles.modalIconPlus}
                onPress={addRetrive}></Icon>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <View style={{marginRight: 10}}>
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

  const Search = () => {
    return (
      <View style={{flexDirection: 'row', padding: 10}}>
        <View style={{flex: 2, paddingRight: 23}}>
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
        <View style={{marginTop: 2}}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => setScan(true)}>
            <Icon name="qrcode" size={50} color={COLOR.gray}></Icon>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const generateDataTableRow = (item: IWorkOrderSparePart, index: number) => {
    return (
      <DataTable.Row key={`${item?.material}-${index}`}>
        <DataTable.Cell>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.material}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={{flex: 0.5}}>
          <Pressable
            onPress={() => {
              setModalImageVisible(true);
              setActiveImageUriPreview(item.sparepartImage || '');
            }}>
            <Image
              style={{...styles.tinyLogo}}
              source={{
                uri: item.sparepartImage,
              }}
            />
          </Pressable>
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            flex: 5,
          }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.matlDesc}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
          <Button
            mode="contained"
            onPress={() => onRetriveSparepart(item, index)}
            style={{
              backgroundColor: COLOR.white,
              borderColor: COLOR.secondary_primary_color,
              borderWidth: 2,
            }}>
            <Text style={{color: COLOR.secondary_primary_color}}>
              {item.requirementQuantity ? item.requirementQuantity : 1}
            </Text>
          </Button>
        </DataTable.Cell>
        {false && (
          <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.dataTable_cell}>
              {item?.requirementQuantityUnit}
            </Text>
          </DataTable.Cell>
        )}
      </DataTable.Row>
    );
  };

  const SpareParts = () => {
    const listOrder: any = [];
    componentsValue.forEach((item: IWorkOrderSparePart, index: number) => {
      listOrder.push(generateDataTableRow(item, index));
    });

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <ScrollView horizontal>
        <View style={{paddingLeft: 5, paddingRight: 5, height: hp(80),width:'100%'}}>
          <DataTable style={{width: screenWidth}}>
            <DataTable.Header style={{backgroundColor: COLOR.primary}}>
              <DataTable.Title style={{flex:0.5}}>
                <Text style={styles.dataTableTitle}>รหัส</Text>
              </DataTable.Title>
              <DataTable.Title style={{flex: 0.5}}>
                <Text style={styles.dataTableTitle}></Text>
              </DataTable.Title>
              <DataTable.Title style={{flex: 2}}>
                <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
              </DataTable.Title>
              <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>
                <Text style={styles.dataTableTitle}>ตรวจนับ</Text>
              </DataTable.Title>
              {false && (
                <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.dataTableTitle}>คงเหลือ</Text>
                </DataTable.Title>
              )}
            </DataTable.Header>
            <FlatList
              data={listOrder}
              initialNumToRender={5}
              renderItem={renderItem}
              keyExtractor={(item, index) => `spare-part-list-${index}`}
            />
          </DataTable>
        </View>
      </ScrollView>
    );
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
          // await postWorkOrderSpareParse();
        },
      },
    ]);
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
            marginBottom:40
          }}>
          <Flex justify="center" style={{marginTop: wp('18'),margin:5}}>
            <Button
              mode="contained"
              style={{
                marginTop: -75,
                marginRight:10,
                height: 62,
                padding: 8,
                width: '40%',
                borderRadius: 50,
                backgroundColor: COLOR.secondary_primary_color,
              }}>
              <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 12}}>
                ลายเซ็น Van Stock
              </Text>
            </Button>
            <Button
              mode="contained"
              style={{
                marginTop: -75,
                
                height: 62,
                padding: 8,
                width: '40%',
                borderRadius: 50,
                backgroundColor: COLOR.secondary_primary_color
              }}>
              <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 12,  }}>
                ลายเซ็นผู้ตรวจ
              </Text>
            </Button>
            </Flex>
            <Flex justify="center" style={{marginTop: wp('18')}}>
            <Button
              mode="contained"
              onPress={saveSpareParse}
              style={{
                marginTop: -75,
                height: 62,
                padding: 8,
                width: '40%',
                borderRadius: 50,
                backgroundColor: COLOR.secondary_primary_color,
              }}>
              <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 20}}>
                บันทึก
              </Text>
            </Button>
            <View style={{marginLeft: 10}}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  // router.Actions.push(ROUTE.WORKORDER_SPARE_PART_ADD, {
                  //   orderId: props.profile.wk_ctr,
                  //   componentVal: componentsValue,
                  //   componentMasterVal: componentsMasterValue,
                  // });
                  navigation.dispatch(StackActions.push(ROUTE.WORKORDER_SPARE_PART_ADD, {
                    orderId: props.profile.wk_ctr,
                    componentVal: componentsValue,
                    componentMasterVal: componentsMasterValue,
                  }));
                }}
                style={{
                  borderRadius: 50,
                  height: 80,
                  width: 80,
                  marginTop: -75,
                  backgroundColor: COLOR.orange,
                }}>
                <View style={{marginLeft: 25, marginTop: 16}}>
                  <Icon
                    name="plus"
                    color={COLOR.white}
                    size={30}
                    style={{position: 'absolute', marginTop: 10}}></Icon>
                </View>
              </TouchableOpacity>
            </View>
          </Flex>
        </View>
      )
    );
  };

  return (
    <React.Fragment>
      {_buildModalSparePart()}
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../assets/images/bg.png')}>
        <AppBar
          title="ตรวจนับอะไหล่"
          rightTitle={`Order: ${props.profile.wk_ctr}`}
          replacePath={ROUTE.SPARE_PART}></AppBar>
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
    </React.Fragment>
  );
};

export default SparePartCheckPage;
