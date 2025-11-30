import { Flex } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Checkbox, DataTable } from 'react-native-paper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { StackActions, useNavigation } from '@react-navigation/native';
import Lightbox from 'react-native-lightbox';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ISparePartTOItem } from '../../../models';
import { fetchSparePartListTONumber } from '../../../services/sparePart';
import { ellipsis } from '../../../utils/helper';

const screenHeight = Dimensions.get('window').height;

type InterfaceProps = {
  search: any;
  profile: any;
};

const ToolVanCheckListPage: FC<InterfaceProps> = (props: InterfaceProps) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [componentsValue, setComponentsValue] = useState<ISparePartTOItem[]>(
    [],
  );

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const checkToolTranferRequests = await fetchSparePartListTONumber(
        props.search.selectReceiveTransferFrom,
        props.search.toNumbers,
        '',
        'tool',
      );

      const masterKey: string[] = [];

      const mapData = checkToolTranferRequests.dataResult?.sparepartList
        ? checkToolTranferRequests.dataResult?.sparepartList.map(val => {
            let notShow = true;
            if (masterKey.indexOf(val.toNumber) < 0) {
              masterKey.push(val.toNumber);
              notShow = false;
            } else {
              notShow = true;
            }
            return {
              checked: false,
              sparepartCode: val.sparepartCode,
              sparepartName: val.sparepartName,
              sparepartQuantity: val.sparepartQuantity,
              sparepartUnit: val.sparepartUnit,
              toNumber: val.toNumber,
              notShow: notShow,
            };
          })
        : [];
      setComponentsValue(mapData as ISparePartTOItem[]);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReceiveSparePart = async () => {
    try {
      const selectTONumbers = componentsValue
        .filter(val => val.checked)
        .map(val => val.toNumber);
      if (selectTONumbers.length === 0) {
        Alert.alert('แจ้งเตือน', 'กรุณาเลือก TO Number', [
          {
            text: 'ตกลง',
            onPress: async () => {},
          },
        ]);
        return;
      }
      Alert.alert('แจ้งเตือน', 'ต้องการบันทึกหรือไม่?', [
        {
          text: 'ยกเลิก',
          onPress: async () => {},
        },
        {
          text: 'ตกลง',
          onPress: async () => {
            setIsLoading(true);
            const checkToolTranferRequests = await fetchSparePartListTONumber(
              props.search.selectReceiveTransferFrom,
              selectTONumbers,
              'X',
            );
            setIsLoading(false);
            if (checkToolTranferRequests.isSuccess) {
              Alert.alert('แจ้งเตือน', checkToolTranferRequests.message, [
                {
                  text: 'ตกลง',
                  onPress: async () => {
                    navigation.dispatch(StackActions.pop());
                  },
                },
              ]);
            } else {
              Alert.alert('แจ้งเตือน', checkToolTranferRequests.message, [
                {
                  text: 'ตกลง',
                  onPress: async () => {},
                },
              ]);
            }
          },
        },
      ]);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ตกลง',
          onPress: async () => {
            navigation.dispatch(StackActions.pop());
          },
        },
      ]);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const generateDataTableRow = (item: ISparePartTOItem, index: number) => {
    return (
      <DataTable.Row key={`${item?.sparepartCode}-${index}`}>
        <DataTable.Cell>
          {!item.notShow && (
            <TouchableOpacity
              onPress={() => {
                componentsValue[index].checked =
                  !componentsValue[index].checked;
                const margeArr = [...componentsValue];
                setComponentsValue(margeArr as ISparePartTOItem[]);
              }}
              key={`${item.sparepartCode}-${index}`}>
              <Checkbox
                key={`checkbox-${index}`}
                status={item.checked ? 'checked' : 'unchecked'}
              />
            </TouchableOpacity>
          )}
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.dataTable_cell}>
            {!item.notShow && item?.toNumber}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.dataTable_cell}>
            {item?.sparepartCode.replace(/^0+/, '')}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            flex: 2,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}>
            <Lightbox activeProps={{height: screenHeight, width: 'auto'}}>
              <Image
                style={{...styles.tinyLogo}}
                source={{
                  uri: item?.sparepartName,
                }}
              />
            </Lightbox>
            <Text
              style={{
                ...styles.dataTable_cell,
                marginLeft: 5,
              }}>
              {ellipsis(item?.sparepartName, 20)}
            </Text>
          </View>
        </DataTable.Cell>
        <DataTable.Cell style={{justifyContent: 'center'}}>
          <Text style={styles.dataTable_cell}>{item?.sparepartQuantity}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{justifyContent: 'center'}}>
          <Text style={styles.dataTable_cell}>{item?.sparepartUnit}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const SparePartsDataTable = () => {
    const listOrder: any = [];

    componentsValue.forEach((item: ISparePartTOItem, index: number) => {
      listOrder.push(generateDataTableRow(item, index));
    });

    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View
        style={{
          paddingLeft: 5,
          paddingRight: 5,
          height: hp(80),
          marginTop: 20,
        }}>
        <DataTable>
          <DataTable.Header style={{backgroundColor: COLOR.primary}}>
            <DataTable.Title>
              {/* <Text style={styles.dataTableTitle}>รหัส</Text> */}
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>หมายเลข TO</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 2}}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>
              <Text style={styles.dataTableTitle}>จำนวน</Text>
            </DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>
              <Text style={styles.dataTableTitle}>หน่วย</Text>
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
            onPress={() => {
              saveReceiveSparePart();
            }}
            style={{
              marginTop: -75,
              height: 62,
              padding: 8,
              width: 152,
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
              Alert.alert('แจ้งเตือน', 'ต้องการออกจากหน้านี้หรือไม่?', [
                {
                  text: 'ยกเลิก',
                  onPress: async () => {},
                },
                {
                  text: 'ตกลง',
                  onPress: async () => {
                    navigation.dispatch(StackActions.pop());
                  },
                },
              ]);
            }}
            style={{
              marginTop: -75,
              height: 62,
              padding: 8,
              width: 152,
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

  return (
    <>
      <BackGroundImage
        components={
          <>
            <AppBar
              title="รับเครื่องมือจาก Mobile Van"
              rightTitle={`${props.profile.wk_ctr}`}></AppBar>
            {SparePartsDataTable()}
            {SparePartFooter()}
          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
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
  appBar: {
    backgroundColor: COLOR.primary,
  },
  appBarContent: {
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
  },
  textCard: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,
  },
  iconCard: {
    marginLeft: 35,
    marginTop: 10,
    color: 'white',
  },
  cardEmpty: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
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
  container: {flex: 1, padding: 16, paddingTop: 20, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#00acc8'},
  text: {
    textAlign: 'center',
    fontWeight: '100',
    fontFamily: Fonts.Prompt_Light,
  },
  textHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: Fonts.Prompt_Light,
    fontSize: 14,
    color: '#ffffff',
  },
  dataWrapper: {marginTop: -1},
  row: {
    height: 40,
    backgroundColor: '#ffffff',
    borderBottomColor: '#818181',
    borderBottomWidth: 1,
  },
});

export default ToolVanCheckListPage;
