import { Icon } from '@ant-design/react-native';
import { Grid } from 'react-native-easy-grid';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button, DataTable, Dialog, Portal } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../components/AppBar';
import Loading from '../../components/loading';
import Scanner from '../../components/Scanner';
import TextInputComponent from '../../components/TextInput';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { ROUTE } from '../../constants/RoutePath';
import { ISparePartRequest } from '../../models/WorkOrderSparePart';
import { fetchSparePartAddTransferRequest } from '../../services/sparePart';
import { FullArrayTextSearch } from '../../utils/FullTextSearch';
import { styleSm, styleLg } from './SparePartRequestTransferCss';
import { useNavigation, StackActions } from '@react-navigation/native'

const screenHeight = Dimensions.get('window').height;

function SparePartAddRequestTransferPage(props: any) {
  const { control, setValue, watch, getValues } =
    useForm<{ search: string; countRetrive: string }>();
  const { wk_ctr } = props;
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
  const navigation = useNavigation()

  useEffect(() => {
    console.log('props=>>>>>', props)
    if (screenInfo.width < 400) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, []);
  const hideDialog = () => setVisible(false);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetchSparePartAddTransferRequest(props.stge_loc);
      const newArray = response.dataResult
        ? response.dataResult
          ?.map((item: any) => {
            if (item.quantity > 0) {
              return {
                ...item,
                ...{ countRetrive: 0 },
                ...{ add: false },
                maxQuantity: item.quantity,
              };
            }
            return {
              ...item,
              ...{ countRetrive: 0 },
              ...{ add: false },
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
                    countRetrive: matchMaterial.countRetrive,
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
          return { label: item.material, value: item.material };
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
    if (observe.search && observe.search.length > 3) {
      setComponentStorageValue(
        FullArrayTextSearch(componentStorageMasterValue, observe.search),
      );
    } else if (
      observe.search === undefined ||
      observe.search === null ||
      observe.search.length === 0
    ) {
      // setComponentStorageValue([...componentStorageMasterValue, ...componentStorageValue]);
      setComponentStorageValue(componentStorageMasterValue);
    }
  });

  useEffect(() => {
    loadAll();
  }, []);



  const confirmSparePart = () => {
    const newArray: any = [...componentStorageValue];
    const { key, ...item } = componentStorageByItem;

    const masterArray: any = [...componentCloneStorageValue];

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
    // console.log('masterArray[key]',getValues('countRetrive'));
    setComponentStorageValue(newArray);
    setComponentStorageMasterValue(newArray);
    setVisible(false);
    setComponentStorageByItem({});
  };

  const cancelSparePart = () => {
    setVisible(false);
    setComponentStorageByItem({});
  };

  const onRetriveSparepart = (item: any, index: number) => {
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
    // Actions.replace(ROUTE.SPARE_PART_REQUEST_TRANSFER, {
    //   profile: props.profile,
    //   componentStorageSelected,
    // });
    navigation.dispatch(StackActions.replace(ROUTE.SPARE_PART_REQUEST_TRANSFER, {
      profile: props.profile,
      componentStorageSelected,
    }));
  };

  const SparePartModal = () => {
    return (
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{
            borderRadius: 16,
            backgroundColor: '#fff',
            paddingHorizontal: 12,
          }}
        >
          <Dialog.Content>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 12,
                textAlign: 'center',
                color: COLOR.primary,
                fontFamily: Fonts.Prompt_Medium,
              }}
            >
              เพิ่มจำนวนอะไหล่
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    maxLength={6}
                    keyboardType="numeric"
                    value={value}
                    placeholder="กรอกจำนวนที่ต้องการเบิก"
                    style={{
                      height: 48,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingHorizontal: 16,
                      fontSize: 16,
                      backgroundColor: '#f9f9f9',
                      color: '#333',
                    }}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
                name="countRetrive"
              />
            </View>
          </Dialog.Content>

          <Dialog.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Button
              onPress={cancelSparePart}
              style={{
                backgroundColor: COLOR.gray,
                borderRadius: 24,
                paddingVertical: 6,
                width: '48%',
              }}
            >
              <Text style={{ fontSize: 16, color: COLOR.white, fontFamily: Fonts.Prompt_Medium }}>
                ยกเลิก
              </Text>
            </Button>

            <Button
              onPress={confirmSparePart}
              style={{
                backgroundColor: COLOR.primary,
                borderRadius: 24,
                paddingVertical: 6,
                width: '48%',
              }}
            >
              <Text style={{ fontSize: 16, color: COLOR.white, fontFamily: Fonts.Prompt_Medium }}>
                ตกลง
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };




  const SpareParts = () => {
    const renderItem = ({ item, index }: { item: any; index: number }) => (
      <View
        key={`${item.material}-${index}`}
        style={{
          flexDirection: 'row',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderBottomWidth: 0.5,
          borderColor: '#ccc',
          alignItems: 'center'
        }}
      >
        <Text style={{ flex: 1 }}>{item.material}</Text>

        <Pressable
          style={{ flex: 0.6 }}
          onPress={() => {
            setModalImageVisible(true);
            setActiveImageUriPreview(item.imageUrl || '');
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 40, height: 40, borderRadius: 4 }}
            resizeMode="cover"
          />
        </Pressable>

        <Text style={{ flex: 2 }}>{item.materialDescription}</Text>
        <Text style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</Text>

        <View style={{ flex: 1.1, alignItems: 'center' }}>
          <Button
            mode="contained"
            color={COLOR.secondary_primary_color}
            onPress={() => onRetriveSparepart(item, index)}
          >
            <Text style={{ color: COLOR.white }}>{item.countRetrive}</Text>
          </Button>
        </View>
      </View>
    );

    return (
      <View style={{ flex: 1, paddingBottom: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', padding: 12, backgroundColor: COLOR.primary }}>
          <Text style={{ flex: 1, fontWeight: 'bold', color: 'white' }}>รหัส</Text>
          <Text style={{ flex: 0.6 }} />
          <Text style={{ flex: 2, fontWeight: 'bold', color: 'white' }}>ชื่ออะไหล่</Text>
          <Text style={{ flex: 1, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>คงเหลือ</Text>
          <Text style={{ flex: 1.1, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>เบิกเพิ่ม</Text>
        </View>

        {/* List */}
        <FlatList
          data={componentStorageValue}
          renderItem={renderItem}
          keyExtractor={(item, index) => `spare-${index}`}
          initialNumToRender={10}
        />
      </View>
    );
  };

  const SparePartFooter = () => {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        marginBottom: 10,

      }}>

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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 5,
          paddingVertical: 12,
          backgroundColor: '#f9f9f9',
          borderRadius: 12,
          marginHorizontal: 12,
          marginTop: 12,
          marginBottom: 8,
          elevation: 1, // สำหรับ Android
          shadowColor: '#000', // สำหรับ iOS
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                placeholder="🔍 ค้นหาอะไหล่..."
                value={value}
                style={{
                  height: 44,
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  color: '#333',
                }}
                onChangeText={(text: string) => onChange(text)}
                onBlur={onBlur}
              />
            )}
            name="search"
          />
        </View>

        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => setScan(true)}
          style={{
            marginLeft: 12,
            padding: 6,
            borderRadius: 8,
          }}
        >
          <Icon name="qrcode" size={28} color={COLOR.gray} />
        </TouchableHighlight>
      </View>
    );
  };

  const onValueScanner = (e: BarCodeReadEvent) => {
    setScan(false);
    if (e.data && e.data.length >= 2) {
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
        source={require('../../../assets/images/bg.png')}>
        <AppBar
          title="ขอโอนอะไหล่เพิ่ม"
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


export default SparePartAddRequestTransferPage;
