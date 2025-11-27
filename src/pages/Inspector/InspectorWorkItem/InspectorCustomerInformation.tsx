import {Button, Icon, Modal} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {DataTable, List} from 'react-native-paper';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {ROUTE} from '../../../constants/RoutePath';
import {styleLg,styleSm} from './InspectorWorkItenPageCss';
import {getWorkOrder} from '../../../services/work_order_services';
import {CustomerMas} from '../../../models';
import moment from 'moment-timezone';
import { fetchtWorkOrderCustomer } from '../../../services/workOrderCustomer';
import { IWorkOrderCustomer } from '../../../models/WorkOrderCustomer';
import { useNavigation, StackActions } from '@react-navigation/native';

type InspectorCustomerInformationProps = {
    orderId: string
    setStateVisibleModal: Function
    visibleModal: boolean
}
// const styleLg = ()=>{
//   return StyleSheet.create({
    
//   })
// }

// const styleSm = ()=>{
//   return StyleSheet.create({
    
//   })
// }
const InspectorCustomerInformation: React.FC<InspectorCustomerInformationProps> = ({orderId, setStateVisibleModal, visibleModal}) => {
    const [customerMas, setCustomerMaster] = useState<IWorkOrderCustomer | null>(null);
    const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
    const [styles, setStyles] = useState<any>({});
    const navigation = useNavigation();

    useEffect(() => {
      console.log(screenInfo)
      if (screenInfo.width < 400) {
        setStyles(styleSm);
      } else {
        setStyles(styleLg);
      }
    
    },[]);

    useEffect(() => {
      getWorkOrderCustomer();
    }, []);
  
    const getWorkOrderCustomer = async () => {
      try {
        const result: any = await fetchtWorkOrderCustomer(orderId);
        setCustomerMaster(result);
      } catch (error) {
        setCustomerMaster(null);
      }
    };
  
    const _onClickModalCustomerInformation = () => {
      setStateVisibleModal(!visibleModal);
    };

    const _onClickMapCustomer = () => {
        setStateVisibleModal(false);
        // router.Actions.push(ROUTE.WORK_ORDER_MAP, {workOrderData: customerMas});
        navigation.dispatch(StackActions.push(ROUTE.WORK_ORDER_MAP, {workOrderData: customerMas}));
    };
  
    const DrawHorizontalWidget = () => {
      return (
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
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

    const BottomWidget = (
        title?: string,
        action?: any,
        colorBackground?: any,
      ) => {
        const styleBtn = [];
        if (colorBackground) {
          styleBtn.push(styles.btn);
          styleBtn.push({backgroundColor: colorBackground});
        } else {
          styleBtn.push(styles.btnCloseJob);
        }
        return (
          <View style={{alignItems: 'center'}}>
            <Button style={styleBtn} onPress={action}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  fontFamily: Fonts.Prompt_Medium,
                }}>
                {title}
              </Text>
            </Button>
          </View>
        );
    };
  
    const DataTableTitleWidget = (title: string) => {
      return (
        <DataTable.Title style={{flex: 2}}>
          <Text style={styles.dataTableTitle}>{title}</Text>
        </DataTable.Title>
      );
    };
  
    const TimeWindowsTable = (data: IWorkOrderCustomer) => (
      <DataTable>
        <DataTable.Header style={{backgroundColor: COLOR.primary}}>
          {DataTableTitleWidget('วัน')}
          {DataTableTitleWidget('ช่วงเวลา1')}
          {DataTableTitleWidget('ช่วงเวลา2')}
        </DataTable.Header>
  
        <DataTable.Row style={{backgroundColor: moment().day() == 1 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>จันทร์</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.monMorFrom.substr(0, 2)}:
                    {data.monMorFrom.substr(2, 2)}-
                    {data.monMorTo.substr(0, 2)}:{data.monMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.monEventFrom.substr(0, 2)}:
                    {data.monEventFrom.substr(2, 2)}-
                    {data.monEventTo.substr(0, 2)}:
                    {data.monEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
  
              <DataTable.Row style={{backgroundColor: moment().day() == 2 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>อังคาร</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.tueMorFrom.substr(0, 2)}:
                    {data.tueMorFrom.substr(2, 2)}-
                    {data.tueMorTo.substr(0, 2)}:{data.tueMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.tueEventFrom.substr(0, 2)}:
                    {data.tueEventFrom.substr(2, 2)}-
                    {data.tueEventTo.substr(0, 2)}:
                    {data.tueEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
  
              <DataTable.Row style={{backgroundColor: moment().day() == 3 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>พุธ</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.wedMorFrom.substr(0, 2)}:
                    {data.wedMorFrom.substr(2, 2)}-
                    {data.wedMorTo.substr(0, 2)}:{data.wedMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.wedEventFrom.substr(0, 2)}:
                    {data.wedEventFrom.substr(2, 2)}-
                    {data.wedEventTo.substr(0, 2)}:
                    {data.wedEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
  
              <DataTable.Row style={{backgroundColor: moment().day() == 4 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>พฤหัสบดี</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.thuMorFrom.substr(0, 2)}:
                    {data.thuMorFrom.substr(2, 2)}-
                    {data.thuMorTo.substr(0, 2)}:{data.thuMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.thuEventFrom.substr(0, 2)}:
                    {data.thuEventFrom.substr(2, 2)}-
                    {data.thuEventTo.substr(0, 2)}:
                    {data.thuEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
  
              <DataTable.Row style={{backgroundColor: moment().day() == 5 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>ศุกร์</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.friMorFrom.substr(0, 2)}:
                    {data.friMorFrom.substr(2, 2)}-
                    {data.friMorTo.substr(0, 2)}:{data.friMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.friEventFrom.substr(0, 2)}:
                    {data.friEventFrom.substr(2, 2)}-
                    {data.friEventTo.substr(0, 2)}:
                    {data.friEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
  
              <DataTable.Row style={{backgroundColor: moment().day() == 6 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>เสาร์</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.satMorFrom.substr(0, 2)}:
                    {data.satMorFrom.substr(2, 2)}-
                    {data.satMorTo.substr(0, 2)}:{data.satMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.satEventFrom.substr(0, 2)}:
                    {data.satEventFrom.substr(2, 2)}-
                    {data.satEventTo.substr(0, 2)}:
                    {data.satEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
  
              <DataTable.Row style={{backgroundColor: moment().day() == 0 ? "#FAE5D3": ''}}>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>อาทิตย์</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.sunMorFrom.substr(0, 2)}:
                    {data.sunMorFrom.substr(2, 2)}-
                    {data.sunMorTo.substr(0, 2)}:{data.sunMorTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dataTableCell}>
                    {data.sunEventFrom.substr(0, 2)}:
                    {data.sunEventFrom.substr(2, 2)}-
                    {data.sunEventTo.substr(0, 2)}:
                    {data.sunEventTo.substr(2, 2)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
      </DataTable>
    );
  
    const ModalCustomerInformation = () => {
      return (
        <Modal
          transparent
          maskClosable
          style={{width: screenInfo.width <= 500 ? 400 : 650}}
          visible={visibleModal}>
          <View>
            <View>
              <Text style={styles.titleCheck}>ข้อมูลลูกค้า</Text>
              {DrawHorizontalWidget()}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: 30,
              }}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 100,
                  width: 80,
                  height: 110,
                  backgroundColor: COLOR.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="shop" size={50} color={COLOR.white} />
              </View>
              <View
                style={{
                  flex: 4,
                  paddingLeft: 20,
                }}>
                <Text style={styles.titleDetails}>{customerMas?.customerName}</Text>
                <Text style={styles.titleDetails}>
                    รหัสลูกค้า: {customerMas?.customer}
                </Text>
                <Text style={styles.textDetails}>
                    {customerMas?.address}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={styles.titleDetails}>
                      โทรศัพท์: {customerMas?.phone}
                    </Text>
                  </View>
                  <View>
                    <Icon
                      color={COLOR.primary}
                      style={{position: 'absolute', paddingLeft: 20}}
                      onPress={() => {
                        Linking.openURL(`tel:${customerMas?.phone}`);
                      }}
                      name="phone"
                      size={24}
                    />
                  </View>
                </View>
                <Text style={styles.titleDetails}>
                    ประเภทการชำระเงิน: {customerMas?.paymentType}
                </Text>
                <View style={{paddingTop: 20}}>
                    {customerMas && TimeWindowsTable(customerMas)}
                </View>
              </View>
            </View>
          </View>
          {DrawHorizontalWidget()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
            }}>
            <View style={{flex: 2}}>
              {BottomWidget(
                'ยกเลิก',
                () => _onClickModalCustomerInformation(),
                '#818181',
              )}
            </View>
            <View style={{flex: 2}}>
              {BottomWidget('แผนที่ลูกค้า', () => _onClickMapCustomer(), COLOR.secondary_primary_color)}
            </View>
          </View>
        </Modal>
      );
    };
  
    return (
      <>
        {ModalCustomerInformation()}
      </>
    );
  };

export default InspectorCustomerInformation;