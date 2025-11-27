import {Flex} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import {Button, DataTable, Dialog, Portal} from 'react-native-paper';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import Loading from '../../components/loading';
import TextInputComponent from '../../components/TextInput';
import {COLOR} from '../../constants/Colors';
import {Fonts} from '../../constants/fonts';
import {ISparePartTransferStoreList} from '../../models';
import {LoginResponseInterface} from '../../models/login';
import {postSparePartTransferStore} from '../../services/sparePart';
import {FullArrayTextSearch} from '../../utils/FullTextSearch';
import styles from './SparePartStoreTransferCss';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Grid } from 'react-native-easy-grid';
import { useNavigation, StackActions } from '@react-navigation/native'

type InterfaceProps = {
  vanTo: string;
  profile: LoginResponseInterface;
};

type Inputs = {
  searchSparePart: string;
};

const SparePartStoreTransferPage: React.FC<InterfaceProps> = (
  props: InterfaceProps,
) => {
  const {control, getValues, reset, watch} = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [filterSparePart, setFilterSparePart] = useState<
    {label: string; value: string}[]
  >([]);
  const [valueSparePartCode, setValueSparePartCode] = useState<any>(null);
  const [sparePartStore, setSparePartStore] = useState<
    ISparePartTransferStoreList[]
  >([]);
  const [sparePartStoreMaster, setSparePartStoreMaster] = useState<
    ISparePartTransferStoreList[]
  >([]);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');
  const navigation = useNavigation();

  watch(observe => {
    if (observe.searchSparePart && observe.searchSparePart.length > 3) {
      const filterFullText = FullArrayTextSearch(
        sparePartStoreMaster as ISparePartTransferStoreList[],
        observe.searchSparePart,
      );
      setSparePartStore(filterFullText);
    } else {
      setSparePartStore(sparePartStoreMaster);
    }
  });

  const onChangeFilter = (value: string) => {
    reset({searchSparePart: ''});
    setValueSparePartCode(value);
    updateFilterSparePart(value);
  };

  const onFilterSparePart = () => {
    const searchSparePart = getValues('searchSparePart');
    updateFilterSparePart(searchSparePart);
    setValueSparePartCode('');
  };

  const updateFilterSparePart = (value: string) => {
    if (value.length > 0) {
      const filterSpare = sparePartStoreMaster.filter(val =>
        val.sparepartCode.includes(value),
      );
      setSparePartStore(filterSpare);
    } else {
      setSparePartStore(sparePartStoreMaster);
    }
  };

  const getSparePartTransferStore = async () => {
    setIsLoading(true);
    try {
      const result = await postSparePartTransferStore('get', props.vanTo);
      console.log('result::', JSON.stringify(result, null, 2));
      if (
        result.dataResult?.sparepartList &&
        result.dataResult?.sparepartList.length > 0
      ) {
        // TODO: receive imageUrl from api
        const newSparePartList = result.dataResult?.sparepartList.map(val => {
          return {
            ...val,
          };
        });
        setSparePartStore(newSparePartList);
        setSparePartStoreMaster(newSparePartList);
        setFilterSparePart(
          result.dataResult?.sparepartList.map(val => {
            return {
              label: `${val.sparepartCode}: ${val.sparepartName}`,
              value: val.sparepartCode,
            };
          }),
        );
      } else {
        Alert.alert('แจ้งเตือน', result.message);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSparePartTransferStore();
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await postSparePartTransferStore('receive', props.vanTo);
      Alert.alert('แจ้งเตือน', response.message, [
        {
          text: 'ตกลง',
          onPress: async () => {
            // Actions.pop();
            navigation.dispatch(StackActions.pop());
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const Search = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{flex: 2}}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{height: 52}}
                onChangeText={(value: any) => onChange(value)}
              />
            )}
            name="searchSparePart"
            defaultValue=""
          />
        </View>
      </View>
    );
  };

  const generateDataTableRow = (
    item: ISparePartTransferStoreList,
    idx: number,
  ) => {
    return (
      <>
      {ScreenWidth > 500 ? 
           <DataTable.Row key={`${item.sparepartCode}-${idx}`}>
           <DataTable.Cell>
             <Text
               style={{
                 ...styles.dataTable_cell,
               }}>
               {item.sparepartCode}
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
           <DataTable.Cell style={{flex: 5}}>
             <Text
               style={{
                 ...styles.dataTable_cell,
               }}>
               {item.sparepartName}
             </Text>
           </DataTable.Cell>
           <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
             <Text style={styles.dataTable_cell}>{item.sparepartQuantity}</Text>
           </DataTable.Cell>
           <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
             <Text style={styles.dataTable_cell}> {item.sparepartUnit} </Text>
           </DataTable.Cell>
         </DataTable.Row>
         :
         <View key={`${item.sparepartCode}-${idx}`} style={{flexDirection:'row'}}>
         <View style={{flex:1}}>
           <Text
             style={{
               ...styles.dataTable_cell,
             }}>
             {item.sparepartCode}
           </Text>
         </View>
         <View style={{flex: 0.5}}>
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
         </View>
         <View style={{flex: 3}}>
           <Text
             style={{
               ...styles.dataTable_cell,
             }}>
             {item.sparepartName}
           </Text>
         </View>
         <View style={{flex: 0.7, justifyContent: 'center',alignItems:'flex-end'}}>
           <Text style={styles.dataTable_cell}>{item.sparepartQuantity}</Text>
         </View>
         <View style={{flex: 1, justifyContent: 'center'}}>
           <Text style={styles.dataTable_cell}> {item.sparepartUnit} </Text>
         </View>
       </View>
         }
        
      </>
    );
  };

  const SpareParts = () => {
    const listOrder: any = [];
    sparePartStore.map((item, index) => {
      listOrder.push(generateDataTableRow(item, index));
    });

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View style={styles.sparePartBodySection}>
        { ScreenWidth > 500 ?
        <DataTable>
        <DataTable.Header style={{backgroundColor: COLOR.primary}}>
          <DataTable.Title>
            <Text style={styles.dataTableTitle}>รหัส</Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 0.5}}>
            <Text style={styles.dataTableTitle}></Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 5}}>
            <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.dataTableTitle}>จำนวน</Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.dataTableTitle}>หน่วย</Text>
          </DataTable.Title>
        </DataTable.Header>
        <FlatList
          data={listOrder}
          initialNumToRender={5}
          renderItem={renderItem}
          keyExtractor={(item, index) => `spare-part-${index}`}
        />
      </DataTable>:
      <>
      <View>
          <View style={{backgroundColor: COLOR.primary,flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </View>
            <View style={{flex: 0.5}}>
              <Text style={styles.dataTableTitle}></Text>
            </View>
            <View style={{flex: 3}}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </View>
            <View style={{flex: 0.7, justifyContent: 'center', alignItems:'flex-end'}}>
              <Text style={styles.dataTableTitle}>จำนวน</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={styles.dataTableTitle}>หน่วย</Text>
            </View>
          </View>
          <FlatList
            data={listOrder}
            initialNumToRender={5}
            renderItem={renderItem}
            keyExtractor={(item, index) => `spare-part-${index}`}
          />
        </View>
      </>}
      </View>
    );
  };

  const SparePartFooter = () => {
    return (
      <View style={styles.sparePartButtonSection}>
        <Flex justify="center">
          <Button
            mode="contained"
            onPress={() => {
              Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
                {
                  text: 'ยกเลิก',
                  style: 'cancel',
                },
                {
                  text: 'ตกลง',
                  onPress: async () => {
                    await onSubmit();
                  },
                },
              ]);
            }}
            style={{
              marginTop: 4,
              height: 62,
              padding: 8,
              width: 152,
              borderRadius: 50,
              backgroundColor: COLOR.secondary_primary_color,
            }}>
            <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 20}}>
              รับโอน
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              // Actions.pop()
              navigation.dispatch(StackActions.pop());
            }}
            style={{
              marginTop: 4,
              height: 62,
              padding: 8,
              width: 152,
              marginLeft: 20,
              borderRadius: 50,
              backgroundColor: COLOR.secondary_primary_color,
            }}>
            <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 20}}>
              ไม่รับโอน
            </Text>
          </Button>
        </Flex>
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
              title="รับอะไหล่สโตร์"
              rightTitle={`Work Center: ${props.profile.wk_ctr}`}></AppBar>
            {Search()}
            {SpareParts()}
            {SparePartFooter()}
          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default SparePartStoreTransferPage;
