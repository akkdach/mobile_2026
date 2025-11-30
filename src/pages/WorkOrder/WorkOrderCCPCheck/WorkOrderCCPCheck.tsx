import {Button, Modal} from '@ant-design/react-native';
import React, {FC, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-paper';
import AppBar from '../../../components/AppBar';
import TextInputComponent from '../../../components/TextInput';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import styleSheet from '../../../components/StyleSheet';
import BackGroundImage from '../../../components/BackGroundImage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import {fetchCCPCheck} from '../../../services/workOrderCCP';
import {customLog} from '../../../utils/CustomConsole';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {StackActions, useNavigation} from '@react-navigation/native';
import { ROUTE } from '../../../constants/RoutePath';

type Inputs = {
  equipmentNo: string;
};

type InterfaceProps = {
  workOrderData: {
    orderId: string
  }
};

const WorkOrderCCPCheck: FC<InterfaceProps> = (props: InterfaceProps) => {
  const navigation = useNavigation();
  const { orderId } = props?.workOrderData
  const [stateForm, setStateForm] = useState({equipmentNo: ''});
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    console.log('[data]==>', data);
    const ccpCheck = await fetchCCPCheck(data.equipmentNo);
    if(!ccpCheck.dataResult) {
      setIsVisibleModal(true);
      setValue("equipmentNo", '')
      customLog(ccpCheck, 'info');
    } else {
      Alert.alert("CCP")
    }
  
    
  };

  const onGoToModalCheckOut = () => {
    navigation.dispatch(StackActions.push(ROUTE.WORKORDERLIST, {checkoutData: { orderId, closeType: 2 }}));
  }

  const onClose = () => {
    setIsVisibleModal(false);
  };

  const foundCCPCheck = () => {
    return (
      <Modal
        style={[{width: 600, height: 300}]}
        visible={isVisibleModal}
        transparent
        maskClosable={false}
        onClose={onClose}
        footer={[
          {
            text: 'ปิด',
            onPress: () => onClose,
          },
          {
            text: 'สถานะงาน',
            onPress: () => onGoToModalCheckOut(),
          },
        ]}>
        <View style={{height: 200, overflow: 'scroll'}}>
          <Text style={styles.title}>CCP</Text>
        </View>
      </Modal>
    );
  };

  const notFoundCCPCheck = () => {
    return (
      <Modal
        style={[{width: 600, height: 300}]}
        visible={isVisibleModal}
        transparent
        maskClosable={false}
        footer={[
          {
            text: 'ปิด',
            onPress: () => onClose(),
          }
        ]}
        >
        <View style={{height: 200, overflow: 'scroll'}}>
          <Text style={styles.title}>Not CCP</Text>
        </View>
      </Modal>
    );
  };

  const FormInput = () => {
    return (
      <ScrollView>
        <View style={[{padding: 40}]}>
          <Card style={styleSheet.card_custom}>
            <Card.Content>
              <View style={[{padding: 10}]}>
                <Text
                  style={[
                    {
                      paddingTop: 20,
                      paddingBottom: 20,
                      fontSize: 20,
                      fontFamily: Fonts.Prompt_Medium,
                    },
                  ]}>
                  Equipment No
                </Text>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInputComponent
                      value={value}
                      onBlur={onBlur}
                      style={{textAlign:'left'}}
                      onChangeText={(value: string) => onChange(value)}
                      placeholder="Equipment No"></TextInputComponent>
                  )}
                  name="equipmentNo"
                  defaultValue=""
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <View style={[{padding: 10, width: 250}]}>
                  <Button style={styles.btn} onPress={handleSubmit(onSubmit)}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 22,
                        fontFamily: Fonts.Prompt_Medium,
                      }}>
                      Check
                    </Text>
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <BackGroundImage
        components={
          <Animated.View>
            <AppBar title="CCP Check" rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar>
            {foundCCPCheck()}
            {notFoundCCPCheck()}
            {FormInput()}
          </Animated.View>
        }></BackGroundImage>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    textAlign: 'center',
    paddingTop: 60,
  },
  btn: {
    width: '100%',
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
  input: {
    height: 62,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    fontSize: 18,
    borderColor: COLOR.secondary_primary_color,
    marginBottom: 10,
    borderRadius: 20,
    color: '#000000',
  },
});

export default WorkOrderCCPCheck;
