import {Flex, Icon} from '@ant-design/react-native';
import React, {FC, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import {Button, DataTable, Dialog, Portal} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DropdownSelect from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {ROUTE} from '../../../constants/RoutePath';
import {ISparePartRequest} from '../../../models/WorkOrderSparePart';
import {
  fetchSparePartTransferRequest,
  postSparePartReservationRequest,
} from '../../../services/sparePart';
import {ellipsis} from '../../../utils/helper';
import {styleSm,styleLg} from './ToolRequestTransferCss';
import { useNavigation, StackActions } from '@react-navigation/native'

const getUniqueListBy = (arr: any[], key: string) => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
};

const screenHeight = Dimensions.get('window').height;

const ToolRequestTransferPage = (props) => {
  const { profile, componentStorageSelected } = props.route.params;
  const [visible, setVisible] = useState(false);
  const [componentsMasterValue, setComponentsMasterValue] = useState<
    ISparePartRequest[]
  >([]);
  const [componentsValue, setComponentsValue] = useState<ISparePartRequest[]>(
    [],
  );
  const [componentByItem, setComponentByItem] = useState<any>();
  const [selectTransferTo, setSelectTransferTo] = useState<
    string | undefined
  >();
  const [transferToList, setTransferToList] = useState<
    {label: string; value: string}[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }
  
  },[screenInfo]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSparePartTransferRequest('tool');
      const transferList = result.dataResult?.map(val => {
        return {label: val, value: val};
      }, []) as {label: string; value: string}[];
      setTransferToList(transferList);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (componentStorageSelected) {
      const componentStorage = componentStorageSelected;
      console.log('componentStorage::', componentStorage);
      const newComponent: any = componentStorage.map(
        (item: ISparePartRequest) => {
          return {
            workOrderComponentId: 0,
            material: item.material,
            materialDescription: item.materialDescription,
            quantity: item.countRetrive,
            unit: item.unit,
            moveType: false,
            imageUrl: item.imageUrl,
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
  }, [componentStorageSelected]);

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

  const addRetrive = () => {
    setComponentByItem((previousValue: ISparePartRequest) => {
      if (componentStorageSelected) {
        const findStorage: any = componentStorageSelected.find(
          (val: any) => val.material === previousValue.material,
        );
        if (findStorage && previousValue.quantity >= findStorage.maxQuantity) {
          return {
            ...previousValue,
            ...{quantity: previousValue.quantity},
          };
        }
      }
      return {
        ...previousValue,
        ...{quantity: previousValue.quantity + 1},
      };
    });
  };

  const removeRetrive = () => {
    setComponentByItem((previousValue: ISparePartRequest) => ({
      ...previousValue,
      ...{
        quantity: previousValue.quantity >= 0 ? previousValue.quantity - 1 : 0,
      },
    }));
  };

  const confirmSparePart = () => {
    const newArray: any = [...componentsValue];
    const {key, ...item} = componentByItem;
    newArray[key] = item;
    setComponentsValue(newArray);
    setComponentsMasterValue(newArray);
    setVisible(false);
    setComponentByItem({});
  };

  const cancelSparePart = () => {
    setVisible(false);
    setComponentByItem({});
  };

  const hideDialog = () => setVisible(false);

  const onRetriveSparepart = (item: ISparePartRequest, index: number) => {
    setComponentByItem({...{key: index}, ...item});
    setVisible(true);
  };

  const deleteSparepartList = (index: number) => {
    const newArray = [...componentsValue];
    newArray.splice(index, 1);
    setComponentsValue(newArray);
    setComponentsMasterValue(newArray);
  };

  const saveSpareParse = async () => {
    if (selectTransferTo === undefined || selectTransferTo?.length === 0) {
      Alert.alert('แจ้งเตือน', `กรุณาเลือกขอโอนจาก`);
      return;
    }
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
          material: item.material,
          quantity: item.quantity,
          description: item.materialDescription,
        };
      });
      const payload = {
        stge_loc: selectTransferTo,
        items: components,
        material_type: 'tool',
      };
      const result = await postSparePartReservationRequest(payload);
      if (result.isSuccess) {
        Alert.alert('แจ้งเตือน', result.message, [
          {
            text: 'ตกลง',
            onPress: async () => {
              setComponentsValue([]);
              setComponentsMasterValue([]);
              loadAllData();
            },
          },
        ]);
      } else {
        Alert.alert('แจ้งเตือน', result.message);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
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
              <Text style={{fontSize: 45}}>{componentByItem?.quantity}</Text>
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

  const SparePartFooter = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '15%',
        }}>
        <Flex justify="center" style={{marginTop: wp('18')}}>
          <Button
            mode="contained"
            onPress={saveSpareParse}
            style={[styles.btn,{backgroundColor: COLOR.secondary_primary_color}]}>
            <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 20}}>
              บันทึก
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setComponentsValue([]);
              setComponentsMasterValue([]);
            }}
            style={[styles.btn,{
              backgroundColor: '#ffffff',
              borderColor: COLOR.secondary_primary_color,
            }]}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Light,
                fontSize: 20,
                color: 'black',
              }}>
              ยกเลิก
            </Text>
          </Button>
          <View style={{marginLeft: 10}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (
                  selectTransferTo === undefined ||
                  selectTransferTo?.length === 0
                ) {
                  Alert.alert('แจ้งเตือน', `กรุณาเลือกขอโอนจาก`);
                  return;
                }
                navigation.dispatch(
                  StackActions.push(ROUTE.TOOLS_ADD_REQUEST_TRANSFER, {
                    profile: profile,
                    stge_loc: selectTransferTo,
                    componentVal: componentsValue,
                    componentMasterVal: componentsMasterValue,
                  })
                );
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
    );
  };

  const Search = () => {
    return (
      <View style={{flexDirection: 'row', padding: 10}}>
        <View style={{flex: 2, paddingRight: 10}}>
          <DropdownSelect
            selects={selectTransferTo}
            dataItem={transferToList}
            onValueChange={value => {
              if (
                componentsValue.length > 0 ||
                componentsMasterValue.length > 0
              ) {
                if (selectTransferTo !== value) {
                  Alert.alert(
                    'แจ้งเตือน',
                    selectTransferTo === 'undefined' ||
                      selectTransferTo === null
                      ? `ต้องการเปลี่ยนเป็น ${value} ใช่หรือไม่?`
                      : `ต้องการเปลี่ยนจาก ${selectTransferTo} เป็น ${value} ใช่หรือไม่?`,
                    [
                      {
                        text: 'ยกเลิก',
                        onPress: async () => {
                          setSelectTransferTo(selectTransferTo);
                        },
                      },
                      {
                        text: 'ตกลง',
                        onPress: async () => {
                          setSelectTransferTo(value as string);
                          setComponentsMasterValue([]);
                          setComponentsValue([]);
                        },
                      },
                    ],
                  );
                }
                return;
              }
              setSelectTransferTo(value as string);
            }}
            placeholder={'ขอโอนจาก'}
            textStyle={{color: COLOR.white}}
            containerStyle={styles.containerStyle}
            containerTextStyle={styles.containerTextStyle}
            iconStyle={styles.iconStyle}
            contentContainerStyle={{borderRadius: 25}}
            isIcon={true}
            maxLimit={50}
            showValueOnly={true}
          />
        </View>
      </View>
    );
  };

  const generateDataTableRow = (item: ISparePartRequest, index: number) => {
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
        <DataTable.Cell style={{flex: 4}}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.materialDescription}
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
              {item.quantity ? item.quantity : 1}
            </Text>
          </Button>
        </DataTable.Cell>
        <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.dataTable_cell}>{item?.unit}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
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
      </DataTable.Row>
    );
  };

  const SpareParts = () => {
    const listOrder: any = [];
    componentsValue.forEach((item: ISparePartRequest, index: number) => {
      listOrder.push(generateDataTableRow(item, index));
    });

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View style={{paddingLeft: 5, paddingRight: 5, height: hp(80)}}>
        <DataTable>
          <DataTable.Header style={{backgroundColor: COLOR.primary}}>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 0.5}}>
              <Text style={styles.dataTableTitle}></Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 4}}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>
              <Text style={styles.dataTableTitle}>ใช้เบิก</Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>
              <Text style={styles.dataTableTitle}>หน่วย</Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>&nbsp;</DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={listOrder}
            initialNumToRender={5}
            renderItem={renderItem}
            keyExtractor={(item, index) => `spare-part-list-${index}`}
          />
        </DataTable>
      </View>
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

  return (
    <>
      {_buildModalSparePart()}
      <BackGroundImage
        components={
          <>
            <AppBar
              title="ขอโอนเครื่องมือ"
              rightTitle={`${profile.wk_ctr}`}
              replacePath={ROUTE.TOOLS}></AppBar>
            {SparePartModal()}
            {Search()}
            {DrawHorizontalWidget()}
            {SpareParts()}
            {SparePartFooter()}
          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default ToolRequestTransferPage;
