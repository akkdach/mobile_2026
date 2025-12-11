import { Button, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';
import AppBar from '../../components/AppBar';
import Loading from '../../components/loading';
import styleSheet from '../../components/StyleSheet';
import Terms from '../../components/Terms';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { isShowSignatureMessage } from '../../constants/Menu';
import { ROUTE } from '../../constants/RoutePath';
import { IWorkOrderCloseWork } from '../../models/WorkOrderCloseWork';
import { uploadImage } from '../../services/upload';
import { fetchWorkOrderCloseWorkPost } from '../../services/workOrderSignature';
import WorkOrderSignatureMultipleComponent from './WorkOrderSignatureMultipleComponent';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
    objType: string;
    type: string;
  };
  satisfactionAssessment: IWorkOrderCloseWork;
  multipleOrderManage: any;
};

type Inputs = {
  customer: string;
  customeR_Remark: string;
  mobile_Remark: string;
};

const WorkOrderSignatureMultiple = (props) => {
  const params = props.route.params as InterfaceProps;
  console.log(
    'params.satisfactionAssessment ====>',
    params.satisfactionAssessment,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { orderId } = params?.workOrderData;
  const { control, getValues, setValue } = useForm<Inputs>();
  const [visibleModalCustomer, setStateVisibleModalCustomer] = useState(false);
  const [signatureCustomer, setSignatureCustomer] = useState<any>();
  const [visibleModalWorker, setStateVisibleModalWorker] = useState(false);
  const [signatureWorker, setSignatureWorker] = useState<any>();
  const [satisfactionAssessment, setSatisfactionAssessment] =
    useState<IWorkOrderCloseWork>(params.satisfactionAssessment);
  const [warranty, setWarranty] = useState<any>(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (params.satisfactionAssessment.customerSignatureUrl) {
      setSignatureCustomer(params.satisfactionAssessment.customerSignatureUrl);
    }

    if (params.satisfactionAssessment.workerSignatureUrl) {
      setSignatureWorker(params.satisfactionAssessment.workerSignatureUrl);
    }

    if (params.satisfactionAssessment.customerSignatureName) {
      setValue('customer', params.satisfactionAssessment.customerSignatureName);
    }

    if (params.satisfactionAssessment.warranty) {
      const status =
        params.satisfactionAssessment.warranty === '1' ? true : false;
      setWarranty(status);
    }

    if (params.satisfactionAssessment.customeR_Remark) {
      setValue('customeR_Remark', params.satisfactionAssessment.customeR_Remark);
    }

    if (params.satisfactionAssessment.mobile_Remark) {
      setValue('mobile_Remark', params.satisfactionAssessment.mobile_Remark);
    }
  }, []);

  const saveImageSign = async (
    result: { name: string; type: string; base64Url: string },
    type: string,
  ) => {
    if (type === 'customer') {
      setSignatureCustomer('data:image/jpeg;base64,' + result.base64Url);
    } else {
      setSignatureWorker('data:image/jpeg;base64,' + result.base64Url);
    }

    postImageUpload(result, type);
  };

  const postImageUpload = async (
    result: { name: string; type: string; base64Url: string },
    type: string,
  ) => {
    try {
      const imageData = result.base64Url;
      const imagePath = `${RNFS.TemporaryDirectoryPath}image.jpg`;
      RNFS.writeFile(imagePath, imageData, 'base64').then(() =>
        console.log('Image converted to jpg and saved at ' + imagePath),
      );

      const response: any = await uploadImage(
        {
          uri: 'file://' + imagePath,
          type: 'image/jpeg',
          fileName: 'cacheimage.jpg',
        },
        orderId,
      );

      if (type === 'customer') {
        setSatisfactionAssessment((previous: any) => {
          return {
            ...previous,
            ...{ customerSignatureUrl: response.fileDisplay },
          };
        });
      } else {
        setSatisfactionAssessment((previous: any) => {
          return {
            ...previous,
            ...{ workerSignatureUrl: response.fileDisplay },
          };
        });
      }
    } catch (error) {
      Alert.alert('แจ้งเตือน', error.message, [
        { text: 'ตกลง', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  const onSetModalClose = (type: string) => {
    if (type === 'customer') {
      setStateVisibleModalCustomer(!visibleModalCustomer);
    } else {
      setStateVisibleModalWorker(!visibleModalWorker);
    }
  };

  const _onSubmit = async () => {
    Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ยืนยัน',
        onPress: async () => {
          await postWorkOrderCloseWork();
        },
      },
    ]);
  };

  const postWorkOrderCloseWork = async () => {
    try {
      setIsLoading(true);
      if (params.multipleOrderManage) {
        params.multipleOrderManage.map(async (val: any, index: any) => {
          let data = {
            ...satisfactionAssessment,
            ...{ workOrder: val.orderId },
            ...{ warranty: `${warranty}` },
            ...{ customerSignatureName: getValues().customer },
            ...{ customeR_Remark: getValues().customeR_Remark },
            ...{ mobile_Remark: getValues().mobile_Remark },
          };
          let response = await fetchWorkOrderCloseWorkPost(data);
          if (params.multipleOrderManage.length === index + 1) {
            if (response.isSuccess) {
              Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
                {
                  text: 'ปิด',
                  onPress: async () => {
                    // Actions.replace(ROUTE.WORKORDER);
                    navigation.dispatch(StackActions.replace(ROUTE.WORKORDER));
                  },
                },
              ]);
            } else {
              Alert.alert('แจ้งเตือน', response.message, [
                { text: 'ตกลง', onPress: () => console.log('OK Pressed') },
              ]);
            }
          }
        });
      }
      const response = await fetchWorkOrderCloseWorkPost({
        ...satisfactionAssessment,
        ...{ workOrder: orderId },
        ...{ warranty: `${warranty}` },
        ...{ customerSignatureName: getValues().customer },
        ...{ customeR_Remark: getValues().customeR_Remark },
        ...{ mobile_Remark: getValues().mobile_Remark },
      });
    } catch (error) {
      Alert.alert('แจ้งเตือน', error.message, [
        { text: 'ตกลง', onPress: () => console.log('OK Pressed') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const Contents = () => {
    return (
      <ScrollView>
        {isShowSignatureMessage(params.workOrderData.type) && <Terms />}

        <SafeAreaView style={styles.container}>
          <View style={{ padding: 10 }}>
            {signatureCustomer && (
              <View>
                <View
                  style={{ paddingTop: 10, borderWidth: 1, borderColor: '#888' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.Prompt_Medium,
                      textDecorationLine: 'underline',
                      paddingLeft: 10,
                    }}>
                    ลายเซ็นต์ลูกค้า
                  </Text>
                  <View style={{ paddingTop: 30 }}>
                    <Image
                      source={{ uri: signatureCustomer }}
                      style={{ width: '100%', height: 300 }}></Image>
                  </View>
                </View>

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styleSheet.input,
                        { height: 60, width: '100%', marginLeft: -10 },
                      ]}
                      placeholderTextColor={'#FFFFFF'}
                      placeholder="ชื่อลูกค้าที่ติดต่อ"
                      value={value}
                      onChangeText={textSearch => onChange(textSearch)}
                    />
                  )}
                  name="customer"
                  defaultValue={
                    params.satisfactionAssessment.customerSignatureName
                  }
                />
              </View>
            )}
            <View style={{ marginTop: 10 }}>
              <Controller

                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styleSheet.input,
                      { height: 60, width: '100%', marginLeft: -10 },
                    ]}
                    placeholderTextColor={'#FFFFFF'}
                    placeholder="หมายเหตุลูกค้า"
                    value={value}
                    onChangeText={textSearch => onChange(textSearch)}
                  />
                )}
                name="customeR_Remark"
                defaultValue={
                  params.satisfactionAssessment.customeR_Remark
                }
              />
            </View>
            {signatureWorker && (
              <View style={{ paddingTop: 30 }}>
                <View
                  style={{ paddingTop: 10, borderWidth: 1, borderColor: '#888' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.Prompt_Medium,
                      textDecorationLine: 'underline',
                      paddingLeft: 10,
                    }}>
                    ลายเซ็นต์ช่าง
                  </Text>
                  <View style={{ paddingTop: 30 }}>
                    <Image
                      source={{ uri: signatureWorker }}
                      style={{ width: '100%', height: 300 }}></Image>
                  </View>
                </View>
              </View>
            )}
            <View style={{ marginTop: 10 }}>
              <Controller

                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styleSheet.input,
                      { height: 60, width: '100%', marginLeft: -10 },
                    ]}
                    placeholderTextColor={'#FFFFFF'}
                    placeholder="หมายเหตุช่าง"
                    value={value}
                    onChangeText={textSearch => onChange(textSearch)}
                  />
                )}
                name="mobile_Remark"
                defaultValue={
                  params.satisfactionAssessment.mobile_Remark
                }
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingLeft: 30,
                paddingRight: 30,
              }}>
              <Button
                style={{ ...styles.btnOutline, marginRight: 10 }}
                onPress={() =>
                  setStateVisibleModalCustomer(!visibleModalCustomer)
                }>
                <Icon
                  name="edit"
                  style={{ fontSize: 24, color: COLOR.secondary_primary_color }}
                />
                <Text
                  style={{
                    color: COLOR.secondary_primary_color,
                    fontSize: 22,
                    fontFamily: Fonts.Prompt_Medium,
                    display: 'flex',
                  }}>
                  {signatureCustomer
                    ? 'แก้ไขลายเซ็นต์ลูกค้า'
                    : 'เพิ่มลายเซ็นต์ลูกค้า'}
                </Text>
              </Button>
              <Button
                style={styles.btnOutline}
                onPress={() => setStateVisibleModalWorker(!visibleModalWorker)}>
                <Text
                  style={{
                    color: COLOR.secondary_primary_color,
                    fontSize: 22,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  <Icon
                    name="edit"
                    style={{ fontSize: 24, color: COLOR.secondary_primary_color }}
                  />
                  {signatureWorker
                    ? 'แก้ไขลายเซ็นต์ช่าง'
                    : 'เพิ่มลายเซ็นต์ช่าง'}
                </Text>
              </Button>
            </View>
          </View>

          <WorkOrderSignatureMultipleComponent
            title={'ลายเซ็นต์ลูกค้า'}
            type={'customer'}
            saveImageSign={saveImageSign}
            visibleModal={visibleModalCustomer}
            setStateVisibleModal={(type: string) => onSetModalClose(type)}
          />
          <WorkOrderSignatureMultipleComponent
            title={'ลายเซ็นต์ช่าง'}
            type={'worker'}
            saveImageSign={saveImageSign}
            visibleModal={visibleModalWorker}
            setStateVisibleModal={(type: string) => onSetModalClose(type)}
          />
        </SafeAreaView>
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Checkbox
              status={warranty ? 'checked' : 'unchecked'}
              onPress={() => {
                setWarranty(!warranty);
              }}
            />
            <Text
              style={{
                marginTop: 6,
                paddingLeft: 10,
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 16,
              }}>
              Warranty order
            </Text>
          </View>
        </View>
        <View style={[{ paddingTop: 20, padding: 40 }]}>
          <Button style={styles.btn} onPress={() => _onSubmit()}>
            <Text
              style={{
                color: 'white',
                fontSize: 22,
                fontFamily: Fonts.Prompt_Medium,
              }}>
              ยืนยัน
            </Text>
          </Button>
        </View>
      </ScrollView>
    );
  };

  const renderSatisfactionAssessmentForm = () => {
    return [<AppBar title="เซ็นชื่อ"></AppBar>, Contents()];
  };

  return (
    <>
      {renderSatisfactionAssessmentForm()}
      <Loading loading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
  btnOutline: {
    width: '50%',
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 22,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
    textDecorationLine: 'underline',
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: Fonts.Prompt_Medium,
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 16,
    fontFamily: Fonts.Prompt_Light,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
  },
});

export default WorkOrderSignatureMultiple;
