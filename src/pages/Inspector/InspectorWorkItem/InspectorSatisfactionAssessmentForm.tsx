import { Button, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, ScrollView, Text, TextInput, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import Loading from '../../../components/loading';
import Terms from '../../../components/Terms';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {isNotCheckActionSignature, isShowSignatureMessage} from '../../../constants/Menu';
import {ROUTE} from '../../../constants/RoutePath';
import { IWorkOrderCloseWork } from '../../../models/WorkOrderCloseWork';
import { fetchWorkOrderCloseWorkInspector } from '../../../services/visitInspector';
import {fetchWorkOrderCloseWork} from '../../../services/workOrderSignature';
import {stylesLg,stylesSm} from './InspectorSatisfactionAssessmentFormCss';
import { useNavigation, StackActions } from '@react-navigation/native';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
    type: string;
    webStatus: string
    workType: string
  };
  satisfactionAssessment: IWorkOrderCloseWork;
};

type Inputs = {
  remark: string;
};

const InspectorSatisfactionAssessmentFormPage = (props) => {
  const params = props.route?.params as InterfaceProps;
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  }, [screenInfo]);

  if (!isNotCheckActionSignature(params.workOrderData.type)) {
    return (
      <>
        <AppBar title="สรุปปิดงาน"></AppBar>
        <ScrollView>
          <Text style={{textAlign: 'center', marginTop: 20}}>{params.workOrderData.orderId} coming soon show detail</Text>
        </ScrollView>
      </>
    );
  }
  const {control, getValues, setValue} = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const { orderId, workType } = params?.workOrderData;
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
  }) as any;

  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetchWorkOrderCloseWorkInspector(orderId, workType);
      if (result.isSuccess) {
        setWorkOrderCloseWorkValue(result.dataResult);
      }else{
        Alert.alert('เตือน',result.message, [
          { text: 'ตกลง', onPress: async () => {
            navigation.dispatch(StackActions.pop());
          } },
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
    navigation.dispatch(StackActions.push(ROUTE.INSPECTOR_WORK_ORDER_SIGNATURE, {
      workOrderData: params?.workOrderData,
      satisfactionAssessment: workOrderCloseValue,
    }));
  };

  const RadioButtonItem = (value: any, textLabel: string) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 6,
          justifyContent: 'space-between',
        }}>
        <RadioButton 
          value={value} 
          key={value} 
          // disabled={params.workOrderData.webStatus !== '4' ? false : true}
        />
        <Text style={styles.labelRadio}>{textLabel}</Text>
      </View>
    );
  };

  const InputRemark = () => {
    return (
      <View style={[{ padding: 40 }]}>
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
                // editable={params.workOrderData.webStatus !== '4' ? true : false}
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
            style={{
              borderRadius: 50,
              width: 70,
              height: 70,
              backgroundColor: COLOR.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={icon} size={40} color={COLOR.white} />
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

          <RadioButton.Group
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
          </RadioButton.Group>
        </View>
      </View>
    );
  };

  const ViewDetailWidget2 = (icon?: any, title?: any, fieldName?: string) => {
    return (<>
      <View
        style={{
          flex: 6,
          flexDirection: 'row',
          padding: 0,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems: 'flex-end',
            flex: 1,
          }}>
          <View
            style={{
              borderRadius: 50,
              width: 30,
              height: 30,
              backgroundColor: COLOR.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={icon} size={20} color={COLOR.white} />
          </View>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 6,
            paddingLeft: 5,
            paddingTop: 4,
          }}>
          <Text style={styles.titleRadio}>{title}</Text>

          <RadioButton.Group
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
              }}>
              {RadioButtonItem('least', 'น้อยสุด')}
              {RadioButtonItem('little', 'น้อย')}
              
              {RadioButtonItem('moderate', 'ปานกลาง')}
            </View>
            <View style={{
              flexDirection:'row',
            }}>
              {RadioButtonItem('very', 'มาก')}
              {RadioButtonItem('most', 'มากที่สุด')}
            </View>
          </RadioButton.Group>
        </View>
      </View>
      
    </>
    );
  };

  const FormSatisfaction = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
        }}>
        {ViewDetailWidget2('reload', 'ความรวดเร็ว', 'speed')}
        {ViewDetailWidget2('smile', 'ความสุภาพ', 'politeness')}
        {ViewDetailWidget2('clock-circle', 'ความตรงต่อเวลา', 'punctual')}
        {ViewDetailWidget2('delete', 'ความสะอาด', 'cleanliness')}
        {ViewDetailWidget2(
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
      <View style={[{ padding: 40 }]}>
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
        <View style={{ padding: 40 }}>{Title()}</View>
        {FormSatisfaction()}
        {InputRemark()}
        {ButtonSubmit()}
      </ScrollView>
    );
  };

  return (
    <>
      {screenInfo.width < 500 ? <AppBar title={`แบบประเมินความพึงพอใจ ${params.workOrderData.orderId}`} ></AppBar>:
      <AppBar title="แบบประเมินความพึงพอใจ" rightTitle={`Order: ${params.workOrderData.orderId}`}></AppBar>}
      <BackGroundImage
        components={
          <Animated.ScrollView>{Contents()}</Animated.ScrollView>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default InspectorSatisfactionAssessmentFormPage;
