import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, DataTable, Dialog, Portal} from 'react-native-paper';
import {COLOR} from '../../constants/Colors';
import {Fonts} from '../../constants/fonts';
import {ISparePartRemainingItem, IToolsRemainingItem} from '../../models';
import {ellipsis} from '../../utils/helper';

const ToolsBalanceList = ({
  toolsBalances,
}: {
  toolsBalances: IToolsRemainingItem[];
}) => {
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

  const generateDataTableRow = (item: ISparePartRemainingItem, idx: number) => {
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
          <Text style={{...styles.dataTable_cell}}>{item.quotaStock}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex1,{justifyContent: 'center'}]}>
          <Text style={{...styles.dataTable_cell}}>{item.onWithdraw}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={[styles.flex1,{justifyContent: 'center'}]}>
          <Text style={{...styles.dataTable_cell}}>{item.znew}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const SpareParts = () => {
    const listOrder: any = [];
    if (toolsBalances) {
      toolsBalances.map((item, index) => {
        listOrder.push(generateDataTableRow(item, index));
      });
    }
    const renderItem = ({item, index}: any) => {
      return item;
    };

    return (
      <View>
        <DataTable>
          <DataTable.Header style={{backgroundColor: COLOR.primary}}>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex05]}>
              <Text style={styles.dataTableTitle}></Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex4]}>
              <Text style={styles.dataTableTitle}>ชื่ออะไหล่</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex1,{justifyContent: 'center'}]}>
              <Text style={styles.dataTableTitle}>โควต้า</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex1,{justifyContent: 'center'}]}>
              <Text style={styles.dataTableTitle}>ค้างเบิก</Text>
            </DataTable.Title>
            <DataTable.Title style={[styles.flex1,{justifyContent: 'center'}]}>
              <Text style={styles.dataTableTitle}>คงเหลือ</Text>
            </DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={listOrder}
            initialNumToRender={5}
            renderItem={renderItem}
            keyExtractor={(item, index) => `spare-part-${index}`}
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
      {SpareParts()}
    </>
  );
};

const stylesSm = StyleSheet.create({
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 12,
    fontFamily: Fonts.Prompt_Medium,
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 12,
  },
  sparePartBodySection: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    fontFamily: Fonts.Prompt_Light,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  flex05:{
    flex:0.5
  },
  flex4:{
    flex:2
  },
  flex1:{
    flex:1
  }
});


const stylesLg = StyleSheet.create({
  flex05:{
    flex:0.5
  },
  flex4:{
    flex:4
  },
  flex1:{
    flex:1
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
  },
  dataTable_cell: {
    fontFamily: Fonts.Prompt_Light,
    fontSize: 14.5,
  },
  sparePartBodySection: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    fontFamily: Fonts.Prompt_Light,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ToolsBalanceList;
