import {Flex} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, DataTable, Dialog, Portal} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DropdownSelect, {ItemProps} from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {ISparePartRequestTOItem} from '../../../models';
import {
  fetchProcessTransferPostShip,
  fetchTransferRequestTo,
  postSparePartRequest,
} from '../../../services/sparePart';

const screenHeight = Dimensions.get('window').height;

const ToolTransferPage: React.FC<Props> = props => {
  const { profile } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [selectTransferTo, setSelectTransferTo] = useState<string>('');
  const [selectTransferRequestTo, setSelectTransferRequestTo] =
    useState<string>('');
  const [transferToList, setTransferToList] = useState<ItemProps[]>([]);
  const [transferRequestToList, setTransferRequestToList] = useState<
    ItemProps[]
  >([]);
  const [componentsValue, setComponentsValue] = useState<
    ISparePartRequestTOItem[]
  >([]);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }
  
  },[screenInfo]);
  const loadAll = async () => {
    try {
      setIsLoading(true);
      const toolTransferRequests = await fetchTransferRequestTo('tool');
      const mapToolTransferRequest = toolTransferRequests.dataResult
        ? toolTransferRequests.dataResult.map(val => {
            return {
              label: val,
              value: val,
            };
          })
        : [];
      setTransferToList(mapToolTransferRequest);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadToolTransferRequestTo = async (stge_loc: string) => {
    try {
      setIsLoading(true);
      const toolTransferRequestTos = await postSparePartRequest(
        stge_loc,
        'tool',
      );
      const mapToolTransferRequestTo = toolTransferRequestTos.dataResult
        ? toolTransferRequestTos.dataResult.map(val => {
            return {
              label: val,
              value: val,
            };
          })
        : [];
      setTransferRequestToList(mapToolTransferRequestTo);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickCheckTO = async () => {
    try {
      setIsLoading(true);
      const checkSparePartTranferRequests = await fetchProcessTransferPostShip(
        selectTransferTo,
        selectTransferRequestTo,
        '',
        'tool',
      );
      const result = checkSparePartTranferRequests.dataResult
        ? (checkSparePartTranferRequests.dataResult
            .items as ISparePartRequestTOItem[])
        : [];
      setComponentsValue(result);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickSave = async () => {
    try {
      setIsLoading(true);
      const postSparePartTranferRequests = await fetchProcessTransferPostShip(
        selectTransferTo,
        selectTransferRequestTo,
        'X',
        'tool',
      );
      Alert.alert('แจ้งเตือน', postSparePartTranferRequests.message, [
        {
          text: 'ตกลง',
          onPress: async () => {
            setSelectTransferTo('');
            setSelectTransferRequestTo('');
            setTransferToList([]);
            setTransferRequestToList([]);
            setComponentsValue([]);
            loadAll();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const Search = () => (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{flex: 2, paddingRight: 10}}>
        <DropdownSelect
          selects={selectTransferTo}
          dataItem={transferToList}
          onValueChange={value => {
            setSelectTransferTo(value as string);
          }}
          placeholder={'เลือกโอนให้'}
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
      <View style={{flex: 1}}>
        <Button
          mode="contained"
          onPress={() => {
            if (!selectTransferTo || selectTransferTo.length === 0) {
              Alert.alert('แจ้งเตือน', 'กรุณาระบุโอนให้');
              return;
            }
            loadToolTransferRequestTo(selectTransferTo);
          }}
          style={[styles.btn]}>
          <Text style={[styles.btnText]}>
            ค้นหา
          </Text>
        </Button>
      </View>
    </View>
  );

  const SearchTONumber = () => (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        paddingTop: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{flex: 2, paddingRight: 10}}>
        <DropdownSelect
          selects={selectTransferRequestTo}
          dataItem={transferRequestToList}
          onValueChange={value => {
            setSelectTransferRequestTo(value as string);
          }}
          placeholder={'-- เลือก TO --'}
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
      <View style={{flex: 1}}>
        <Button
          mode="contained"
          onPress={() => {
            if (
              !selectTransferRequestTo ||
              selectTransferRequestTo.length === 0
            ) {
              Alert.alert('แจ้งเตือน', 'กรุณาระบุ TO Number');
              return;
            }
            onClickCheckTO();
          }}
          style={[styles.btn]}>
          <Text style={[styles.btnText]}>
            ตรวจสอบ
          </Text>
        </Button>
      </View>
    </View>
  );

  const generateDataTableRow = (
    item: ISparePartRequestTOItem,
    index: number,
  ) => {
    return (
      <DataTable.Row key={`${item?.matnr}-${index}`}>
        <DataTable.Cell style={{flex: 1.5}}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item?.matnr}
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
        <DataTable.Cell
          style={{
            flex: 7,
          }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.matL_DESC}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.dataTable_cell}>{item?.lqnum}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const ToolDataTable = () => {
    const listOrder: any = [];
    componentsValue.length > 0 &&
      componentsValue.forEach(
        (item: ISparePartRequestTOItem, index: number) => {
          listOrder.push(generateDataTableRow(item, index));
        },
      );

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View style={{paddingLeft: 5, paddingRight: 5, height: hp(80)}}>
        <DataTable>
          <DataTable.Header style={{backgroundColor: COLOR.primary}}>
            <DataTable.Title style={[styles.flex15]}>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05]}>
              <Text style={styles.dataTableTitle}></Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex7]}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex15,{justifyContent: 'center'}]}>
              <Text style={styles.dataTableTitle}>จำนวน</Text>
            </DataTable.Title>
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

  const ToolFooter = () => {
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
            onPress={() => {
              Alert.alert('แจ้งเตือน', 'ต้องการบันทึกหรือไม่?', [
                {
                  text: 'ยกเลิก',
                  onPress: async () => {},
                },
                {
                  text: 'ตกลง',
                  onPress: async () => {
                    onClickSave();
                  },
                },
              ]);
            }}
            style={{
              marginTop: -100,
              height: 62,
              padding: 8,
              width: 125,
              borderRadius: 50,
              backgroundColor: COLOR.secondary_primary_color,
              marginRight: 5,
            }}>
            <Text style={{fontFamily: Fonts.Prompt_Light, fontSize: 20}}>
              บันทึก
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setSelectTransferTo('');
              setSelectTransferRequestTo('');
              setTransferToList([]);
              setTransferRequestToList([]);
              setComponentsValue([]);
            }}
            style={{
              marginTop: -100,
              height: 62,
              padding: 8,
              width: 125,
              borderRadius: 50,
              backgroundColor: '#ffffff',
              borderColor: COLOR.secondary_primary_color,
              borderWidth: 3,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Light,
                fontSize: 20,
                color: 'black',
              }}>
              ยกเลิก
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
              title="โอนเครื่องมือ"
              rightTitle={`${profile.wk_ctr}`}></AppBar>
            {Search()}
            {SearchTONumber()}
            {ToolDataTable()}
            {ToolFooter()}
          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};
const stylesLg = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
  },
  containerStyle: {
    borderRadius: 30,
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    height: 56,
    marginHorizontal: 20,
    paddingLeft: 40,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
  },
  containerTextStyle: {
    paddingTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    paddingTop: 20,
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 16,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  flex15:{
    flex:1.5
  },flex05:{
    flex:0.5
  },flex7:{
    flex:7
  },flex1:{
    flex:1
  },
  btnText:{fontFamily: Fonts.Prompt_Light, fontSize: 20},
  btn:{
    borderRadius: 50,
    height: 52,
    backgroundColor: COLOR.secondary_primary_color,
  }
});
const stylesSm = StyleSheet.create({
  btn:{
    paddingTop:7,
    borderRadius: 50,
    height: 52,
    backgroundColor: COLOR.secondary_primary_color,
  },
  btnText:{fontFamily: Fonts.Prompt_Light, fontSize: 14},
  flex15:{
    flex:1.5
  },flex05:{
    flex:0.5
  },flex7:{
    flex:7
  },flex1:{
    flex:1
  },
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
  },
  containerStyle: {
    borderRadius: 30,
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    height: 56,
    marginHorizontal: 20,
    paddingLeft: 40,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
  },
  containerTextStyle: {
    paddingTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    paddingTop: 20,
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 12,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ToolTransferPage;
