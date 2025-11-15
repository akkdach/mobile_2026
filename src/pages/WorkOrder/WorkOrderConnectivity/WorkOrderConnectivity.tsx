import {Button, Icon} from '@ant-design/react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Alert, ScrollView, Text, View} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import Animated from 'react-native-reanimated';
import { Actions } from 'react-native-router-flux';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import Loading from '../../../components/loading';
import Scanner from '../../../components/Scanner';
import TextInputComponent from '../../../components/TextInput';
import {COLOR} from '../../../constants/Colors';
import {WorkOrderConnectinvity} from '../../../models/WorkOrderConnectivity';
import {
  fetchConnectivity,
  updateConnectivity,
} from '../../../services/workOrderConnectivity';
import {customLog} from '../../../utils/CustomConsole';
import styles from './WorkOrderConnectivityCss';

type Props = {
  workOrderData: {
    orderId: string;
    webStatus: string;
  };
};

type Inputs = {
  cdCode: string;
  imeiConnectivityDevice: string;
  simMobileNo: string;
  simICCID: string;
  simServiceProvider: string;
  connectivityDeviceType: string;
};

const WorkOrderConnectivityPage: React.FC<Props> = ({workOrderData}) => {
  const initialValue = new WorkOrderConnectinvity({});
  const {control, handleSubmit, reset, setValue} = useForm<Inputs>({
    defaultValues: initialValue,
  });
  const isComponentMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [scan, setScan] = useState(false);
  const [activeQrType, setActiveQrType] = useState<string | undefined>(
    undefined,
  );

  const setNewValue = (newValue: WorkOrderConnectinvity) => {
    reset(newValue);
  };

  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetchConnectivity(workOrderData.orderId);
      const dataResult = response.data.dataResult;
      if (dataResult) {
        setNewValue(dataResult as WorkOrderConnectinvity);
      }
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isComponentMounted.current) {
      loadDataAll();
    }

    return () => {
      isComponentMounted.current = false;
    };
  }, [isComponentMounted]);

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setIsLoading(true);
    customLog(`dataSubmit +++>>>> ${JSON.stringify(data, null, 2)}`);
    try {
      const payload = {...data, workOrder: workOrderData.orderId};
      const updated = await updateConnectivity(payload);
      customLog(`updated +++>>>> ${JSON.stringify(updated, null, 2)}`);
      Actions.pop()
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const InputWidget = (
    label: any,
    name:
      | 'cdCode'
      | 'imeiConnectivityDevice'
      | 'simMobileNo'
      | 'simICCID'
      | 'simServiceProvider'
      | 'connectivityDeviceType',
    initialValue?: string,
  ) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 20,
        }}>
        <View
          style={{
            flex: 3,
            alignItems: 'flex-end',
          }}>
          <Text style={styles.labelInput}>{label}</Text>
        </View>
        <View
          style={{
            flex: 4,
          }}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <TextInputComponent
                  style={{height: 54}}
                  value={value}
                  onChangeText={(val: string) => onChange(val)}
                  onBlur={onBlur}
                  editable={workOrderData.webStatus !== '4' ? true : false}
                />
              );
            }}
            name={name}
            defaultValue={initialValue}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
          }}>
          <Icon
            name="qrcode"
            size={40}
            style={{paddingTop: 6, paddingLeft: 8}}
            color="#000000"
            onPress={() => {
              setScan(true);
              console.log('name ====>', name);
              setActiveQrType(name);
            }}
          />
        </View>
      </View>
    );
  };

  const BottomWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Button
          style={[
            styles.btn,
            colorBackground && {backgroundColor: colorBackground},
          ]}
          onPress={action}>
          <Text style={{color: 'white', fontSize: 22}}>{title}</Text>
        </Button>
      </View>
    );
  };

  const ButtonGroupEvent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 40,
        }}>
        <View style={{flex: 2}}>
          {BottomWidget(
            'ล้างจอ',
            handleSubmit(() => reset(initialValue)),
            COLOR.gray,
          )}
        </View>
        <View style={{flex: 2}}>
          {BottomWidget('บันทึก', handleSubmit(onSubmit))}
        </View>
      </View>
    );
  };

  const onValueScanner = (e: BarCodeReadEvent, type: string | undefined) => {
    console.log('barcode value =====>', e);
    switch (type) {
      case 'cdCode':
        setValue('cdCode', e.data);
        break;
      case 'imeiConnectivityDevice':
        setValue('imeiConnectivityDevice', e.data);
        break;
      case 'simMobileNo':
        setValue('simMobileNo', e.data);
        break;
      case 'simICCID':
        setValue('simICCID', e.data);
        break;
      case 'simServiceProvider':
        setValue('simServiceProvider', e.data);
        break;
      case 'connectivityDeviceType':
        setValue('connectivityDeviceType', e.data);
        break;
      default:
        break;
    }
    setScan(false);
  };

  const getQrTypeTitle = () => {
    switch (activeQrType) {
      case 'cdCode':
        return 'CDE Code';
      case 'imeiConnectivityDevice':
        return 'IMEI Connectivity Device';
      case 'simMobileNo':
        return 'SIM Mobile Number';
      case 'simICCID':
        return 'SIM ICCID';
      case 'simServiceProvider':
        return 'SIM Service Provider';
      case 'connectivityDeviceType':
        return 'SIM Service Provider';
      default:
        return '';
    }
  };

  return (
    <>
      <AppBar title="Connectivity" rightTitle={`Order: ${workOrderData.orderId}`}></AppBar>
      <SafeAreaView>
        <Animated.ScrollView>
          <BackGroundImage
            components={
              <ScrollView>
                {scan && (
                  <Scanner
                    title={getQrTypeTitle()}
                    onValue={e => onValueScanner(e, activeQrType)}
                    onClose={() => setScan(false)}
                  />
                )}
                {InputWidget('CDE Code :', 'cdCode', initialValue.cdCode)}
                {InputWidget(
                  'IMEI Connectivity Device :',
                  'imeiConnectivityDevice',
                  initialValue.imeiConnectivityDevice,
                )}
                {InputWidget(
                  'SIM Mobile Number :',
                  'simMobileNo',
                  initialValue.simMobileNo,
                )}
                {InputWidget('SIM ICCID :', 'simICCID', initialValue.simICCID)}
                {InputWidget(
                  'SIM Service Provider :',
                  'simServiceProvider',
                  initialValue.simServiceProvider,
                )}
                {InputWidget(
                  'Connectivity Device Type :',
                  'connectivityDeviceType',
                  initialValue.connectivityDeviceType,
                )}
                {workOrderData.webStatus !== '4' && ButtonGroupEvent()}
              </ScrollView>
            }
          />
        </Animated.ScrollView>
      </SafeAreaView>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderConnectivityPage;
