import { Flex, Icon } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, DataTable, Dialog, Portal } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import DropdownSelect from '../../components/DropdownSelect';
import Loading from '../../components/loading';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { ROUTE } from '../../constants/RoutePath';
import { ISparePartRequest, ISparePartRequestHD, ISparePartRequestItem } from '../../models/WorkOrderSparePart';
import {
  fetchSparePartRequestApprove,
  fetchSparePartRequestCancel,
  fetchSparePartRequestHd,
  fetchSparePartRequestItem,
  fetchSparePartTransferRequest,
  postSparePartReservationRequest,
} from '../../services/sparePart';
import { styleSm, styleLg } from './SparePartRequestTransferApproveCss';
import Moment from 'moment';
import { fonts } from 'react-native-elements/dist/config';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

type InterfaceProps = {
  route: any;
  componentStorageSelected?: [];
};

const screenHeight = Dimensions.get('window').height;

const SparePartRequestTransferApprovePage: FC<InterfaceProps> = (
  props: InterfaceProps,
) => {
  const { profile } = props.route.params;
  const [visibleDialog, setVisible] = useState(false);
  const [SparePartRequestHD, setSparePartRequestHD] = useState<ISparePartRequestHD[]>([],);
  const [SparePartRequestHDDetail, setSparePartRequestHDDetail] = useState<ISparePartRequestHD>();
  const [SparePartRequestItem, setSparePartRequestItem] = useState<ISparePartRequestItem[]>([],);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);
  const [activeImageUriPreview, setActiveImageUriPreview] = useState('');


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

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSparePartRequestHd();
      if (result.dataResult) {
        setSparePartRequestHD(result.dataResult)
        // console.log(SparePartRequestHD);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const SparePartDetailDialog = async (item: ISparePartRequestHD) => {
    setIsLoading(true)
    setSparePartRequestHDDetail(item);
    const result = await fetchSparePartRequestItem(item.reS_ID);
    if (result.dataResult) {
      setSparePartRequestItem(result.dataResult)
      // console.log(SparePartRequestHD);
    }
    setVisible(true);
    setIsLoading(false)
  }

  const RenderSparePartDetailDialog = () => {
    return (
      <Portal >
        <Dialog style={[styles.SparepartDialog]}
          visible={visibleDialog}
          onDismiss={() => setVisible(false)}>
          <Dialog.Content style={{ padding: 0 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.modalTitle}>รายระเอียดคำขอโอน</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Text style={[styles.dataTable_cell, { flex: 1 }]} >เลขที่ขอ : {SparePartRequestHDDetail?.reS_ID}</Text>
              <Text style={[styles.dataTable_cell, { flex: screenInfo.width < 500 ? 1 : 2 }]}>วันที่ขอ : {Moment(SparePartRequestHDDetail?.reS_DATE).format('d/M/y')}</Text>
              <Text style={[styles.dataTable_cell, { flex: 1 }]}>VAN : {SparePartRequestHDDetail?.wK_CTR}</Text>
              <Text style={[styles.dataTable_cell, { flex: 1 }]}>SLOG : {SparePartRequestHDDetail?.movE_STLOC}</Text>
              <Text style={[styles.dataTable_cell, { flex: 1 }]}>FROM : {SparePartRequestHDDetail?.froM_VAN}</Text>
            </View>
            <View style={{ width: '100%', alignSelf: 'stretch', maxHeight: 500, height: 500 }}>
              {renderDialogTable()}
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
                onPress={() => onApprove()}
                style={[styles.btnModal, { backgroundColor: COLOR.primary }]}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 20,
                    color: COLOR.white,
                  }}>
                  อนุมัติ
                </Text>
              </Button>
              <Button
                onPress={() => onCancel()}
                style={[styles.btnModal, { backgroundColor: COLOR.neonRed }]}>
                <Text
                  style={{
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: 20,
                    color: COLOR.white,
                  }}>
                  ไม่อนุมัติ
                </Text>
              </Button>
              <Button
                onPress={() => setVisible(false)}
                style={[styles.btnModal, { backgroundColor: COLOR.gray }]}>
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
  };

  const onCancel = async () => {
    setIsLoading(true)
    setVisible(false)
    var resId = SparePartRequestHDDetail?.reS_ID;
    if (!resId) {
      resId = 0;
    }
    var result = await fetchSparePartRequestCancel(resId.toString());
    setIsLoading(false)
    if (result.isSuccess == true) {
      setVisible(false)
      loadAllData()
      Alert.alert("เตือน", "ยกเลิกสำเร็จ")
    } else {
      Alert.alert("ผิดพลาด", result.message);
    }
  }

  const onApprove = async () => {
    setIsLoading(true)
    setVisible(false)
    try {
      var resId = SparePartRequestHDDetail?.reS_ID
      if (!resId) {
        resId = 0;
      }
      var result = await fetchSparePartRequestApprove(resId.toString());

      if (result.isSuccess == true) {
        loadAllData()
        Alert.alert("เตือน", 'อนุมัติสำเร็จ')
      } else {
        Alert.alert("ผิดพลาด", result.message);
      }
    } catch (error: any) {
      Alert.alert('ผิดพลาด', error.message);
    } finally {
      setIsLoading(false)
    }

  }


  const renderDialogTable = () => {
    const talbeRow: any = [];
    SparePartRequestItem.forEach((item: ISparePartRequestItem, index: number) => {
      talbeRow.push(generateSparePartDetailTableRow(item));
      // console.log('item', item);
    });

    const renderItem = ({ item, index }: any) => {
      return item;
    };
    return (
      <View style={{ paddingLeft: 5, paddingRight: 5, height: hp(80), marginTop: 20 }}>
        <DataTable style={{ width: '110%', marginLeft: -18 }}>
          <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
            <DataTable.Title style={[styles.flex1]}>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05]}>
              &nbsp;
            </DataTable.Title>
            <DataTable.Title style={[styles.flex3]}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05, { justifyContent: 'center' }]}>
              <Text style={styles.dataTableTitle}>คงเหลือ</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05, { justifyContent: 'center' }]}>
              <Text style={styles.dataTableTitle}>จำนวน</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05, { justifyContent: 'center' }]}>
              <Text style={styles.dataTableTitle}>หน่วย</Text>
            </DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={talbeRow}
            initialNumToRender={5}
            renderItem={renderItem}
            keyExtractor={(item, index) => `spare-part-list-${index}`}
          />
        </DataTable>
      </View>

    );

  };

  const generateSparePartDetailTableRow = (item: ISparePartRequestItem) => {
    return (
      <DataTable.Row key={item.material}>
        <DataTable.Cell style={[styles.flex1]}>
          <Text style={{ ...styles.dataTable_cell }}>{item.material}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex05]}>
          <Pressable
            onPress={() => {
              setModalImageVisible(true);
              setActiveImageUriPreview(item.img || '');
            }}>
            <Image
              style={{ ...styles.tinyLogo }}
              source={{
                uri: item.img,
              }}
            />
          </Pressable>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex3]}>
          <Text style={{ ...styles.dataTable_cell }}>{item.des}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex05]}>
          <Text style={{ ...styles.dataTable_cell }}>{item.balance ? item.balance.znew : 0}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex05]}>
          <Text style={{ ...styles.dataTable_cell }}>{item.qty}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex05]}>
          <Text style={{ ...styles.dataTable_cell }}>{item.unit}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    )
  }

  const generateDataTableRow = (item: ISparePartRequestHD, index: number) => {
    return (
      <DataTable.Row key={`${item?.orderid}-${index}`}>
        <DataTable.Cell style={{
          flex: 1,
        }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>

            {item.reS_ID}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            flex: 2,
          }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {Moment(item.reS_DATE).format("d/M/Y")}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            flex: 1, justifyContent: 'center'
          }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.movE_STLOC}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            flex: 1, justifyContent: 'center'
          }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.froM_VAN}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell
          style={{
            flex: 2, justifyContent: 'center'
          }}>
          <Text
            style={{
              ...styles.dataTable_cell,
            }}>
            {item.wK_CTR}
          </Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ flex: 2, justifyContent: 'center' }}>
          <TouchableOpacity
            style={{ justifyContent: 'center' }}
            activeOpacity={0.9}
            onPress={() => SparePartDetailDialog(item)}>
            <View
              style={[styles.btnAppr]}>
              <View>
                <Text
                  style={[styles.btnApprText]}>
                  รายละเอียด
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </DataTable.Cell>
      </DataTable.Row>
    );
  };
  const renderTable = () => {
    const talbeRow: any = [];
    SparePartRequestHD.forEach((item: ISparePartRequestHD, index: number) => {
      talbeRow.push(generateDataTableRow(item, index));
      // console.log('item', item);
    });

    const renderItem = ({ item, index }: any) => {
      return item;
    };
    return (
      <View style={{ width: '90%', paddingLeft: 5, paddingRight: 5, height: hp(80), marginTop: 20 }}>
        <DataTable>
          <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
            <DataTable.Title style={{ flex: 1 }}>
              <Text style={styles.dataTableTitle}>เลขที่</Text>
            </DataTable.Title>
            <DataTable.Title style={{ flex: 2 }}>
              <Text style={styles.dataTableTitle}>วันที่คำขอ</Text>
            </DataTable.Title>
            <DataTable.Title style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.dataTableTitle}>SLOC</Text>
            </DataTable.Title>
            <DataTable.Title style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.dataTableTitle}>FROM</Text>
            </DataTable.Title>
            <DataTable.Title style={{ flex: 2, justifyContent: 'center' }}>
              <Text style={styles.dataTableTitle}>VAN</Text>
            </DataTable.Title>
            <DataTable.Title style={{ flex: 2, justifyContent: 'center' }}>
              <Text style={styles.dataTableTitle}>#</Text>
            </DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={talbeRow}
            initialNumToRender={10}
            renderItem={renderItem}
            keyExtractor={(item, index) => `spare-part-list-${index}`}
          />
        </DataTable>
      </View>

    );

  };

  const _buildModalSparePart = () => (
    <Portal >
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

      {RenderSparePartDetailDialog()}
      {_buildModalSparePart()}
      <BackGroundImage
        components={
          <>
            <AppBar
              title="อนุมัติขอโอนอะไหล่"
              rightTitle={`${profile?.wk_ctr}`}
              replacePath={ROUTE.WORKLIST}></AppBar>
            {renderTable()}

          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default SparePartRequestTransferApprovePage;
