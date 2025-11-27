import { Button, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View,Alert, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import Loading from '../../components/loading';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { isNotCheckActionSignature } from '../../constants/Menu';
import { ROUTE } from '../../constants/RoutePath';
import { fetchWorkOrderCloseWork } from '../../services/workOrderSignature';
import styles from './SatisfactionAssessmentFormMultipleCss';
import { useNavigation, StackActions } from '@react-navigation/native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

type InterfaceProps = {
  orderId: any;
  multipleOrderManage: any
  type: any
};

type Inputs = {
  remark: string;
};

const SatisfactionAssessmentFormMultiplePage = (props: InterfaceProps) => {
  if (!isNotCheckActionSignature(props.type)) {
    return (
      <>
        <AppBar title="สรุปปิดงาน"></AppBar>
        <ScrollView>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>{props.orderId} coming soon show detail</Text>
        </ScrollView>
      </>
    );
  }
  const { control, getValues, setValue } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const { orderId } = props;
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
  const navigation = useNavigation();

  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetchWorkOrderCloseWork(orderId);
      if (result.isSuccess) {
        setWorkOrderCloseWorkValue(result.dataResult);
      }else{
        Alert.alert('เตือน',result.message, [
          { text: 'ตกลง', onPress: async () => {
            // router.Actions.pop()
            navigation.dispatch(StackActions.pop())
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
    // router.Actions.push("WorkOrderSignatureMultiple", {
    //   workOrderData: props,
    //   satisfactionAssessment: workOrderCloseValue,
    //   multipleOrderManage: props?.multipleOrderManage
    // });
    navigation.dispatch(StackActions.push("WorkOrderSignatureMultiple", {
      workOrderData: props,
      satisfactionAssessment: workOrderCloseValue,
      multipleOrderManage: props?.multipleOrderManage
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
        <RadioButton value={value} key={value} />
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
        key={`${icon}-${title}-${fieldName}`}
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
              width: ScreenWidth>500? 70:50,
              height:ScreenWidth>500? 70:50,
              backgroundColor: COLOR.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={icon} size={ScreenWidth>500? 40:20} color={COLOR.white} />
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
                justifyContent: 'flex-start',
                flexWrap:'wrap'
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
      <View style={[{ padding:ScreenWidth>500 ?40 : 10}]}>
        <Button style={styles.btn} onPress={_onSubmit}>
          <Text
            style={{
              color: 'white',
              
              fontFamily: Fonts.Prompt_Medium,
              fontSize:ScreenWidth>500? 22:16,
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
      <AppBar title="แบบประเมินความพึงพอใจ"></AppBar>
      <BackGroundImage
        components={
          <Animated.ScrollView>{Contents()}</Animated.ScrollView>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default SatisfactionAssessmentFormMultiplePage;
