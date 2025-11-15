import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DropdownSelect from '../../../components/DropdownSelect';
import styleSheet from '../../../components/StyleSheet';
import TextInputComponent from '../../../components/TextInput';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';

const ToolRemainPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openOrderCode, setOpenOrderCode] = useState(false);
  const [valueOrderCode, setValueOrderCode] = useState<any>(null);
  const [itemsOrderCode, setItemsOrderCode] = useState<any[]>([
    {label: 'BMC12345', value: 'value1'},
    {label: 'BMC12344', value: 'value2'},
    {label: 'BMC123e3', value: 'value3'},
    {label: 'ZC021333', value: 'value4'},
  ]);

  const ToolRemain = () => {
    return (
      <View>
        <DataTable>
          <DataTable.Header style={{backgroundColor: COLOR.primary}}>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>รหัส</Text>
            </DataTable.Title>
            <DataTable.Title style={{flex: 3}}>
              <Text style={styles.dataTableTitle}>ชื่อเครื่องมือ</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>โควต้า</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>ชำรุด</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitle}>พร้อมใช้</Text>
            </DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 200000001 </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 3}}>
              <Text style={styleSheet.dataTable_cell}>
                Adjustadle Spanner (Big) - 25.5mm
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 1 </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 200000001 </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 3}}>
              <Text style={styleSheet.dataTable_cell}>
                Adjustadle Spanner (Big) - 25.5mm
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 1 </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 200000001 </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 3}}>
              <Text style={styleSheet.dataTable_cell}>
                Adjustadle Spanner (Big) - 25.5mm
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 1 </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 200000001 </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 3}}>
              <Text style={styleSheet.dataTable_cell}>
                Adjustadle Spanner (Big) - 25.5mm
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 1 </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 200000001 </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 3}}>
              <Text style={styleSheet.dataTable_cell}>
                Adjustadle Spanner (Big) - 25.5mm
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 1 </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 200000001 </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 3}}>
              <Text style={styleSheet.dataTable_cell}>
                Adjustadle Spanner (Big) - 25.5mm
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 0 </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styleSheet.dataTable_cell}> 1 </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={page => {
              console.log(page);
            }}
            label="1-2 of 6"
          />
        </DataTable>
      </View>
    );
  };

  const onChangeSearch = (query: any) => setSearchQuery(query);

  const Search = () => {
    return (
      <View style={{flexDirection: 'row', padding: 10}}>
        <View style={{flex: 1}}>
          <DropdownSelect
            selects={valueOrderCode}
            dataItem={itemsOrderCode}
            placeholder={'รหัส'}
            textStyle={{
              color: COLOR.white,
              fontSize: 18,
              marginTop: -4,
            }}
            containerStyle={{
              backgroundColor: 'rgba(0, 172, 200, 0.6)',
              width: '100%',
              height: 52,
              borderRadius: 25,
              paddingTop: 8,
              marginTop: 10,
              alignItems: 'flex-start',
              paddingLeft: 40,
            }}
            iconStyle={{paddingTop: 18, paddingLeft: 120}}
            isIcon={true}
            iconSize={20}
            contentContainerStyle={{borderRadius: 10}}
            onValueChange={val => {}}
          />
        </View>
        <View style={{flex: 2}}>
          <TextInputComponent
            placeholder="ค้นหา"
            style={{height: 52, width: 492}}
          />
        </View>
      </View>
    );
  };

  return (
    <BackGroundImage
      components={
        <Animated.ScrollView>
          <ScrollView>
            <View style={{width: '100%'}}>
              <AppBar
                title="เครื่องมือช่าง"
                rightTitle={`CODE: BCLV006`}></AppBar>
            </View>
            {Search()}
            <View style={{padding: 20}}>{ToolRemain()}</View>
          </ScrollView>
        </Animated.ScrollView>
      }
    />
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: COLOR.primary,
  },
  dataTableTitle: {
    color: COLOR.white,
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
  },
  input: {
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    width: 282,
    height: 52,
    marginTop: 8,
    marginLeft: -2,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 25,
    fontSize: 20,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
  },
  input_select: {
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    marginTop: 8,
    borderRadius: 25,
    alignItems: 'center',
    fontSize: 20,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
  },
});

export default ToolRemainPage;
