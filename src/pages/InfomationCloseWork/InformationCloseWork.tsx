import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Loading from '../../components/loading';
import { fetctInformationCloseWork } from '../../services/informationCloseWork';
import {styleLg,styleSm} from './InformationCloseWorkCss';

type InterfaceProps = {
    orderId: string,
    workType?: string
};

const InformationCloseWorkPage = (props: InterfaceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { orderId, workType } = props;
  const [informationCloseWork, setInformationCloseWork] = useState<any>()

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  },[screenInfo]);
  
  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetctInformationCloseWork(orderId, workType);
      console.log('[fetctInformationCloseWork result]', JSON.stringify(result, null, 2));
      if (result.isSuccess) {
        setInformationCloseWork(result.dataResult);
      }
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAll();
  }, [props]);

  const Header = () => {
    return (
      <View style={styles.header}>
        <Text
          style={
            styles.collapsibleTitle
          }>{`สรุปปิดงาน`}</Text>
      </View>
    );
  }

  const ContentInspector = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.column]}>
          <Text style={styles.textStyleTitle}>เวลาปฏิบัติงาน</Text>
          <Text style={styles.textStyleTitle}>วันที่</Text>
          <Text style={styles.textStyleTitle}>ประเภทของอุปกรณ์</Text>
          <Text style={styles.textStyleTitle}>Model</Text>
          <Text style={styles.textStyleTitle}>หมายเลขอุปกรณ์</Text>
        </View>
        <View style={[styles.column]}>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_operation_time ? informationCloseWork.work_order_operation_time : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_operation_end_date ? informationCloseWork.work_order_operation_end_date : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_object_type ? informationCloseWork.work_order_object_type : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_eq_model ? informationCloseWork.work_order_eq_model : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_equipment ? informationCloseWork.work_order_equipment : '-'}</Text>
        </View>
      </View>
    )
  }

  const Content = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.column]}>
          <Text style={styles.textStyleTitle}>เวลาปฏิบัติงาน</Text>
          <Text style={styles.textStyleTitle}>วันที่</Text>
          <Text style={styles.textStyleTitle}>รายละเอียดงานที่ลูกค้าต้องการให้บริการ</Text>
          <Text style={styles.textStyleTitle}>อาการที่ลูกค้าแจ้ง</Text>
          <Text style={styles.textStyleTitle}>สาเหตุของปัญหา</Text>
          <Text style={styles.textStyleTitle}>การแก้ไข</Text>
          {
            informationCloseWork?.component.map((item: any, index: number) => {
              return <Text style={styles.textStyle}>{index === 0 ? 'รายการอะไหล่ที่ใช้' : ''}</Text>
            })
          }
          <Text style={styles.textStyleTitle}>ประเภทของอุปกรณ์</Text>
          <Text style={styles.textStyleTitle}>Model</Text>
          <Text style={styles.textStyleTitle}>หมายเลขอุปกรณ์</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_operation_time ? informationCloseWork.work_order_operation_time : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_operation_end_date ? informationCloseWork.work_order_operation_end_date : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_short_text ? informationCloseWork.work_order_short_text : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.actual_damage.damage ? informationCloseWork.actual_damage.damage : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.actual_damage.problem ? informationCloseWork?.actual_damage?.problem : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.actual_damage.repair ? informationCloseWork.actual_damage.repair : '-'}</Text>
          {
            informationCloseWork?.component.map((item: any, index: number) => {
              return <Text style={styles.textStyle}>{item.material} {item.matl_des} {item.quantity} {item.unit}</Text>
            })
          }
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_object_type ? informationCloseWork.work_order_object_type : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_eq_model ? informationCloseWork.work_order_eq_model : '-'}</Text>
          <Text style={styles.textStyle}>{informationCloseWork?.work_order_equipment ? informationCloseWork.work_order_equipment : '-'}</Text>
        </View>
      </View>
    )
  }

  const Contents = () => {
    if(workType === 'inspector') {
      return ContentInspector()
    } else if(workType === 'visit') {
      return <View></View>
    } else {
      return Content()
    }
  };

  return (
    <>
      {Header()}
      {Contents()}
      <Loading loading={isLoading} />
    </>
  );
};

export default InformationCloseWorkPage;
