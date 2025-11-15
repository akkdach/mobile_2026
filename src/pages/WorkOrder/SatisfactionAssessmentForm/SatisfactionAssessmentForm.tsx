import { Button, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View ,Alert, Dimensions} from 'react-native';
import { Divider, RadioButton } from 'react-native-paper';
import Animated, { Value } from 'react-native-reanimated';
import * as router from 'react-native-router-flux';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import Loading from '../../../components/loading';
import Terms from '../../../components/Terms';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { isNotCheckActionSignature, isShowSignatureMessage } from '../../../constants/Menu';
import { ROUTE } from '../../../constants/RoutePath';
import { fetchWorkOrderCloseWork } from '../../../services/workOrderSignature';
import WorkOrderQlChecklistCloseWork from '../WorkOrderQlChecklistCloseWork/WorkOrderQlChecklistCloseWork';
import {stylesLg,stylesSm} from './SatisfactionAssessmentFormCss';

type InterfaceProps = {
  workOrderData: {
    backReloadPage: boolean;
    orderId: string;
    type: string;
    workCenter: string;
    objType: string;
    orderTypeDescription: string;
    webStatus: string
  };
};

type Inputs = {
  remark: string;
};

const SatisfactionAssessmentFormPage = (props: InterfaceProps) => {
  if (!isNotCheckActionSignature(props.workOrderData.type)) {
    return (
      <>
        <AppBar title="สรุปปิดงาน"></AppBar>
        <ScrollView>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>{props.workOrderData.orderId} coming soon show detail</Text>
        </ScrollView>
      </>
    );
  }
  const { control, getValues, setValue } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const { orderId } = props?.workOrderData;
  const [workOrderCloseValue, setWorkOrderCloseWorkValue] = React.useState({
    speed: '',
    politeness: '',
    punctual: '',
    cleanliness: '',
    satisfaction: '',
    remark: '',
    customerSignatureUrl: '',
    workerSignatureUrl: '',
    customerSignatureName: '',
    workerSignatureName: '',
    customerInconvenience: '',
  }) as any;

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

  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetchWorkOrderCloseWork(orderId);
      if (result.isSuccess) {
        setWorkOrderCloseWorkValue(result.dataResult);
      }else{
        Alert.alert('เตือน',result.message, [
          { text: 'ตกลง', onPress: async () => router.Actions.pop() },
        ]);
      }
    } catch (error) {
      Alert.alert("เตือน",'ไม่สามารถโหลดข้อมูลการปิดงานได้');
      setWorkOrderCloseWorkValue(null);
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAll();
  }, []);

  useEffect(() => {
    setValue('remark', workOrderCloseValue.remark);
  }, [workOrderCloseValue]);

  const _onSubmit = () => {
    const { remark } = getValues();
    workOrderCloseValue.remark = remark;
    setWorkOrderCloseWorkValue({ ...workOrderCloseValue });
    router.Actions.push(ROUTE.SIGNATURE, {
      workOrderData: props?.workOrderData,
      satisfactionAssessment: workOrderCloseValue,
    });
  };

  const RadioButtonItem = (value: any, textLabel: string) => {
    return (
      <View
        style={[styles.RadioButtonItem]}>
        <RadioButton value={value} key={value} disabled={props.workOrderData.webStatus !== '4' ? false : true} />
        <Text style={styles.labelRadio}>{textLabel}</Text>
      </View>
    );
  };

  const InputRemark = () => {
    return (
      <View style={[{ paddingLeft: 40, paddingRight: 40 }]}>
        <Text style={styles.labelRemark}>หมายเหตุ</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => {
            console.log('value', value);
            return (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={textSearch => onChange(textSearch)}
                editable={props.workOrderData.webStatus !== '4' ? true : false}
              />
            );
          }}
          name="remark"
          defaultValue=""
        />
      </View>
    );
  };

  const ViewDetailWidget = (icon?: any, title?: any, fieldName?: string) => {
    return (
      <View
        style={{
          flex: 4,
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems: 'flex-end',
            flex: 1,
          }}>
          <View
            style={[styles.ViewDetailWidget]}>
            <Icon name={icon} size={screenInfo.width < 500 ? 20 : 40} color={COLOR.white} />
          </View>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 6,
            paddingLeft: 20,
            paddingTop: 4,
          }}>
          <Text style={styles.titleRadio}>{title}</Text>

          {!workOrderCloseValue?.customerInconvenience &&<RadioButton.Group
            onValueChange={newValue =>
              setWorkOrderCloseWorkValue({
                ...workOrderCloseValue,
                [fieldName!]: newValue,
              })
            }
            value={workOrderCloseValue[fieldName!]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {RadioButtonItem('least', 'น้อยสุด')}
              {RadioButtonItem('little', 'น้อย')}
              {RadioButtonItem('moderate', 'ปานกลาง')}
              {RadioButtonItem('very', 'มาก')}
              {RadioButtonItem('most', 'มากที่สุด')}
            </View>
          </RadioButton.Group>}
        </View>
      </View>
    );
  };

  const ViewCostomer = ( title?: any, fieldName?: string) => {
    return (
      <View
        style={{
          flex: 4,
          flexDirection: 'row',
          padding: 10,
          alignItems:'center'
        }}>
          <RadioButton.Group
            onValueChange={newValue =>{
              setWorkOrderCloseWorkValue({
                ...workOrderCloseValue,
                [fieldName!]: workOrderCloseValue[fieldName!] =='Y' ? '' : 'Y' ,
              })
            }}
            value={workOrderCloseValue[fieldName!]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',}}>
                <RadioButton value='Y' />
                <Text style={styles.titleRadio}>{title}</Text>
            </View>
          </RadioButton.Group>
        </View>
    );
  };

  const FormCustomer = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems:'center',
        }}>
        {ViewCostomer( 'ลูกค้าไม่สะดวกประเมิน', 'customerInconvenience')}</View>

      )
  }

  const FormSatisfaction = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
        }}>
        {ViewDetailWidget('reload', 'ความรวดเร็ว', 'speed')}
        {ViewDetailWidget('smile', 'ความสุภาพ', 'politeness')}
        {ViewDetailWidget('clock-circle', 'ความตรงต่อเวลา', 'punctual')}
        {ViewDetailWidget('delete', 'ความสะอาด', 'cleanliness')}
        {ViewDetailWidget(
          'like',
          'ความพึงพอใจต่อการให้บริการครั้งนี้',
          'satisfaction',
        )}
      </View>
    );
  };

  const Title = () => {
    return (
      <View>
        <Text style={styles.title}>เรายินดีรับความพึงพอใจของท่าน</Text>
      </View>
    );
  };

  const ButtonSubmit = () => {
    return (
      <View style={[{ paddingLeft: 40, paddingRight: 40 , paddingBottom: 30}]}>
        <Button style={styles.btn} onPress={_onSubmit}>
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              fontFamily: Fonts.Prompt_Medium,
            }}>
            เซ็นชื่อ
          </Text>
        </Button>
      </View>
    );
  };

  const Contents = () => {
    return (
      <ScrollView>
        <View style={{ padding: 20 }}>{Title()}</View>
        {FormCustomer()}
        <Divider style={{ height:2 }}/>
        {FormSatisfaction()}
        {InputRemark()}
        {ButtonSubmit()}
        {/* <View>
          <WorkOrderQlChecklistCloseWork workOrderData={props?.workOrderData} />
        </View> */}

      </ScrollView>
    );
  };

  return (
    <>
      {screenInfo.width > 500 && <AppBar title="แบบประเมินความพึงพอใจ" rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar> }
      {screenInfo.width <= 500 && <AppBar title={`ประเมินความพึงพอใจ ${props.workOrderData.orderId}`} ></AppBar> }
      <BackGroundImage
        components={
          <Animated.ScrollView>{Contents()}</Animated.ScrollView>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default SatisfactionAssessmentFormPage;
