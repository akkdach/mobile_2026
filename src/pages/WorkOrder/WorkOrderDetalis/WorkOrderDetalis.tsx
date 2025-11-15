import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, Text, View } from 'react-native';
import { Card, DataTable } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DataNotFound from '../../../components/DataNotFound';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { CatalogByID, CatalogByObjectType, WorkOrder } from '../../../models';
import { IWorkOrderDetailComponentList } from '../../../models/WorkOrderDetail';
import { DownloadCDEForm, fetchCDEForm, fetchWorkOrderDetail } from '../../../services/workOrder';
import { styleLg, styleSm } from './WorkOrderDetailsCss';
import { Fonts } from '../../../constants/fonts';
// import {WebView} from 'react-native-webview'
import { Button } from '@ant-design/react-native';
const WorkOrderDetailsPage = (props: any) => {
  const [barcodeUrl, setBarcodeUrl] = useState<string>();

  const data: any = props?.workOrderData;
  const [workOrderDetail, setWorkOrderDetail] = useState<any>();
  const [sparePart, setSparePart] = useState<
    IWorkOrderDetailComponentList[] | undefined
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const getWorkOrderDetail = (await fetchWorkOrderDetail(data.orderId))
        .dataResult;
      setWorkOrderDetail(getWorkOrderDetail);

      // console.log(JSON.stringify(getWorkOrderDetail, null, 2));
      // const getSparePart = await fetchSparePart();
      setSparePart(getWorkOrderDetail?.componentList);
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);



  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    if (screenInfo.width < 400) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, []);

  const onLoadCDEForm = async () => {
    const pdf = (await DownloadCDEForm(data.orderId))
    console.log('pdf', pdf)
  }

  const DrawHorizontalWidget = () => {
    return (
      <View
        style={[styles.DrawHorizontalWidget]}>
        <View
          style={{
            borderBottomColor: '#00000029',
            borderBottomWidth: 1,
          }}
        />
      </View>
    );
  };

  const ViewDetailWidget = (title: any, details: any) => {
    return (
      <View
        style={{
          flex: 6,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={[styles.flexEndStart]}>
          <Text style={styles.textTitle}>{title} :</Text>
        </View>
        <View
          style={[styles.flextStart]}>
          <Text style={styles.textContent}>{details}</Text>
        </View>
      </View>
    );
  };

  const SpareParts = () => {
    return (
      <View
        style={{
          padding: 40,
        }}>
        <View>
          <Text style={styles.titleProblems}>อะไหล่</Text>
          {sparePart ? (
            sparePart?.map(
              (val: IWorkOrderDetailComponentList, idx: number) => {
                return (
                  <Card style={{ padding: 10 }}>
                    <View style={{ justifyContent: 'flex-start' }}>
                      <Text style={styles.dataTableCell}>
                        รหัส : {val.sparePartNo ? val.sparePartNo : '-'}
                      </Text>
                    </View>
                    <View
                      style={{ flex: 3, justifyContent: 'flex-start' }}>
                      <Text style={styles.dataTableCell}>
                        รายการ : {val.material ? val.material : '-'}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={styles.dataTableCell}>
                        {val.requirementQuantity
                          ? val.requirementQuantity
                          : ''}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={styles.dataTableCell}>
                        จำนวน : {val.requirementQuantityUnit
                          ? val.requirementQuantityUnit
                          : '-'}
                      </Text>
                    </View>
                  </Card>
                );
              },
            )
          ) : (
            <DataNotFound />
          )}
        </View>
      </View>
    );
  };

  const SparePartsTable = () => {
    return (
      <View
        style={{
          padding: 40,
        }}>
        <View>
          <Text style={styles.titleProblems}>อะไหล่</Text>
          <DataTable style={{ paddingTop: 20 }}>
            <DataTable.Header style={{ backgroundColor: COLOR.primary }}>
              <DataTable.Title style={{ justifyContent: 'center' }}>
                <Text style={styles.dataTableTitle}>รหัสอะไหล่</Text>
              </DataTable.Title>
              <DataTable.Title style={{ flex: 3, justifyContent: 'center' }}>
                <Text style={styles.dataTableTitle}>รายการ</Text>
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: 'center' }}>
                <Text style={styles.dataTableTitle}>จำนวน</Text>
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: 'center' }}>
                <Text style={styles.dataTableTitle}>หน่วย</Text>
              </DataTable.Title>
            </DataTable.Header>
            {sparePart ? (
              sparePart?.map(
                (val: IWorkOrderDetailComponentList, idx: number) => {
                  return (
                    <DataTable.Row key={`${val.material}-${idx}`}>
                      <DataTable.Cell style={{ justifyContent: 'flex-start' }}>
                        <Text style={styles.dataTableCell}>
                          {val.sparePartNo ? val.sparePartNo : '-'}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{ flex: 3, justifyContent: 'flex-start' }}>
                        <Text style={styles.dataTableCell}>
                          {val.material ? val.material : '-'}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ justifyContent: 'center' }}>
                        <Text style={styles.dataTableCell}>
                          {val.requirementQuantity
                            ? val.requirementQuantity
                            : ''}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ justifyContent: 'center' }}>
                        <Text style={styles.dataTableCell}>
                          {val.requirementQuantityUnit
                            ? val.requirementQuantityUnit
                            : '-'}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                },
              )
            ) : (
              <DataNotFound />
            )}
          </DataTable>
        </View>
      </View>
    );
  };

  const _GroupCategory = (data: CatalogByObjectType[]) => {
    let codes = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].codegrp.length; j++) {
        let c = {
          code: data[i].codegrp[j].code,
          short_text: data[i].codegrp[j].short_text,
        };
        codes.push(c);
      }
    }
    return codes;
  };

  const _OrderProblem = (
    datas: CatalogByID[],
    categoryGroup: { code: string; short_text: string }[],
  ) => {
    let orderProblemData: any = [];
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].problem_code != null) {
        categoryGroup.map(val => {
          if (datas[i].problem_code == val.code) {
            orderProblemData.push({
              code: val.code,
              short_text: val.short_text,
              title: 'ปัญหาที่พบ',
              type: 'problem_code',
              order: 1,
            });
          }
          if (datas[i].damage_code == val.code) {
            orderProblemData.push({
              code: val.code,
              short_text: val.short_text,
              title: 'อาการที่เสีย',
              type: 'damage_code',
              order: 2,
            });
          }

          if (datas[i].cause_code == val.code) {
            orderProblemData.push({
              code: val.code,
              short_text: val.short_text,
              title: 'สาเหตุที่เสีย',
              type: 'cause_code',
              order: 3,
            });
          }

          if (datas[i].activity_code == val.code) {
            orderProblemData.push({
              code: val.code,
              short_text: val.short_text,
              title: 'วิธีการแก้ไข',
              type: 'activity_code',
              order: 4,
            });
          }
        });
      }
    }
    return orderProblemData.sort((a: any, b: any) => a.order - b.order);
  };

  const Details = () => {
    const { notification_header, actual_start_time, operations }: WorkOrder =
      data;
    let start_time = '';
    if (notification_header?.notif_time != null) {
      start_time =
        notification_header?.notif_time.substr(0, 2) +
        ':' +
        notification_header?.notif_time.substr(2, 2);
    }

    if (notification_header?.notif_date != null) {
      let enter_date = notification_header?.notif_date.substr(0, 10);
      let enter_date_part = enter_date.split('-');

      notification_header.notif_date =
        enter_date_part[2] +
        '/' +
        enter_date_part[1] +
        '/' +
        enter_date_part[0];
    }

    let check_in_time = '-';
    if (actual_start_time != null) {
      check_in_time =
        actual_start_time.substr(0, 2) +
        ':' +
        actual_start_time.substr(2, 2) +
        ' น.';
    }

    let finish_time_opr = '-';
    if (operations != null) {
      if (operations[operations.length - 1].work_actual_finish != null) {
        finish_time_opr =
          operations[operations.length - 1].work_actual_finish + ' น.';
      }
    }
    return (
      <View
        style={{
          flexDirection: 'column',
          padding: 40,
        }}>
        {ViewDetailWidget(
          'เรื่อง',
          `${workOrderDetail?.title ? workOrderDetail?.title : '-'}`,
        )}
        {ViewDetailWidget(
          'วัน/เวลาที่แจ้ง',
          `${workOrderDetail?.dateRequest
            ? moment(workOrderDetail?.dateRequest).format(
              'DD-MM-YYYY HH:mm น.',
            )
            : '-'
          }`,
        )}
        {ViewDetailWidget(
          'วัน/เวลาที่ต้องเริ่ม',
          `${workOrderDetail?.SCHEDUE_START_DATE && workOrderDetail?.dateRequest
            ? moment(workOrderDetail?.SCHEDUE_START_DATE).format(
              'DD-MM-YYYY',
            )
            : '-'
          }`,
        )}
        {ViewDetailWidget(
          'วัน/วันเวลาที่ต้องเสร็จ',
          `${workOrderDetail?.SCHEDUE_START_DATE && workOrderDetail?.dateRequest
            ? moment(workOrderDetail?.SCHEDUE_FINISH_DATE).format(
              'DD-MM-YYYY',
            )
            : '-'
          }`,
        )}
        {ViewDetailWidget(
          'รายละเอียด',
          `${workOrderDetail?.notiLongText ? workOrderDetail?.notiLongText : '-'
          }`,
        )}
        {ViewDetailWidget(
          'เลขที่',
          `${workOrderDetail?.notiIncident ? workOrderDetail?.notiIncident : '-'
          }`,
        )}
        {ViewDetailWidget(
          'Work order',
          `${workOrderDetail?.orderId ? workOrderDetail?.orderId : '-'}`,
        )}
        {ViewDetailWidget(
          'CDE Code แจ้ง',
          `${workOrderDetail?.cdeCode ? workOrderDetail?.cdeCode : '-'}`,
        )}
        {ViewDetailWidget(
          'Serial No. แจ้ง',
          `${workOrderDetail?.serialNo ? workOrderDetail?.serialNo : '-'}`,
        )}
        {ViewDetailWidget(
          'Euipment แจ้ง',
          `${workOrderDetail?.equipment ? workOrderDetail?.equipment : '-'}`,
        )}
        {ViewDetailWidget(
          'Obj.Type แจ้ง',
          `${workOrderDetail?.objType ? workOrderDetail?.objType : '-'}`,
        )}
        {/* {ViewDetailWidget('Obj.Type พบ', '-')} */}
        {ViewDetailWidget(
          'Model',
          `${workOrderDetail?.model ? workOrderDetail?.model : '-'}`,
        )}
      </View>
    );
  };
  const RenderDoc = () => {
    return <>
      <Button key={'downloadbtn'} style={[{ backgroundColor: '#CECECE' }]} onPress={() => onLoadCDEForm()}>
        <Text
          style={{
            color: 'white',
            fontSize: 22,
            fontFamily: Fonts.Prompt_Medium,
          }}>
          ใบเบิกเครื่อง
        </Text>
      </Button>
    </>
  }

  return (
    <>
      <AppBar title="รายละเอียดของงาน"></AppBar>
      <SafeAreaView>
        <Animated.ScrollView>
          <BackGroundImage
            components={
              <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  {RenderDoc()}
                  {/* <WebView source={'http://google.com'}></WebView> */}
                  {Details()}
                  {DrawHorizontalWidget()}
                  {DrawHorizontalWidget()}
                  {screenInfo.width < 400 ? SpareParts() : SparePartsTable()}
                </View>
              </ScrollView>
            }></BackGroundImage>
        </Animated.ScrollView>
      </SafeAreaView>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderDetailsPage;
