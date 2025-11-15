import React, { FC, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { DataTable } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DataNotFound from '../../../components/DataNotFound';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import {
  IWorkOrderHistory,
  IWorkOrderSparepartHistory,
} from '../../../models/WorkOrderHistory';
import { fetchtWorkOrderHistory } from '../../../services/workOrderHistory';
import styles from './WorkOrderHistoryCss';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Grid } from 'react-native-easy-grid';
import moment from 'moment';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
  };
};

const WorkOrderHistoryPage: FC<InterfaceProps> = (props: InterfaceProps) => {
  const { orderId } = props?.workOrderData;
  const [activeSections, setActiveSections] = useState([0]);
  const [historyData, setHistoryData] = useState<IWorkOrderHistory[]>();
  const [isLoading, setIsLoading] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchtWorkOrderHistory(orderId);
      setHistoryData(result);
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const _renderHeader = (section: IWorkOrderHistory) => {
    return (
      <View style={styles.header}>
        <Text
          style={[
            styles.collapsibleTitle,
            { fontSize: ScreenWidth < 500 ? 14 : 18 }]
          }>{`Work Order : ${section.orderId.replace(/^0+/, '')}`}</Text>
      </View>
    );
  };

  const _updateSections = (activeSections: any) => {
    setActiveSections(activeSections);
  };

  const DrawHorizontalWidget = () => {
    return (
      <View
        style={{
          paddingLeft: ScreenWidth > 500 ? 40 : 5,
          paddingRight: ScreenWidth > 500 ? 40 : 5,
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

  const DataTables = (historySparePart: IWorkOrderSparepartHistory[]) => {
    return (
      <View
        style={{
          padding: ScreenWidth > 500 ? 40 : 5,
        }}>
        <View>
          <Text style={styles.titleProblems}>อะไหล่</Text>
          <DataTable style={{ paddingTop: 20 }}>
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              <DataTable.Title>
                <Text style={styles.dataTableTitle}>รหัสอะไหล่</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}>
                <Text style={styles.dataTableTitle}>รายการ</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.dataTableTitle}>จำนวน</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={styles.dataTableTitle}>หน่วย</Text>
              </DataTable.Title>
            </DataTable.Header>

            {historySparePart?.length > 0 ? (
              historySparePart.map((val, idx: number) => {
                return (
                  <>
                    {ScreenWidth > 500 ?
                      <DataTable.Row key={`${val.material}-${idx}`}>
                        <DataTable.Cell>
                          <Text style={styles.dataTableCell}>
                            {val?.material.replace(/^0+/, '')}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}>
                          <Text style={styles.dataTableCell}>
                            {val?.materialDescription}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <Text style={styles.dataTableCell}>{val?.quantity}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <Text style={styles.dataTableCell}>{val?.unit}</Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                      :
                        <Grid key={`${val.material}-${idx}`}>
                          <Grid>
                            <Text style={styles.dataTableCell}>
                              {val?.material.replace(/^0+/, '')}
                            </Text>
                          </Grid>
                          <Grid style={{ flex: 2 }}>
                            <Text style={styles.dataTableCell}>
                              {val?.materialDescription}
                            </Text>
                          </Grid>
                          <Grid>
                            <Text style={styles.dataTableCell}>{val?.quantity}</Text>
                          </Grid>
                          <Grid>
                            <Text style={styles.dataTableCell}>{val?.unit}</Text>
                          </Grid>
                        </Grid>
                    }
                  </>
                );
              })
            ) : (
              <DataTable.Cell
                style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
                <Text style={styles.dataTableCell}>Data Not Found</Text>
              </DataTable.Cell>
            )}
          </DataTable>
        </View>
      </View>
    );
  };

  const ViewDetailWidget = (title: any, details: any) => {
    return (
      <View
        style={{
          flex: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems: 'flex-end',
            flex: ScreenWidth > 500 ? 3 : 4,
          }}>
          <Text style={styles.textTitle}>{title} :</Text>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 6,
            paddingLeft: ScreenWidth > 500 ? 20 : 5,
          }}>
          <Text style={styles.textContent}>{details}</Text>
        </View>
      </View>
    );
  };

  const Details = (section: IWorkOrderHistory) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          padding: ScreenWidth > 500 ? 40 : 5,
        }}>
        {ViewDetailWidget('Work order', section?.orderId.replace(/^0+/, ''))}
        {ViewDetailWidget(
          'ประเภทงาน',
          section?.notiDate ? section.order_type : '-',
        )}
        {ViewDetailWidget(
          'วัน/เวลาที่แจ้ง',
          section?.notiDate ? section.notiDate : '-',
        )}
        {ViewDetailWidget(
          'เรื่อง',
          `${section?.notiShortText ? section.notiShortText : '-'}`,
        )}
        {ViewDetailWidget(
          'หมายเลขอุปกรณ์',
          section?.equipment.replace(/^0+/, ''),
        )}
        {ViewDetailWidget(
          'อาการเสีย',
          section?.notiProblem ? section.notiProblem : '-',
        )}
        {ViewDetailWidget(
          'สาเหตุที่เสีย',
          section?.notiCause ? section.notiCause : '-',
        )}
        {ViewDetailWidget(
          'วิธีการแก้ไข',
          section?.notiAct ? section.notiAct : '-',
        )}
      </View>
    );
  };

  const _renderContent = (section: IWorkOrderHistory) => {
    return (
      <View>
        {Details(section)}
        {DrawHorizontalWidget()}
        {DataTables(section?.historySparePart)}
      </View>
    );
  };

  const Contents = () => {
    return (
      <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <View
            style={{
              padding: ScreenWidth > 500 ? 40 : 5,
            }}>
            {historyData && historyData?.length > 0 ? (
              <Accordion
                sections={historyData}
                activeSections={activeSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                duration={400}
                onChange={_updateSections}
              />
            ) : (
              <DataNotFound />
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <AppBar title="ประวัติการซ่อม"></AppBar>
      <SafeAreaView>
        <Animated.ScrollView>
          <BackGroundImage components={Contents()} />
        </Animated.ScrollView>
      </SafeAreaView>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderHistoryPage;
